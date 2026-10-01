import type {Entry} from './model';

const addressed=(r:Entry)=>['Complete','Not applicable'].includes(r.data.status);
/** An entered source is traceability, not independent verification by Pathly. */
export function hasRequirementSource(entry:Entry){
 try {const url=new URL(entry.data.source||'');const date=entry.data.verified||'';return ['https:','http:'].includes(url.protocol)&&/^\d{4}-\d{2}-\d{2}$/.test(date)&&new Date(date).toISOString().slice(0,10)===date;}catch{return false;}
}
export function sourceQuality(entry:Entry,now=new Date()){
 const valid=hasRequirementSource(entry),age=now.getTime()-Date.parse(entry.data.verified||'');
 const current=valid&&age>=0&&age<=365*86400000;
 return {current,url:valid?entry.data.source:null,label:current?'Source and review date recorded':valid?'Needs verification · review date older than one year or in the future':'Needs verification · source or valid review date missing'};
}
export function getSchoolEvidence(school:Entry,records:Entry[],now=new Date()){
 const requirements=records.filter(r=>r.kind==='requirement'&&r.data.school===school.id);
 const required=requirements.filter(r=>r.data.type==='Hard requirement');
 const missing=required.filter(r=>r.data.status==='Missing');
 const inProgress=required.filter(r=>r.data.status==='In progress');
 const unknown=required.filter(r=>!addressed(r)&&!['Missing','In progress'].includes(r.data.status));
 const recommendations=requirements.filter(r=>r.data.type==='Recommendation'&&!addressed(r));
 const unclassified=requirements.filter(r=>!['Hard requirement','Recommendation'].includes(r.data.type));
 const unverified=requirements.filter(r=>!sourceQuality(r,now).current);
 return {requirements,required,missing,inProgress,unknown,recommendations,unclassified,unverified,
  summary:!requirements.length?'No requirements documented yet.':`${missing.length} marked missing · ${inProgress.length} in progress · ${unknown.length} required items not reviewed`,
  context:`${recommendations.length} open recommendations · ${unclassified.length} unclassified · ${unverified.length} needing source verification`,
  next:[...missing,...unknown,...inProgress,...unclassified,...unverified,...recommendations].filter((r,i,all)=>all.findIndex(x=>x.id===r.id)===i)
 };
}
