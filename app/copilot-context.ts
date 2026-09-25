import type {Entry} from './model';
import type {NextAction,Destination} from './journey';
import type {AssistantAnswer} from './assistant-types';
import {answerFromRecords} from './assistant-service';
import {buildPathlyContext} from './assistant-context';
export const copilotContexts:Record<string,{label:string;prompts:string[]}>= {
 Home:{label:'Home',prompts:['What should I focus on next?','Where are my biggest gaps?','Build me a plan for this semester']},
 Experiences:{label:'Experiences',prompts:['Which experiences need stronger reflections?','What areas of my experience are missing?','Help me reflect on this experience']},
 Schools:{label:'School planning',prompts:['Where am I missing prerequisites?','Help me compare my school list','What should I consider when building my school list?']},
 Application:{label:'Application',prompts:['What part of my application needs attention?','Which experiences support my story?','Help me prepare for my application']},
 Goals:{label:'Goals',prompts:['Turn my biggest gaps into goals','What should I accomplish this month?','Help me prioritize my goals']},
 Journey:{label:'Journey',prompts:['What progress have I documented?','Which experiences support my story?','What should I focus on next?']},
 Profile:{label:'Your plan',prompts:['Help me prioritize my goals','What should I focus on next?','Build me a plan for this semester']},
};
export function getCopilotContext(page:string){return copilotContexts[page]||copilotContexts.Home}
export function resolveCopilotAction(destination:Destination,records:Entry[]):Destination|null{
 if(destination.record){const current=records.find(r=>r.id===destination.record!.id);return current?{...destination,record:current}:null}
 for(const key of ['experience','school'])if(destination.data?.[key]&&!records.some(r=>r.id===destination.data![key]))return null;
 return destination;
}
export function explainRecommendation(action:NextAction):AssistantAnswer{return {mode:'local-planning',text:`WHY THIS DESERVES ATTENTION\n\n${action.title}\n\n${action.reason}\n\nWhat Pathly knows: ${action.evidence}\n\nThis is based on your saved information. Review the details before making changes.`,actions:[{label:action.label,destination:action.destination}]}}
export function sendAskPathlyMessage(question:string,records:Entry[],page:string):AssistantAnswer{
 const q=question.toLowerCase(),context=buildPathlyContext(records);
 if(/gap|missing|prerequisite|compare|stronger reflections/.test(q)){
  const relevant=context.actions.filter(a=>page==='Home'||a.destination.page===page);
  if(relevant.length)return {mode:'local-planning',text:'WHAT YOUR RECORDS SHOW\n\n'+relevant.map((a,i)=>`${i+1}. ${a.title}\n${a.evidence}\n${a.reason}`).join('\n\n'),actions:relevant.map(a=>({label:a.label,destination:a.destination}))};
  if(page==='Schools')return answerFromRecords('Review school requirements',context);
  return {mode:'local-planning',text:'There isn’t enough recorded evidence to identify a specific gap here. Missing documentation does not necessarily mean missing experience. Start by reviewing the details you have saved, then add anything that is absent.',actions:[{label:'Review experiences',destination:{page:'Experiences'}},{label:'Review application',destination:{page:'Application',tab:'readiness'}}]};
 }
 return answerFromRecords(question,context);
}
