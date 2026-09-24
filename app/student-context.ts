import type {Entry} from './model';

export type StudentStage = 'Exploring' | 'Building experience' | 'Preparing to apply' | 'Applying now';
const clean = (value?:string) => value && !['undefined','null'].includes(value.trim().toLowerCase()) ? value.trim() : '';
export function getStudentFirstName(profile?:Entry, authName='') {
  return clean(profile?.data.title) || clean(authName).split(/\s+/)[0] || '';
}
export function getStudentDisplayName(profile?:Entry, authName='') {
  return clean(profile?.data.fullName) || clean(authName) || clean(profile?.data.title);
}
export function getStudentPath(profile?:Entry) {return clean(profile?.data.pathway);}
export function getApplicationCycle(profile?:Entry) {
  const year=clean(profile?.data.applicationYear);
  return /^\d{4}$/.test(year)?`${year} cycle`:'';
}
export function getStudentStage(records:Entry[]):StudentStage {
  const value=records.find(r=>r.kind==='profile')?.data.stage;
  if(['Apply','Applying now'].includes(value||'')) return 'Applying now';
  if(['Plan','Prepare','Preparing to apply'].includes(value||'')) return 'Preparing to apply';
  if(['Explore','Exploring'].includes(value||'')) return 'Exploring';
  if(value) return 'Building experience';
  if(records.some(r=>r.kind==='school'&&['Applying','Interview'].includes(r.data.status)))return 'Applying now';
  if(records.some(r=>['essay','letter','task'].includes(r.kind)))return 'Preparing to apply';
  return records.some(r=>r.kind==='experience')?'Building experience':'Exploring';
}
export function getStudentContext(records:Entry[], authName='') {
  const profile=records.find(r=>r.kind==='profile');
  const firstName=getStudentFirstName(profile,authName),displayName=getStudentDisplayName(profile,authName);
  const path=getStudentPath(profile),cycle=getApplicationCycle(profile);
  return {firstName,displayName,path,cycle,stage:getStudentStage(records),metadata:[path,cycle].filter(Boolean).join(' · '),initials:displayName.split(/\s+/).filter(Boolean).slice(0,2).map(p=>Array.from(p)[0]).join('').toUpperCase()};
}
export function timeGreeting(hour:number) {return hour>=5&&hour<12?'Good morning':hour>=12&&hour<17?'Good afternoon':'Good evening';}
export function studentGreeting(firstName:string, hour:number) {return `${timeGreeting(hour)}${firstName?`, ${firstName}`:''}.`;}

export function getStagePriority(kind:string,stage:StudentStage) {
  const relevant:Record<StudentStage,string[]>={'Exploring':['reflection','story'],'Building experience':['goal','reflection'],'Preparing to apply':['requirement','essay','letter'],'Applying now':['task','essay','letter','school']};
  return relevant[stage].includes(kind)?4:0;
}
