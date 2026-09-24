import {getChatGPTUser} from '@/app/chatgpt-auth';
import {database} from '@/db/raw';
import {recordLinks,letterStatus} from '@/app/record-links';
import type {Entry} from '@/app/model';
const kinds=new Set(['experience','reflection','story','school','requirement','goal','letter','essay','task','profile','capture','schoolNote']);
type StoredRecord={id:string;kind:string;data:string;version:number;updated:string};
function storedData(value:string):Record<string,string>{
  const raw:unknown=JSON.parse(value);
  if(!raw||typeof raw!=='object'||Array.isArray(raw))return {title:'Untitled entry'};
  return Object.fromEntries(Object.entries(raw).filter(([,v])=>v==null||['string','number','boolean'].includes(typeof v)).map(([k,v])=>[k,v==null?'':String(v)]));
}
function error(message:string,status=400){return Response.json({error:message},{status,headers:{'Cache-Control':'no-store'}});}
export async function GET(){
  const user=await getChatGPTUser();if(!user)return error('Sign in to open your workspace.',401);
  try{
    const result=await database().prepare('SELECT id,kind,data,version,updated FROM records WHERE owner = ? ORDER BY updated DESC').bind(user.userId).all<StoredRecord>();
    return Response.json({name:user.fullName||'',hasCompletedOnboarding:result.results.some(r=>r.kind==='preferences'&&storedData(r.data).hasCompletedOnboarding==='true'),records:result.results.filter(r=>r.kind!=='preferences').map(r=>({...r,data:storedData(r.data)}))},{headers:{'Cache-Control':'no-store'}});
  }catch{return error('Your records could not be loaded. Please try again.',503);}
}
export async function PUT(request:Request){
  const user=await getChatGPTUser();if(!user)return error('Sign in to save your work.',401);
  const origin=request.headers.get('origin');if(origin&&origin!==new URL(request.url).origin)return error('Request origin not allowed.',403);
  try{
    const raw=await request.text();if(raw.length>150000)return error('This entry is too large.',413);
    let body:unknown;try{body=JSON.parse(raw)}catch{return error('Invalid request format.');}
    if(!body||typeof body!=='object'||Array.isArray(body))return error('A valid entry is required.');
    const input=body as Record<string,unknown>;
    const {id,kind,version}=input;
    if(typeof id!=='string'||!id||id.startsWith('preferences:')||id.length>100||typeof kind!=='string'||!kinds.has(kind)||typeof version!=='number'||!Number.isInteger(version)||version<0)return error('A valid record is required.');
    if(!input.data||typeof input.data!=='object'||Array.isArray(input.data)||Object.values(input.data).some(v=>typeof v!=='string'))return error('Record fields must contain text values.');
    const data={...input.data} as Record<string,string>;
    if(typeof data.title!=='string'||(kind!=='profile'&&!data.title.trim())||data.title.length>250)return error('Give this entry a name before saving.');
    for(const key of ['hours','weekly','baseline','current','total','limit','characterLimit'])if(data[key]&&(Number(data[key])<0||!Number.isFinite(Number(data[key]))))return error('Amounts must be valid non-negative numbers.');
    for(const key of ['start','end','date','target','deadline','verified','interview','requestedDate','submittedDate'])if(data[key]&&(!/^\d{4}-\d{2}-\d{2}$/.test(data[key])||!Number.isFinite(Date.parse(data[key]))||new Date(data[key]).toISOString().slice(0,10)!==data[key]))return error('Choose a valid calendar date.');
    if(data.start&&data.end&&data.ongoing!=='true'&&data.end<data.start)return error('End date must be on or after start date.');
    if(kind==='task'&&data.status&&!['To do','In progress','Completed'].includes(data.status))return error('Choose a valid task status.');
    if(kind==='reflection'&&version===0&&!data.experience)return error('Choose the experience this reflection belongs to.');
    if(kind==='schoolNote'&&!data.school)return error('Choose a school for this note.');
    const now=new Date().toISOString(),db=database();
    const previousRow=version>0?await db.prepare('SELECT id,kind,data,version,updated FROM records WHERE id = ? AND owner = ? AND kind = ?').bind(id,user.userId,kind).first<StoredRecord>():null;
    if(version>0&&(!previousRow||previousRow.version!==version))return error('This entry changed in another window. Reload before editing again.',409);
    const previous=previousRow?storedData(previousRow.data):{};
    // Creation/completion timestamps are server-owned; legacy creation dates stay unknown.
    if(version===0)data.createdAt=now;else if(previous.createdAt)data.createdAt=previous.createdAt;else delete data.createdAt;
    delete data.completedAt;
    if(kind==='task'){
      const completed=data.status?data.status==='Completed':data.complete==='true';
      data.status=completed?'Completed':data.status||'To do';data.complete=String(completed);
      if(completed)data.completedAt=previous.completedAt||now;
    }
    if(kind==='letter'&&data.status){const status=letterStatus({data} as Entry);data.requested=String(['Requested','Confirmed','Submitted'].includes(status));data.agreed=String(['Confirmed','Submitted'].includes(status));data.submitted=String(status==='Submitted');}
    const guards:string[]=[],values:string[]=[];
    for(const field of recordLinks){
      if(!data[field])continue;
      if(data[field]===id)return error('An entry cannot link to itself.');
      const linked=await db.prepare('SELECT data FROM records WHERE id = ? AND owner = ? AND kind = ?').bind(data[field],user.userId,field).first<{data:string}>();
      if(!linked)return error('The linked record is no longer available. Choose another record.');
      guards.push('EXISTS (SELECT 1 FROM records AS parent WHERE parent.id = ? AND parent.owner = ? AND parent.kind = ?)');values.push(data[field],user.userId,field);
      if(kind==='reflection'&&field==='experience')data.hoursAtReflection=previous.experience===data.experience&&previous.hoursAtReflection!==undefined?previous.hoursAtReflection:String(storedData(linked.data).hours||0);
    }
    if(kind==='profile'&&version===0){guards.push("NOT EXISTS (SELECT 1 FROM records AS existing WHERE existing.owner = ? AND existing.kind = 'profile')");values.push(user.userId);}
    if(data.capture){guards.push("NOT EXISTS (SELECT 1 FROM records AS organized WHERE organized.owner = ? AND organized.id != ? AND json_extract(organized.data,'$.capture') = ?)");values.push(user.userId,id,data.capture);}
    const guard=guards.length?' AND '+guards.join(' AND '):'';
    const result=version===0?await db.prepare('INSERT INTO records (id,owner,kind,data,version,updated) SELECT ?,?,?,?,1,? WHERE 1=1'+guard+' ON CONFLICT(id) DO NOTHING').bind(id,user.userId,kind,JSON.stringify(data),now,...values).run():await db.prepare('UPDATE records SET data = ?, version = version + 1, updated = ? WHERE id = ? AND owner = ? AND kind = ? AND version = ?'+guard).bind(JSON.stringify(data),now,id,user.userId,kind,version,...values).run();
    if(!result.meta.changes)return error('This entry or a related record changed in another window. Reload before trying again.',409);
    return Response.json({record:{id,kind,data,version:version+1,updated:now}},{headers:{'Cache-Control':'no-store'}});
  }catch{return error('Your entry was not saved. Keep this window open and try again.',503);}
}
export async function DELETE(request:Request){
  const user=await getChatGPTUser();if(!user)return error('Sign in to manage your records.',401);
  const origin=request.headers.get('origin');if(origin&&origin!==new URL(request.url).origin)return error('Request origin not allowed.',403);
  let body:Record<string,unknown>;try{const parsed=await request.json();if(!parsed||typeof parsed!=='object'||Array.isArray(parsed))throw new Error();body=parsed as Record<string,unknown>;}catch{return error('Choose a valid entry.');}
  if(typeof body.id!=='string'||typeof body.version!=='number'||!Number.isInteger(body.version)||body.version<1)return error('Choose a saved entry.');
  try{
    const links=recordLinks.map(field=>`json_extract(linked.data,'$.${field}') = ?`).join(' OR ');
    const result=await database().prepare(`DELETE FROM records WHERE id = ? AND owner = ? AND version = ? AND kind NOT IN ('profile','preferences') AND NOT EXISTS (SELECT 1 FROM records AS linked WHERE linked.owner = ? AND linked.id != ? AND (${links}))`).bind(body.id,user.userId,body.version,user.userId,body.id,...recordLinks.map(()=>body.id)).run();
    if(!result.meta.changes)return error('This entry has linked records, changed in another window, or is no longer available. Unlink related records or reload before trying again.',409);
    return Response.json({deleted:true},{headers:{'Cache-Control':'no-store'}});
  }catch{return error('Your entry was not deleted. Try again.',503);}
}
