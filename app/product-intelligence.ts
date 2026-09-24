import type {Entry} from './model';
import {upcoming,schoolAlignment,type Destination} from './journey';
import {getStudentContext} from './student-context';
import {recordDestination,taskComplete,unorganizedCaptures} from './record-links';
export function formatCountLabel(count:number,label:string,plural=label+'s') {return `${count} ${count===1?label:plural}`;}
export function formatRelativeDate(value:string,now=new Date()) {
  const date=new Date(value.slice(0,10)+'T12:00:00');if(!Number.isFinite(date.getTime()))return 'Date not set';
  const today=new Date(now.getFullYear(),now.getMonth(),now.getDate(),12);
  const days=Math.round((date.getTime()-today.getTime())/86400000);
  return days===0?'Today':days===1?'Tomorrow':days===-1?'Yesterday':days>1&&days<=30?`${days} days away`:date.toLocaleDateString('en-US',{month:'short',day:'numeric'});
}
export function getExperienceSummary(records:Entry[]) {
  const experiences=records.filter(r=>r.kind==='experience');if(!experiences.length)return '';
  const parts=[formatCountLabel(experiences.length,'experience')];
  const hours=experiences.reduce((sum,r)=>sum+(Number(r.data.hours)||0),0);if(hours)parts.push(`${hours.toLocaleString()} hours documented`);
  for(const [kind,label] of [['reflection','reflection'],['story','Story Moment']]){const count=records.filter(r=>r.kind===kind).length;if(count)parts.push(formatCountLabel(count,label));}
  return parts.join(' · ');
}
export function getRecentActivity(records:Entry[],now=new Date()) {
  return records.filter(r=>r.kind!=='profile'&&Date.parse(r.updated)<=now.getTime()).sort((a,b)=>b.updated.localeCompare(a.updated)).slice(0,3).map(entry=>({entry,label:entry.data.createdAt===entry.updated?'Added':'Updated',date:formatRelativeDate(entry.updated,now)}));
}
export function getContinueItem(records:Entry[]) {
  const unfinished=records.filter(r=>(['reflection','essay','story'].includes(r.kind)&&(r.data.status==='Draft'||! (r.data.content||r.data.happened)?.trim()))||(r.kind==='task'&&r.data.status==='In progress'));
  unfinished.sort((a,b)=>b.updated.localeCompare(a.updated));
  if(unfinished[0])return {entry:unfinished[0],context:unfinished[0].kind==='task'?'Task in progress':'Unfinished '+(unfinished[0].kind==='essay'?'writing':unfinished[0].kind),destination:recordDestination(unfinished[0],true)};
  const school=records.filter(r=>r.kind==='school').sort((a,b)=>b.updated.localeCompare(a.updated)).find(r=>schoolAlignment(r,records).missing.length);
  if(school)return {entry:school,context:formatCountLabel(schoolAlignment(school,records).missing.length,'requirement')+(schoolAlignment(school,records).missing.length===1?' still needs review':' still need review'),destination:recordDestination(school)};
  const capture=unorganizedCaptures(records)[0];
  return capture?{entry:capture,context:'A saved thought to organize',destination:{page:'Experiences',tab:'capture'} satisfies Destination}:null;
}
export function getGreetingContext(records:Entry[],authName='',now=new Date()) {
  const context=getStudentContext(records,authName),dates=upcoming(records,now).filter(x=>x.days>=0&&x.days<=30);
  if(dates.length)return `${formatCountLabel(dates.length,'important date')} coming up in the next 30 days.`;
  const experiences=records.filter(r=>r.kind==='experience');
  const waiting=experiences.filter(e=>!records.some(r=>r.kind==='reflection'&&r.data.experience===e.id&&r.data.content?.trim())).length;
  if(waiting)return `You’ve documented ${formatCountLabel(experiences.length,'experience')} and have ${formatCountLabel(waiting,'reflection')} waiting.`;
  if(context.stage==='Applying now')return 'Keep your deadlines, letters, and writing close as you apply.';
  if(context.cycle)return `You’re preparing for the ${[context.path,context.cycle].filter(Boolean).join(' · ')}.`;
  const schools=records.filter(r=>r.kind==='school').length;if(schools)return `You’re considering ${formatCountLabel(schools,'program')}.`;
  return experiences.length?'Your experiences are documented. Keep the useful details close.':'Start by giving Pathly one thing you’ve already done.';
}
export function getSidebarContext(records:Entry[],now=new Date()) {
  if(upcoming(records,now).some(x=>x.days>=0&&x.days<=30))return 'Something important is coming up.';
  if(records.some(r=>r.kind==='story'))return 'You’ve saved moments worth remembering.';
  if(records.some(r=>r.kind==='experience'))return 'Your experiences are worth returning to.';
  return 'Start with what you’ve already done.';
}
export function getWeeklySummary(records:Entry[],now=new Date()) {
  const isRecent=(date?:string)=>!!date&&now.getTime()-Date.parse(date)>=0&&now.getTime()-Date.parse(date)<7*86400000;
  return {added:records.filter(r=>r.kind!=='profile'&&isRecent(r.data.createdAt)),updated:records.filter(r=>r.kind!=='profile'&&isRecent(r.updated)&&!isRecent(r.data.createdAt)),completed:records.filter(r=>r.kind==='task'&&taskComplete(r)&&isRecent(r.data.completedAt))};
}
