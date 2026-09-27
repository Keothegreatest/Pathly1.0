/** Shared public filters and workspace options; labels do not imply eligibility. */
export const pathways = [
 {id:'md-do',label:'MD/DO',programs:['MD','DO'],profile:'Pre-medical',school:'Medicine'},
 {id:'pa',label:'PA',programs:['PA'],profile:'Pre-PA',school:'Physician Assistant'},
 {id:'pt',label:'PT',programs:['PT'],profile:'Pre-PT',school:'Physical Therapy'},
 {id:'ot',label:'OT',programs:['OT'],profile:'Pre-OT',school:'Occupational Therapy'},
 {id:'nursing',label:'Nursing',programs:['Nursing'],profile:'Nursing',school:'Nursing'},
 {id:'pre-nursing',label:'Pre-Nursing',programs:['Pre-Nursing'],profile:'Pre-Nursing',school:'Pre-Nursing'},
 {id:'dental',label:'Dental',programs:['Dental'],profile:'Pre-dental',school:'Dentistry'},
] as const;
export type StoryProgram = typeof pathways[number]['programs'][number];
export const professionOptions:string[]=[...pathways.map(p=>p.label),'Pharmacy','Other'];
export const profilePathways:string[]=[...pathways.map(p=>p.profile),'Pre-pharmacy','Other'];
export const schoolPrograms:string[]=[...pathways.map(p=>p.school),'Pharmacy','Other'];
export function normalizeProfilePathway(value:string){return value==='Pre-nursing'?'Pre-Nursing':value}
export function profilePathway(profession:string){return pathways.find(p=>p.label===profession)?.profile||({Pharmacy:'Pre-pharmacy',Other:'Other'} as Record<string,string>)[profession]||''}
export function normalizeStoryProgram(value:string){const key=value.toLowerCase();return key==='md'||key==='do'||key==='md/do'?'md-do':pathways.some(p=>p.id===key)?key:''}
export function matchesStoryProgram(program:StoryProgram,filter:string){return !filter||!!pathways.find(p=>p.id===filter)?.programs.some(p=>p===program)}
