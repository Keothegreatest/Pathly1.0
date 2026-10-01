import type {AssistantMessage} from './assistant-types';
import type {StudentIntelligence,PlanningFact} from './student-intelligence';
import type {Destination} from './journey';
export type PlanningTopic='planning'|'schools'|'experiences'|'writing'|'goals'|'unrelated';
export type RetrievedContext={version:1;topic:PlanningTopic;facts:PlanningFact[];actions:{id:string;label:string;destination:Destination}[];continuity:{role:'user'|'assistant';text:string}[];memories:{id:string;text:string}[];selection:{matchedEntities:string[];omittedEntities:number};};
const tokenize=(s:string)=>s.toLowerCase().normalize('NFKC').split(/[^\p{L}\p{N}]+/u).filter(w=>w.length>2);
const vocabulary:Record<Exclude<PlanningTopic,'unrelated'>,string[]>={planning:['focus','semester','next','priority','priorities','plan','timeline','track','week','month','instead'],schools:['school','schools','program','programs','prerequisite','prerequisites','requirements','requirement','biology','chemistry'],experiences:['experience','experiences','clinical','patient','hours','research','volunteering','shadowing'],writing:['reflect','reflection','reflections','story','stories','essay','writing','interview','learned'],goals:['goal','goals','target','progress']};
export function retrievePlanningContext(model:StudentIntelligence,question:string,history:AssistantMessage[]=[]):RetrievedContext{
 const tokens=new Set(tokenize(question));
 const followup=tokens.has('that')||tokens.has('instead')||tokens.has('why')||tokens.has('more');
 const previous=history.filter(m=>m.role==='user').slice(-1)[0]?.text||'';
 const effective=new Set([...tokens,...(followup?tokenize(previous):[])]);
 const scores=Object.entries(vocabulary).map(([topic,words])=>({topic:topic as PlanningTopic,score:words.filter(w=>effective.has(w)).length})).sort((a,b)=>b.score-a.score);
 const named=model.entities.filter(e=>e.title.length>3&&question.toLowerCase().includes(e.title.toLowerCase()));
 const topic:PlanningTopic=named[0]?.kind==='school'?'schools':scores[0].score?scores[0].topic:named.length?'experiences':'unrelated';
 const kinds:Record<PlanningTopic,string[]>={planning:['goal','requirement','school','experience','task','letter'],schools:['school','requirement','goal'],experiences:['experience','reflection','story','goal'],writing:['reflection','story','essay','experience','letter'],goals:['goal','experience','task'],unrelated:[]};
 const matched=new Set(named.map(e=>e.id));
 const ranked=model.entities.map(e=>({e,score:(matched.has(e.id)?100:0)+(e.related.some(id=>matched.has(id))?70:0)+(kinds[topic].includes(e.kind)?10:0)+tokenize(e.title+' '+e.category).filter(w=>effective.has(w)).length*3+(model.recent.includes(e.id)?1:0)})).filter(x=>x.score>=10).sort((a,b)=>b.score-a.score||a.e.id.localeCompare(b.e.id));
 const selected=ranked.slice(0,topic==='planning'?12:8).map(x=>x.e);
 const ids=new Set(selected.map(e=>e.id));
 const facts:PlanningFact[]=topic==='unrelated'?[]:[...model.profileFacts];
 if(['planning','experiences','goals'].includes(topic))for(const [category,total] of Object.entries(model.totals))facts.push({id:'total:'+category,type:'documented',text:`${category}: ${total.hours} hours across ${total.count} documented experiences.`});
 for(const e of selected){facts.push(...e.facts);if(e.excerpt&&['writing','experiences'].includes(topic))facts.push({id:e.id+':excerpt',entityId:e.id,type:'documented',text:`Student-authored excerpt from ${e.title}: ${e.excerpt}`});}
 const recommendations=model.actions.filter(a=>topic==='planning'||ids.has(a.destination.record?.id||a.destination.data?.experience||a.destination.data?.school||'')||(topic==='schools'&&a.destination.page==='Schools'));
 for(const a of recommendations)facts.push({id:'recommendation:'+a.id,type:'pathly_recommendation',text:`${a.title}. Evidence: ${a.evidence}. Why: ${a.reason}. Priority: ${a.priority}.`});
 const actions=[...recommendations.map(a=>({id:'recommendation:'+a.id,label:a.label,destination:a.destination})),...selected.map(e=>({id:'record:'+e.id,label:'Review '+e.title,destination:e.destination}))].slice(0,12);
 return {version:1,topic,facts:facts.slice(0,55),actions,continuity:history.slice(-4).map(m=>({role:m.role,text:m.text.slice(0,1200)})),memories:topic==='unrelated'?[]:model.memories.filter(m=>topic==='planning'||tokenize(m.text).some(w=>effective.has(w))).map(m=>({id:m.id,text:m.text})),selection:{matchedEntities:named.map(e=>e.id),omittedEntities:Math.max(0,model.entities.length-selected.length)}};
}
/** Destinations may contain full local records; never transmit them to a provider. */
export function externalPlanningContext(context:RetrievedContext){return {...context,actions:context.actions.map(a=>({id:a.id,label:a.label})),facts:context.facts.map(f=>({...f,text:redact(f.text)})),continuity:context.continuity.map(m=>({...m,text:redact(m.text)})),memories:context.memories.map(m=>({...m,text:redact(m.text)}))};}
export function redact(text:string){return text.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi,'[email omitted]').replace(/(?:\+?\d[\d ()-]{7,}\d)/g,match=>/^\d{4}-\d{2}-\d{2}$/.test(match)?match:'[number omitted]');}
