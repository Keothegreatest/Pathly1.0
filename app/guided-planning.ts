import type {Entry} from './model';
import type {AssistantAnswer,AssistantMessage} from './assistant-types';
import {sendAskPathlyMessage} from './copilot-context';
import type {PlanningMemory} from './student-intelligence';
import {getProgramAlignment,alignmentDisclaimer,programPlanningSummary} from './program-alignment';
import {goalProgress} from './goal-progress';
import {recordDestination,taskComplete} from './record-links';
export const guidedIntents={focus:'What should I focus on next?',gaps:'Where is my preparation under-documented?',month:'What should I accomplish this month?',goals:'How am I progressing toward my goals?',reflections:'Which experiences need reflections?',story:'Which experiences support my application story?',alignment:'How well do I align with this program?',requirements:'What requirements still need attention?',compare:'Compare my preparation across saved programs.',improve:'What should I work on before applying here?',application:'What should I finish before applying?',why:'Why is this my priority?',plan:'Build my next-step plan',tradeoffs:'Help me weigh my planning priorities'} as const;
export type GuidedIntent=keyof typeof guidedIntents;
export function guidedQuestions(page:string,records:Entry[]):GuidedIntent[]{
 if(page==='Schools')return records.some(r=>r.kind==='school')?['alignment','requirements','compare','improve']:['requirements','focus','plan'];
 if(page==='Experiences'||page==='Journey')return ['reflections','gaps','story','focus'];
 if(page==='Application')return ['application','story','requirements','plan'];
 if(page==='Goals')return ['goals','month','focus','tradeoffs'];
 return ['focus','gaps','month','goals'];
}
export function guidedFollowups(intent:GuidedIntent):GuidedIntent[]{return ['alignment','requirements','improve','compare'].includes(intent)?(['requirements','improve','compare','plan'] as GuidedIntent[]).filter(x=>x!==intent):(['why','goals','plan','tradeoffs'] as GuidedIntent[]).filter(x=>x!==intent);}
export function guidedAnswer(intent:GuidedIntent,records:Entry[],page:string,history:AssistantMessage[],memories:PlanningMemory[],schoolId?:string):AssistantAnswer{
 if(intent==='why'){
  const previous=history.filter(m=>m.role==='assistant').slice(-1)[0];
  if(previous&&!previous.planningFocus)return {mode:'local-planning',text:'The previous answer summarized your saved preparation and the items available to review. It did not establish a new priority or an admissions requirement. Use its evidence and linked records to choose your next step.',actions:previous.actions||[],evidence:previous.evidence};
 }
 if(intent==='gaps'){
  const experiences=records.filter(r=>r.kind==='experience'),categories=[...new Set(experiences.map(r=>r.data.category||'Unclassified'))];
  return {mode:'local-planning',text:experiences.length?`Your records cover ${categories.join(', ')}.\n\n${experiences.filter(r=>!r.data.category||!r.data.description?.trim()).length} experiences have no category or description recorded. Review these details before deciding whether to add another commitment. Missing documentation does not prove missing experience; no universal category requirement is assumed.`:'No experiences are documented yet. Start with something you have already done. Missing documentation does not prove missing experience.',actions:[{label:'Review experiences',destination:{page:'Experiences'}},{label:'Review your priorities',destination:{page:'Goals'}}]};
 }
 if(['alignment','requirements','compare','improve'].includes(intent)){
  const schools=records.filter(r=>r.kind==='school'&&(intent==='compare'||!schoolId||r.id===schoolId));
  if(!schools.length)return {mode:'local-planning',text:'Save a program and its official requirements to begin comparing your documented preparation. Missing information is not a judgment of your experience.',actions:[{label:'Add a school',destination:{page:'Schools',kind:'school'}}]};
  const plans=schools.slice(0,3).map(s=>getProgramAlignment(s,records));
  return {mode:'local-planning',text:plans.map(p=>programPlanningSummary(p,intent==='requirements'||intent==='improve')).join('\n\n')+(schools.length>3?'\n\nShowing the first three saved programs. Open Schools → Compare programs for the full comparison.':'')+'\n\n'+alignmentDisclaimer,actions:plans.flatMap(p=>p.actions.length?p.actions:[{label:'Review '+p.school.data.title,destination:recordDestination(p.school,true)}]).slice(0,3),evidence:plans.map(p=>({type:'documented',text:`${p.school.data.title}: ${p.source.label}. Requirement statuses are entered by you; Pathly does not independently verify them.`}))};
 }
 if(intent==='goals'){
  const goals=records.filter(r=>r.kind==='goal');return {mode:'local-planning',text:goals.length?goals.map(g=>{const p=goalProgress(g,records);return `${g.data.title}: ${p.current} of ${p.total||'an unspecified target'} ${g.data.unit||''}. ${g.data.status||'Not started'}${g.data.target?' · Target '+g.data.target:''}.`}).join('\n\n'):'No goals are documented yet. Choose one manageable priority to connect your next step with your journey.',actions:goals.length?goals.slice(0,3).map(g=>({label:'Review '+g.data.title,destination:recordDestination(g,true)})):[{label:'Create a goal',destination:{page:'Goals',kind:'goal'}}]};
 }
 if(intent==='application'){
  const open=records.filter(r=>r.kind==='task'&&!taskComplete(r)||r.kind==='essay'&&!r.data.content?.trim());return {mode:'local-planning',text:open.length?`Your saved plan has ${open.length} open tasks or empty writing records.\n\n${open.slice(0,5).map(r=>r.data.title).join('\n')}\n\nThese are your recorded items, not a complete program requirements checklist.`:'No unfinished application tasks or empty writing records are saved. That does not establish that your application is complete. Review your program’s official checklist.',actions:open.length?open.slice(0,3).map(r=>({label:'Review '+r.data.title,destination:recordDestination(r,true)})):[{label:'Review application',destination:{page:'Application',tab:'tasks'}}]};
 }
 const question=intent==='why'?'Why that?':intent==='plan'||intent==='tradeoffs'?'What should I focus on this semester?':guidedIntents[intent];
 return sendAskPathlyMessage(question,records,page,history,memories);
}
