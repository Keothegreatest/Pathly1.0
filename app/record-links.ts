import type {Entry} from './model';
export const recordLinks = ['experience','school','essay','goal','letter','reflection','capture','requirement'] as const;
export function linkedRecords(entry:Entry, records:Entry[]) {return records.filter(r=>r.id!==entry.id&&recordLinks.some(key=>r.data[key]===entry.id));}
export function taskStatus(entry:Entry) {return entry.data.status|| (entry.data.complete==='true'?'Completed':'To do');}
export function taskComplete(entry:Entry) {return taskStatus(entry)==='Completed';}
export function letterStatus(entry:Entry) {return entry.data.status||(entry.data.submitted==='true'?'Submitted':entry.data.agreed==='true'?'Confirmed':entry.data.requested==='true'?'Requested':'Considering');}
export function recordPage(kind:string) {return ['experience','reflection','story','capture'].includes(kind)?'Experiences':['school','requirement','schoolNote'].includes(kind)?'Schools':kind==='goal'?'Goals':'Application';}
export function recordTab(kind:string) {return kind==='essay'?'writing':kind==='task'?'tasks':kind==='schoolNote'?'school':kind;}
export function recordDestination(entry:Entry,edit=false) {return {page:recordPage(entry.kind),tab:recordTab(entry.kind),record:entry,edit};}
export function unorganizedCaptures(records:Entry[]) {const organized=new Set(records.map(r=>r.data.capture).filter(Boolean));return records.filter(r=>r.kind==='capture'&&!organized.has(r.id));}
