import type {StudentIntelligence} from './student-intelligence';
import type {AssistantAnswer,AssistantMessage} from './assistant-types';
import type {RetrievedContext} from './assistant-retrieval';
import {goalLabel,categoryFor} from './personalization';

/** Transparent local planning interpretation; the recommendation engine stays unchanged. */
export function synthesizeLocalPlan(model:StudentIntelligence,context:RetrievedContext,question:string,history:AssistantMessage[]):AssistantAnswer|null{
 if(context.topic!=='planning'&&!/why.*(that|instead)|instead of/i.test(question))return null;
 const p=model.profile;
 const urgent=model.actions.find(a=>a.priority>=88);
 const unfinished=p.goals.find(key=>!model.totals[categoryFor(key)]&&['research','clinical','shadowing','service','leadership'].includes(key));
 const previous=history.filter(m=>m.role==='assistant').slice(-1)[0]?.planningFocus;
 const comparison=/instead|why that/i.test(question);
 const focus=comparison&&previous?previous:urgent?.title||(unfinished?goalLabel(unfinished,p):model.actions[0]?.title||'Document one experience');
 const facts=context.facts.filter(f=>['profile:plan','profile:priorities'].includes(f.id)||f.id.startsWith('total:')||f.id==='recommendation:'+urgent?.id).slice(0,7);
 const time=p.capacity==='Less than 2 hours'?'Keep this to one manageable step before adding another commitment.':p.capacity==='2–5 hours'?'Use your limited weekly time for one main priority and a short reflection.':'Choose a focused step, then review the plan as you record more information.';
 let rationale=urgent?`An existing Pathly recommendation needs review: ${urgent.evidence}.`:unfinished?`You selected ${unfinished} as a priority, but no matching experience is documented. That is a documentation signal, not proof you have not done it.`:'Your saved recommendations offer a concrete place to begin; they do not establish admissions readiness.';
 if(comparison)rationale=`The earlier suggestion was “${focus}”. ${rationale} ${model.totals.Volunteering||model.totals['Community Service']?'Your service experience is already represented in your records.':'Volunteering is not fully represented in the supplied records; that alone does not make it the better priority.'} If your interests or program requirements point elsewhere, change the plan.`;
 const actions=urgent?[{label:urgent.label,destination:urgent.destination}]:unfinished?[{label:'Review '+unfinished+' goal',destination:{page:'Goals',kind:'goal',data:{title:goalLabel(unfinished,p),category:categoryFor(unfinished),status:'Not Started',suggestionKey:unfinished}}}]:model.actions.slice(0,2).map(a=>({label:a.label,destination:a.destination}));
 if(!actions.length)actions.push({label:'Add an experience',destination:{page:'Experiences',kind:'experience'}});
 return {mode:'local-planning',planningFocus:focus,text:`${comparison?'WHY THIS PRIORITY':'A FOCUS THAT FITS YOUR PLAN'}\n\nOne reasonable next focus is: ${focus}.\n\n${rationale}\n\n${p.year?'Your target application year is '+p.year+'. ':''}${p.capacity?'You selected '+p.capacity+' per week. ':''}${time}${context.memories.length?'\n\nYour saved decision to keep in mind: '+context.memories[0].text:''}\n\nThis is a planning interpretation, not an admissions requirement.`,actions:actions.slice(0,3),evidence:[...facts,{type:'inference',text:'The proposed focus weighs your selected priorities, documented preparation, time and current Pathly recommendations.'}]};
}
