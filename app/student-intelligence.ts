import {getProgramAlignment} from './program-alignment';
import type {Entry} from './model';
import {readProfile} from './personalization';
import {getStudentStage} from './student-context';
import {getNextBestActions} from './dashboard-state';
import {goalProgress,upcoming} from './journey';
import {hasRequirementSource} from './school-evidence';
import {taskComplete,letterStatus,recordDestination} from './record-links';
import type {Destination} from './journey';

export type PlanningMemory={id:string;text:string;updated:string};
export type EvidenceType='documented'|'student_preference'|'pathly_recommendation'|'inference'|'unknown';
export type PlanningFact={id:string;type:EvidenceType;text:string;entityId?:string};
export type PlanningEntity={id:string;kind:string;title:string;category:string;related:string[];updated:string;facts:PlanningFact[];excerpt?:string;destination:Destination};
const clean=(s:string|undefined,max=240)=>(s||'').replace(/[\u0000-\u001f]/g,' ').slice(0,max);
const amount=(s?:string)=>Number.isFinite(Number(s))?Math.max(0,Number(s)):0;
export function buildStudentIntelligence(records:Entry[],memories:PlanningMemory[]=[],now=new Date()){
 const profile=readProfile(records.find(r=>r.kind==='profile'));
 const experiences=records.filter(r=>r.kind==='experience');
 const totals=Object.fromEntries([...new Set(experiences.map(e=>e.data.category||'Other'))].sort().map(category=>{const rows=experiences.filter(e=>(e.data.category||'Other')===category);return [category,{count:rows.length,hours:rows.reduce((n,e)=>n+amount(e.data.hours),0)}]}));
 const entities:PlanningEntity[]=records.filter(r=>r.kind!=='profile').map(r=>{
  const d=r.data, facts:PlanningFact[]=[];
  const add=(key:string,text:string,type:EvidenceType='documented')=>facts.push({id:r.id+':'+key,type,text,entityId:r.id});
  add('record',`${r.kind==='letter'?'Saved recommender':clean(d.title)} · ${r.kind} · updated ${r.updated.slice(0,10)}`);
  if(r.kind==='experience'){
   const reflections=records.filter(x=>x.kind==='reflection'&&x.data.experience===r.id&&x.data.status!=='Draft'&&x.data.content?.trim());
   add('hours',`${clean(d.title)}: ${amount(d.hours)} recorded hours in ${clean(d.category)||'an unclassified category'}.`);
   add('context',`${d.ongoing==='true'?'Ongoing':'Ongoing status not marked'} · dates ${d.start||'unknown'} to ${d.end||'not set'} · ${reflections.length} completed reflections · ${records.filter(x=>x.kind==='story'&&x.data.experience===r.id).length} story moments · supervisor ${d.supervisor?'recorded':'not recorded'} · contact ${d.contact?'recorded':'not recorded'} · application choice ${clean(d.application)||'not set'}.`);
  }else if(r.kind==='goal'){
   const p=goalProgress(r,records);add('progress',`${clean(d.title)}: ${p.current} / ${p.total||'unspecified'} ${clean(d.unit)} · ${clean(d.status)||'status not set'} · priority ${clean(d.priority)||'not set'} · target ${d.target||'not set'}.`);
   const age=now.getTime()-Date.parse(r.updated);if(age>30*86400000&&!['Completed','Paused'].includes(d.status))add('stale','No update to this goal record in over 30 days. That does not prove progress has stalled.','unknown');
  }else if(r.kind==='requirement')add('requirement',`${clean(d.title)} · ${clean(d.type)||'classification unknown'} · ${clean(d.category)||'area unknown'} · ${clean(d.status)||'not reviewed'} · ${hasRequirementSource(r)?'source and review date entered; not independently verified':'source evidence incomplete'} · review date ${d.verified||'unknown'}.`);
  else if(r.kind==='school'){const alignment=getProgramAlignment(r,records,now);for(const [i,row] of alignment.rows.entries())add('alignment-'+i,row.label+': '+row.student+'. Saved program information: '+row.program+'. '+row.interpretation);add('provenance',alignment.source.label);add('school',`${clean(d.title)} · status ${clean(d.status)||'not set'} · deadline ${d.deadline||'unknown'} · program ${clean(d.program)||'not set'}.`);}
  else if(r.kind==='task')add('task',`${clean(d.title)}: ${taskComplete(r)?'completed':'open'} · target ${d.target||'not set'}.`);
  else if(r.kind==='letter')add('letter',`Recommendation planning: ${letterStatus(r)} · target ${d.target||'not set'}.`);
  else if(['reflection','story','essay'].includes(r.kind))add('writing',`${clean(d.title)}: ${clean(d.status)||'status not set'} · ${d.content?.trim()||d.happened?.trim()?'text saved':'no text saved'} · themes ${clean(d.themes)||'not recorded'}.`);
  return {id:r.id,kind:r.kind,title:r.kind==='letter'?'Saved recommender':clean(d.title),category:clean(d.category),related:['experience','school','goal','letter','essay','requirement','reflection'].map(k=>d[k]).filter(Boolean),updated:r.updated,facts,excerpt:['reflection','story','essay'].includes(r.kind)?clean(d.content||d.happened,600):undefined,destination:recordDestination(r,true)};
 });
 const profileFacts:PlanningFact[]=[
  {id:'profile:plan',type:'student_preference',text:`Pathway ${profile.profession||'not set'} · stage ${profile.academicStage||'not set'} · application year ${profile.year||'not set'} · weekly capacity ${profile.capacity||'not set'}.`},
  {id:'profile:priorities',type:'student_preference',text:`Selected priorities: ${profile.goals.join(', ')||'none'}. Desired progress: ${profile.success.join(', ')||'not set'}. Concern: ${profile.concern||'not set'}. Approach: ${profile.commitment||'not set'}.`},
  {id:'profile:stage',type:'inference',text:`Planning stage from profile and saved records: ${getStudentStage(records)}. This is not a readiness judgment.`},
  {id:'history:limits',type:'unknown',text:'Record timestamps show updates, not historical hour deltas, responsibility changes, or whether a recommendation was acted on. Missing documentation does not prove missing experience.'}
 ];
 return {profile,profileFacts,totals,entities,actions:getNextBestActions(records,now),deadlines:upcoming(records,now).slice(0,8).map(x=>({id:x.entry.id,date:x.date,label:x.label,days:x.days})),recent:entities.filter(e=>{const age=now.getTime()-Date.parse(e.updated);return age>=0&&age<=7*86400000}).map(e=>e.id),memories:memories.slice(0,8)};
}
export type StudentIntelligence=ReturnType<typeof buildStudentIntelligence>;
