import type {Entry} from './model';
import {recordLinks,taskComplete,letterStatus} from './record-links';
export type BrowserWorkspace={records:Entry[];hasCompletedOnboarding:boolean};
const kinds=new Set(['experience','reflection','story','school','requirement','goal','letter','essay','task','profile','capture','schoolNote']);
export function changeRecord(state:BrowserWorkspace,method:string,input:unknown):{record?:Entry;error?:string;status?:number}{
 if(!input||typeof input!=='object')return {error:'A valid entry is required.',status:400};
 const r=input as Entry;const previous=state.records.find(x=>x.id===r.id);
 if(typeof r.id!=='string'||!r.id||r.id.length>100||!Number.isInteger(r.version)||r.version<0)return {error:'A valid entry is required.',status:400};
 if((previous?.version||0)!==r.version)return {error:'This entry changed in another tab. Refresh before saving again.',status:409};
 if(method==='DELETE'){
  if(!previous)return {error:'This entry no longer exists.',status:404};
  if(previous.kind==='profile')return {error:'Edit your name in Profile & preferences.',status:400};
  if(state.records.some(x=>x.id!==r.id&&recordLinks.some(k=>x.data[k]===r.id)))return {error:'Remove or unlink connected entries before deleting this one.',status:409};
  state.records=state.records.filter(x=>x.id!==r.id);return {};
 }
 if(!kinds.has(r.kind)||previous&&previous.kind!==r.kind||!r.data||typeof r.data!=='object'||Array.isArray(r.data)||Object.values(r.data).some(x=>typeof x!=='string'))return {error:'Record fields must contain text values.',status:400};
 const data={...r.data};if(!data.title?.trim()||data.title.length>250)return {error:'Give this entry a name before saving.',status:400};
 if(JSON.stringify(data).length>150000)return {error:'This entry is too large.',status:413};
 if(r.kind==='profile'&&state.records.some(x=>x.kind==='profile'&&x.id!==r.id))return {error:'A profile already exists.',status:409};
 for(const key of ['hours','weekly','baseline','current','total','limit','characterLimit'])if(data[key]&&(Number(data[key])<0||!Number.isFinite(Number(data[key]))))return {error:'Amounts must be valid non-negative numbers.',status:400};
 for(const key of ['start','end','date','target','deadline','verified','interview','requestedDate','submittedDate'])if(data[key]&&(!/^\d{4}-\d{2}-\d{2}$/.test(data[key])||!Number.isFinite(Date.parse(data[key]))||new Date(data[key]).toISOString().slice(0,10)!==data[key]))return {error:'Choose a valid calendar date.',status:400};
 if(data.start&&data.end&&data.ongoing!=='true'&&data.end<data.start)return {error:'End date must be on or after start date.',status:400};
 if(r.kind==='reflection'&&!data.experience)return {error:'Choose the experience this reflection belongs to.',status:400};
 if(r.kind==='schoolNote'&&!data.school)return {error:'Choose a school for this note.',status:400};
 for(const key of recordLinks)if(data[key]&&!state.records.some(x=>x.id!==r.id&&x.id===data[key]&&x.kind===key))return {error:'A connected entry no longer exists. Choose another.',status:400};
 if(data.capture&&state.records.some(x=>x.id!==r.id&&x.data.capture===data.capture))return {error:'This thought has already been organized.',status:409};
 const now=new Date().toISOString();delete data.createdAt;delete data.completedAt;if(previous?.data.createdAt)data.createdAt=previous.data.createdAt;else if(!previous)data.createdAt=now;
 if(r.kind==='task'){if(data.status&&!['To do','In progress','Completed'].includes(data.status))return {error:'Choose a valid task status.',status:400};const complete=taskComplete({...r,data});data.complete=String(complete);data.status=complete?'Completed':data.status||'To do';if(complete)data.completedAt=previous?.data.completedAt||now;}
 if(r.kind==='letter'){const status=letterStatus({...r,data});data.status=status;data.requested=String(['Requested','Confirmed','Submitted'].includes(status));data.agreed=String(['Confirmed','Submitted'].includes(status));data.submitted=String(status==='Submitted');}
 if(r.kind==='reflection'&&data.content?.trim()&&data.status!=='Draft')data.hoursAtReflection=state.records.find(x=>x.id===data.experience)?.data.hours||'0';
 const record={...r,data,version:r.version+1,updated:now};state.records=[record,...state.records.filter(x=>x.id!==r.id)];return {record};
}
