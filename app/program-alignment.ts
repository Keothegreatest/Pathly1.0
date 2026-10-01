import type {Entry} from './model';
import {getSchoolEvidence,sourceQuality} from './school-evidence';
import {letterStatus,recordDestination,taskComplete} from './record-links';
export const alignmentDisclaimer='This compares your saved information with the program information currently documented in Pathly. It does not predict an admissions decision.';
export function programPlanningSummary(plan:ReturnType<typeof getProgramAlignment>,requirementsOnly=false){
 const items=plan.next.slice(0,3).map(r=>`${r.data.title}: ${r.data.status||'status not documented'}${r.kind==='requirement'?' · '+sourceQuality(r).label:''}`);
 const rows=plan.rows.filter(r=>['Prerequisites','Clinical experience','Letters'].includes(r.label));
 return `${plan.school.data.title}\n${plan.evidence.summary}\n${plan.evidence.context}\n\n${requirementsOnly?'':rows.map(r=>`${r.label}: ${r.student}. Program: ${r.program}.`).join('\n')+'\n\n'}Next areas to address:\n${items.length?items.join('\n'):'Review official information and document any remaining requirements.'}\n\nSource status: ${plan.source.label}. Missing records do not establish missing experience; recorded hours do not certify eligibility.`;
}
export function getProgramAlignment(school:Entry,records:Entry[],now=new Date()){
 const evidence=getSchoolEvidence(school,records,now),profile=records.find(r=>r.kind==='profile');
 const linked=records.filter(r=>r.data.school===school.id),requirements=evidence.requirements;
 const source=sourceQuality({...school,data:{...school.data,source:school.data.website}},now);
 const programInfo=(field:string,category:string)=>[school.data[field],...requirements.filter(r=>r.data.category===category).map(r=>`${r.data.title} (${r.data.type||'classification unknown'})`)].filter(Boolean).join('; ')||'No program-specific requirement recorded';
 const prerequisites=requirements.filter(r=>r.data.category==='Prerequisite'&&r.data.type==='Hard requirement');
 const completed=prerequisites.filter(r=>r.data.status==='Complete').length;
 const waived=prerequisites.filter(r=>r.data.status==='Not applicable').length;
 const numeric=(s?:string)=>s?.trim()&&Number.isFinite(Number(s))&&Number(s)>=0?Number(s):null;
 const hours=(category:string)=>records.filter(r=>r.kind==='experience'&&r.data.category===category).reduce((n,r)=>n+(numeric(r.data.hours)||0),0);
 const rows:{label:string;student:string;program:string;interpretation:string}[]=[];
 rows.push({label:'Prerequisites',student:prerequisites.length?`${completed} of ${prerequisites.length} marked complete${waived?` · ${waived} marked not applicable`:''}`:'No prerequisite checklist documented',program:prerequisites.length?`${prerequisites.length} entered hard requirements`:'No program-specific requirement recorded',interpretation:prerequisites.length?`${prerequisites.length-completed-waived} still need completion review. Source quality is shown separately below.`:'Add the program’s requirements before evaluating completion.'});
 rows.push({label:'GPA',student:profile?.data.gpa?`Recorded GPA: ${profile.data.gpa}`:'GPA not documented',program:school.data.gpa?`Entered minimum: ${school.data.gpa}`:'No program-specific requirement recorded',interpretation:'Verify the GPA scale and how the program calculates qualifying coursework; no eligibility judgment is made.'});
 rows.push({label:'Tests',student:profile?.data.exam?`${profile.data.exam}: ${profile.data.examScore||'score not documented'}`:'Test preparation not documented',program:programInfo('test','Test')+(school.data.score?` · Entered minimum score: ${school.data.score}`:''),interpretation:'Confirm the exam, score scale and validity period with the program.'});
 for(const [label,category,key] of [['Clinical experience','Clinical Experience','clinical'],['Shadowing','Shadowing','shadowing'],['Research','Research',''],['Volunteering / service','Volunteering',''],['Leadership','Leadership','']]){
  const count=records.filter(r=>r.kind==='experience'&&(r.data.category===category||category==='Volunteering'&&r.data.category==='Community Service')).length;
  const total=hours(category)+(category==='Volunteering'?hours('Community Service'):0),threshold=key==='clinical'?numeric(school.data[key]):null;
  rows.push({label,student:count?`${total.toLocaleString()} documented hours across ${count} experiences`:'No matching experience documented',program:programInfo(key,label==='Clinical experience'?'Clinical':label==='Volunteering / service'?'Service':label),interpretation:threshold!==null?`${total>=threshold?'Recorded total reaches':'Recorded total is below'} the entered figure of ${threshold}. Confirm source currency and which hours qualify; missing records may change this comparison.`:'Missing documentation does not establish missing experience. No sufficiency judgment is available.'});
 }
 const letters=linked.filter(r=>r.kind==='letter'),writing=linked.filter(r=>r.kind==='essay'),tasks=linked.filter(r=>r.kind==='task');
 rows.push({label:'Letters',student:`${letters.length} linked letter plans · ${letters.filter(r=>['Confirmed','Submitted'].includes(letterStatus(r))).length} confirmed or submitted`,program:programInfo('letters','Letters'),interpretation:'A planned letter is not a received letter. Confirm required letter types and submission status.'});
 rows.push({label:'Application materials',student:`${writing.length} linked writing records · ${tasks.filter(taskComplete).length} of ${tasks.length} linked tasks complete`,program:requirements.filter(r=>r.data.category==='Other').map(r=>r.data.title).join('; ')||'No materials checklist recorded',interpretation:'Only program-linked records are counted. General writing and tasks remain available in Application.'});
 rows.push({label:'Deadline',student:school.data.status||'Application status not recorded',program:school.data.deadline||'No deadline documented',interpretation:'Confirm the date and deadline type against the official program information.'});
 const next=[...evidence.next,...letters.filter(r=>!['Confirmed','Submitted'].includes(letterStatus(r))),...writing.filter(r=>!r.data.content?.trim()),...tasks.filter(r=>!taskComplete(r))].filter((r,i,a)=>a.findIndex(x=>x.id===r.id)===i).slice(0,4);
 return {school,evidence,source,rows,prerequisites,completed,next,actions:next.map(r=>({label:`Review ${r.data.title}`,destination:recordDestination(r,true)}))};
}
