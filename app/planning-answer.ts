import type {Entry} from './model';
import type {AssistantAnswer} from './assistant-types';
import {getSchoolEvidence} from './school-evidence';
import {recordDestination} from './record-links';
import {upcoming} from './journey';
import {readProfile} from './personalization';

/** Topic-specific questions examine all relevant records, independent of Home's action limit. */
export function planningAnswer(question:string,records:Entry[]):AssistantAnswer|null{
 const q=question.toLowerCase();
 if(/prerequisite|requirement|school.*(gap|compare)|compare.*school/.test(q)){
  const schools=records.filter(r=>r.kind==='school');
  const named=schools.filter(s=>q.includes(s.data.title.toLowerCase()));
  const relevant=named.length?named:schools;
  const evidence=relevant.map(s=>({school:s,facts:getSchoolEvidence(s,records)}));
  const actions=evidence.flatMap(({school,facts})=>facts.next.length?facts.next.map(r=>({label:`Review ${r.data.title}`,destination:recordDestination(r,true)})):[{label:`Review ${school.data.title}`,destination:recordDestination(school)}]).slice(0,3);
  return {mode:'local-planning',text:`SCHOOL REQUIREMENTS\n\n${schools.length} saved school${schools.length===1?'':'s'}.\n\n`+(evidence.length?evidence.map(({school,facts})=>`${school.data.title}\n${facts.summary}\n${facts.context}\n${facts.next.slice(0,4).map(r=>`${r.data.title}: ${r.data.status||'Not reviewed'} (${r.data.type||'Type not recorded'})`).join('\n')}`).join('\n\n'):'Save a program and its official requirements to start comparing your preparation.')+'\n\nMissing documentation does not establish a missing prerequisite. Statuses are entered by you; Pathly does not independently verify eligibility. Confirm requirements with the program.',actions:actions.length?actions:[{label:'Add a school',destination:{page:'Schools',kind:'school'}}]};
 }
 if(/(which|missing|stronger|need).*reflection/.test(q)){
  const experiences=records.filter(r=>r.kind==='experience');
  const rows=experiences.filter(e=>!records.some(r=>r.kind==='reflection'&&r.data.experience===e.id&&r.data.content?.trim()&&r.data.status!=='Draft'));
  return {mode:'local-planning',text:rows.length?`REFLECTIONS TO RETURN TO\n\n${rows.length} experiences do not have a completed reflection. This does not judge the quality of your experience.\n\n${rows.slice(0,5).map(e=>`${e.data.title}: ${e.data.hours||'0'} recorded hours`).join('\n')}\n\nStart with a specific moment: what happened, what did you do, and what did you learn? Avoid patient names or identifying details.`:experiences.length?'Each recorded experience has a completed reflection. I cannot judge its strength from completion alone. Revisit a moment that changed your perspective.':'Add an experience first, then preserve a short reflection alongside it.',actions:rows.slice(0,3).map(e=>{const draft=records.find(r=>r.kind==='reflection'&&r.data.experience===e.id&&r.data.status==='Draft');return {label: draft?'Continue reflection':`Reflect on ${e.data.title}`,destination:draft?recordDestination(draft,true):{page:'Experiences',tab:'reflection',kind:'reflection',data:{experience:e.id,title:`Reflection on ${e.data.title}`}}};})};
 }
 if(/timeline|on track|behind schedule/.test(q)){
  const p=readProfile(records.find(r=>r.kind==='profile')),items=upcoming(records);
  return {mode:'local-planning',text:`YOUR RECORDED TIMELINE\n\n${p.year?'Your target application year is '+p.year+'.':'No application year is recorded.'} A year alone is not enough to say whether you are on track.\n\n${items.length?items.slice(0,5).map(i=>`${i.entry.data.title}: ${i.date} (${i.label}${i.days<0?', past recorded date':''})`).join('\n'):'No open deadlines or target dates are saved. Add one real deadline or goal to make your timeline actionable.'}\n\nConfirm official application dates and review the work behind each item.`,actions:items.slice(0,3).map(i=>({label:`Review ${i.entry.data.title}`,destination:recordDestination(i.entry,true)}))};
 }
 return null;
}
