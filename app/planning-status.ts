import type {Entry} from './model';
import {readProfile} from './personalization';
import {upcoming} from './journey';
import {getSchoolEvidence} from './school-evidence';

export function getPlanningStatus(records:Entry[],now=new Date()){
 const profile=readProfile(records.find(r=>r.kind==='profile'));
 const experiences=records.filter(r=>r.kind==='experience');
 const schools=records.filter(r=>r.kind==='school');
 const missing=schools.flatMap(s=>getSchoolEvidence(s,records).missing).length;
 const urgent=upcoming(records,now).filter(item=>item.days<=14);
 const title=urgent.length?`${urgent.length} saved ${urgent.length===1?'date needs':'dates need'} a look.`:missing?`${missing} required ${missing===1?'item is':'items are'} marked missing.`:experiences.length?'Your journey is taking shape.':'Your starting point is what you already know.';
 const evidence=experiences.length?`${experiences.length} ${experiences.length===1?'experience':'experiences'} recorded · ${schools.length} ${schools.length===1?'school':'schools'} saved.`:'Add one experience to connect your work, reflections, and next steps.';
 const timeline=profile.year?`Target application year: ${profile.year}. A target year alone cannot establish readiness.`:'Your application timeline is open. You can decide as your plans develop.';
 return {title,evidence,timeline,profile};
}

/** Current record timestamps support update counts, not a historical hours delta. */
export function changesSince(records:Entry[],since:string,now=new Date()){
 const start=Date.parse(since);if(!Number.isFinite(start)||start>now.getTime())return [];
 return records.filter(r=>r.kind!=='profile'&&Date.parse(r.updated)>start&&Date.parse(r.updated)<=now.getTime());
}
