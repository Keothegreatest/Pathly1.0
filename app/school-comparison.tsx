import type {Entry} from './model';
import {letterStatus} from './record-links';
import {SchoolAlignment} from './record-detail';
import {Table,TableBody,TableCell,TableHead,TableHeader,TableRow} from '@/components/ui/table';

const details=[['status','Application status'],['interview','Interview date'],['notes','Notes'],['location','Location'],['degree','Degree'],['tuition','Tuition'],['gpa','Minimum GPA'],['recommendedGpa','Recommended GPA'],['test','Tests'],['clinical','Clinical requirement'],['shadowing','Shadowing'],['letters','Letters'],['length','Program length'],['classSize','Class size'],['mission','Mission'],['deadline','Deadline'],['verified','Last reviewed']];
function comparisonRows(school:Entry,records:Entry[]){
 const linked=records.filter(r=>r.data.school===school.id);
 const prerequisites=linked.filter(r=>r.kind==='requirement'&&r.data.category==='Prerequisite');
 return [...details.map(([key,label])=>({label,value:school.data[key]||'Not documented'})),
  {label:'Unresolved prerequisites',value:prerequisites.filter(r=>!['Complete','Not applicable'].includes(r.data.status)).map(r=>r.data.title).join('; ')||(prerequisites.length?'None recorded as unresolved':'Not documented')},
  {label:'Linked recommenders',value:linked.filter(r=>r.kind==='letter').map(r=>`${r.data.title} — ${letterStatus(r)}`).join('; ')||'Not documented'},
  {label:'Writing & supplementals',value:linked.filter(r=>r.kind==='essay').map(r=>`${r.data.title} — ${r.data.status||'Draft'}`).join('; ')||'Not documented'},
  {label:'Prerequisites',value:prerequisites.map(r=>`${r.data.title} — ${r.data.type||'Unclassified'} · ${r.data.status||'Not reviewed'}`).join('; ')||'Not documented'}];
}
export function SchoolComparison({schools,records,selected,onInspect}:{schools:Entry[];records:Entry[];selected:string[];onInspect:(r:Entry)=>void}){
 const columns=schools.filter(s=>!selected.length||selected.includes(s.id)).map(s=>({school:s,rows:comparisonRows(s,records)}));
 if(!columns.length)return <section className="empty-state"><h2>Start with a program you’re curious about.</h2><p>Add a school and its requirements to compare the preparation each program asks for.</p></section>;
 return <section className="card"><h2>Side by side</h2><p className="empty-inline">{selected.length?'Comparing your selected programs.':'Select programs in My schools to narrow this comparison.'} These are your entered details, not an eligibility assessment.</p><div className="comparison-desktop"><Table><TableHeader><TableRow><TableHead>Program detail</TableHead>{columns.map(({school})=><TableHead key={school.id}><button className="text-button" onClick={()=>onInspect(school)}>{school.data.title}</button></TableHead>)}</TableRow></TableHeader><TableBody>{columns[0].rows.map((row,i)=><TableRow key={row.label}><TableCell>{row.label}</TableCell>{columns.map(({school,rows})=><TableCell key={school.id}>{rows[i].value}</TableCell>)}</TableRow>)}</TableBody></Table></div><div className="comparison-mobile">{columns.map(({school,rows})=><article key={school.id}><h3><button className="text-button" onClick={()=>onInspect(school)}>{school.data.title}</button></h3><SchoolAlignment school={school} records={records} onInspect={onInspect}/><details><summary>Program details</summary><dl>{rows.filter(row=>row.value!=='Not documented').map(row=><div key={row.label}><dt>{row.label}</dt><dd>{row.value}</dd></div>)}</dl><p className="empty-inline">{rows.filter(row=>row.value==='Not documented').length} other program details are not documented. Open the program to add details from its official sources.</p></details></article>)}</div></section>;
}
