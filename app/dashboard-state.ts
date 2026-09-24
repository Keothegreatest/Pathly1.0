import {readProfile,profileActions} from './personalization';
import type {Entry} from './model';
import {readiness, upcoming, type Destination} from './journey';
import {recommendActions} from './recommendations';
import {getGreetingContext,getContinueItem,getRecentActivity,getWeeklySummary} from './product-intelligence';

export type StudentStage = 'BRAND_NEW' | 'EARLY_BUILDING' | 'ACTIVE_BUILDING' | 'APPLICATION_PREP';
export type QuickAction = {label:string; destination:Destination};
const of = (records:Entry[], kind:string) => records.filter(r=>r.kind===kind);
export function getDashboardGreeting(stage:StudentStage) {
  return {BRAND_NEW:'Start with one experience. Build a clearer picture from there.',EARLY_BUILDING:'Keep the details today. See how your next chapter takes shape.',ACTIVE_BUILDING:'Connect what you’re doing with what comes next.',APPLICATION_PREP:'Bring your experiences, requirements, and application plans together.'}[stage];
}
export function getNextBestActions(records:Entry[], now=new Date()) { const p=readProfile(records.find(r=>r.kind==='profile'));return [...recommendActions(records,now),...profileActions(records,now)].sort((a,b)=>b.priority-a.priority||a.id.localeCompare(b.id)).slice(0,p.capacity==='Less than 2 hours'?1:p.capacity==='2–5 hours'?2:3); }
export function getQuickActions(records:Entry[]):QuickAction[] {
  const experiences=of(records,'experience'), schools=of(records,'school'), goals=of(records,'goal');
  const actions:QuickAction[]=[];
  if(!experiences.length) actions.push({label:'Add first experience',destination:{page:'Experiences',kind:'experience'}});
  else {
    const recent=experiences.find(e=>!of(records,'reflection').some(r=>r.data.experience===e.id&&r.data.content?.trim()&&r.data.status!=='Draft'));
    actions.push(recent?{label:'Add reflection',destination:{page:'Experiences',tab:'reflection',kind:'reflection',data:{experience:recent.id}}}:{label:'Capture story moment',destination:{page:'Experiences',tab:'story',kind:'story',data:{experience:experiences[0].id}}});
  }
  actions.push(schools.length?{label:'Review school',destination:{page:'Schools',record:schools[0]}}:{label:'Add school',destination:{page:'Schools',kind:'school'}});
  const active=goals.find(g=>!['Completed','Paused'].includes(g.data.status));
  actions.push(active?{label:'Update goal',destination:{page:'Goals',record:active,edit:true}}:goals.length?{label:'Continue application prep',destination:{page:'Application',tab:'readiness'}}:{label:'Create goal',destination:{page:'Goals',kind:'goal'}});
  return actions;
}
export function getReadinessStatus(records:Entry[]) {
  return readiness(records).map(area=>({...area,status:area.state==='empty'?'No information yet':area.state==='attention'?(['School planning','Academic preparation'].includes(area.name)?'Needs attention':'Started'):'Some evidence documented'}));
}
export function getUpcomingItems(records:Entry[],now=new Date()) {return upcoming(records,now);}
export function getWeeklyActivity(records:Entry[],now=new Date()) {
  const recent=records.filter(r=>{const age=now.getTime()-Date.parse(r.updated);return age>=0&&age<7*86400000;});
  return [['experience','Experiences'],['reflection','Reflections'],['story','Moments'],['goal','Goals'],['task','Tasks']].map(([kind,label])=>({kind,label,count:of(recent,kind).length}));
}
export function getDashboardState(records:Entry[],now=new Date(),authName='') {
  const experiences=of(records,'experience'),stories=of(records,'story');
  const stage:StudentStage=records.some(r=>['essay','task','letter'].includes(r.kind))?'APPLICATION_PREP':experiences.length>=3||of(records,'reflection').length>=2?'ACTIVE_BUILDING':records.some(r=>r.kind!=='profile')?'EARLY_BUILDING':'BRAND_NEW';
  return {stage,subtitle:getGreetingContext(records,authName,now),continueItem:getContinueItem(records),recent:getRecentActivity(records,now),weekSummary:getWeeklySummary(records,now),quickActions:getQuickActions(records),actions:getNextBestActions(records,now),readiness:getReadinessStatus(records),upcoming:getUpcomingItems(records,now),weekly:getWeeklyActivity(records,now),experiences:experiences.length,hours:experiences.reduce((sum,e)=>sum+(Number.isFinite(Number(e.data.hours))?Math.max(0,Number(e.data.hours)):0),0),stories:stories.length,storyDestination:{page:'Experiences',tab:'story',kind:'story',data:experiences[0]?{experience:experiences[0].id}:undefined} satisfies Destination};
}
