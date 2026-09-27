export const programs = ['MD', 'DO', 'PA', 'Dental'] as const;
export const applicantTypes = ['Traditional', 'Nontraditional', 'First-generation', 'Career changer', 'Gap year applicant'] as const;
export const profileTags = ['Research-focused', 'Clinical-heavy', 'Service-heavy', 'Strong academics', 'High patient-care hours', 'Leadership-focused'] as const;
export type Program = typeof programs[number];
export type StoryFilters = {program: string; applicant: string; profiles: string[]};
export const emptyFilters: StoryFilters = {program: '', applicant: '', profiles: []};
export const slug = (value: string) => value.toLowerCase().replaceAll(' ', '-');
export type StudentStory = {
 id: string; name: string; major: string; program: Program; applicants: string[]; profiles: string[];
 verified: boolean; headline: string; goal: string; metrics: [string, string][];
 starting: string; insight: string; actions: string[]; before: string[]; after: string[];
 quote: string; outcome: string; features: string[];
};
// Fictional editorial examples, never sourced from a student's private workspace.
// Replace records with consented, verified stories before making real customer claims.
export const studentStories: StudentStory[] = [
 {id:'maya-r',name:'Maya R.',major:'Biology major',program:'MD',applicants:['Traditional','First-generation'],profiles:['Research-focused','Clinical-heavy'],verified:false,
 headline:'More activities wasn’t the missing piece.',goal:'Research-focused MD programs',metrics:[['GPA','3.76'],['MCAT','512'],['Clinical hours','1,180'],['Research hours','340'],['Service hours','175'],['Shadowing hours','68']],
 starting:'Maya worried most about her GPA. Her experiences were spread across separate records, and she struggled to explain how her research and patient care connected.',
 insight:'Three research experiences had substantial hours but incomplete reflections. Her service was also concentrated in one semester—something a total alone did not show.',
 actions:['Organize 11 major experiences and consolidate duplicate entries.','Capture her contribution, growth, and lessons from three research experiences.','Review service dates and preparation information for her saved programs.'],
 before:['Duplicate activity records','Three research reflections missing','Research and patient care in separate notes'],after:['11 organized experiences','Research contributions documented','A clearer connection between research and patient care'],
 quote:'I thought I needed more activities. Pathly showed me that I actually needed to explain the activities I already had better.',outcome:'In this fictional scenario, Maya is admitted to a research-intensive MD program she had considered a reach.',features:['Experiences','Reflections','School planning']},
 {id:'daniel-k',name:'Daniel K.',major:'Neuroscience major',program:'MD',applicants:['Traditional'],profiles:['Strong academics','Service-heavy'],verified:false,
 headline:'Application season started before senior year.',goal:'An in-state MD program',metrics:[['GPA','3.89'],['MCAT','516'],['Clinical hours','420'],['Research hours','95'],['Service hours','310'],['Shadowing hours','42']],
 starting:'Daniel focused on academic metrics and planned to organize his activities when application season arrived. His recent clinical work had few supporting details.',
 insight:'Several clinical entries were missing dates, responsibilities, and reflections about patient interaction. The useful next step was better documentation, not another score.',
 actions:['Complete dates and responsibilities for recent clinical work.','Save reflections while important details are fresh.','Keep school research and upcoming application milestones together.'],
 before:['Clinical details missing','Application planning deferred','School research in saved tabs'],after:['Clinical responsibilities documented','Reflections captured throughout junior year','Upcoming milestones organized'],
 quote:'I stopped thinking of my application as something I would build senior year. Pathly made me realize I was already building it.',outcome:'In this fictional scenario, Daniel receives several interviews and an offer from an MD program he had considered a reach.',features:['Experiences','Goals','School planning']},
 {id:'priya-s',name:'Priya S.',major:'Public health major',program:'PA',applicants:['Nontraditional','Career changer'],profiles:['High patient-care hours','Leadership-focused'],verified:false,
 headline:'Three years of work. Finally, one picture.',goal:'PA programs',metrics:[['GPA','3.68'],['Patient-care hours','2,240'],['Volunteer hours','155'],['Shadowing hours','36']],
 starting:'Priya had extensive patient-care experience, but her records lived in spreadsheets, notes, calendar reminders, browser tabs, and email drafts.',
 insight:'Her immediate challenge was fragmentation. Connecting reflections to experiences and checking program documentation could make her existing work easier to use.',
 actions:['Bring more than 2,000 patient-care hours into one record.','Attach reflections to the experiences they describe.','Review prerequisites, documentation, and deadlines for each saved program.'],
 before:['Hours across spreadsheets','Reflections detached from activities','Program requirements in browser tabs'],after:['Patient-care records consolidated','Reflections linked to experiences','Requirements and deadlines organized by program'],
 quote:'I had done the work for three years. I just couldn’t see the story anywhere.',outcome:'In this fictional scenario, Priya receives offers from three PA programs, including one she had considered a reach.',features:['Experiences','Reflections','School planning']},
 {id:'ethan-m',name:'Ethan M.',major:'Chemistry major',program:'Dental',applicants:['Traditional'],profiles:['Service-heavy','Leadership-focused'],verified:false,
 headline:'A fuller story, not a longer activity list.',goal:'Dental school',metrics:[['GPA','3.71'],['DAT AA','22'],['Shadowing hours','145'],['Service hours','210']],
 starting:'Ethan felt he needed more extracurricular activities despite already having shadowing, community service, and student leadership experience.',
 insight:'Several important experiences had little narrative documentation. Recording what he learned could help him understand what those activities meant to him.',
 actions:['Organize shadowing, service, and leadership experiences.','Capture meaningful moments and responsibilities.','Review saved programs and prepare activity descriptions from his records.'],
 before:['Hours without context','Leadership lessons left unwritten','Uncertainty about existing activities'],after:['Experiences organized by category','Meaningful moments preserved','Notes ready to revisit for application writing'],
 quote:'I kept asking what else I should add. Pathly helped me understand what I already had.',outcome:'In this fictional scenario, Ethan receives multiple interviews and an offer from a dental program he had considered a reach.',features:['Experiences','Story moments','Application preparation']},
 {id:'jordan-t',name:'Jordan T.',major:'Gap year applicant',program:'DO',applicants:['Traditional','Gap year applicant'],profiles:['Clinical-heavy','Service-heavy'],verified:false,
 headline:'A path aligned with the schools that mattered.',goal:'DO programs with a community medicine focus',metrics:[['GPA','3.61'],['MCAT','506'],['Clinical hours','760'],['Service hours','180'],['Shadowing hours','74']],
 starting:'Jordan worried about limited research while comparing himself with applicants pursuing very different programs.',
 insight:'His records left room to better document longitudinal clinical work, community service, and lessons from shadowing MD and DO physicians. Program-specific requirements still needed individual review.',
 actions:['Organize nine core experiences and 760 clinical hours.','Complete five missing reflections.','Research program missions and verify prerequisites and secondary deadlines.'],
 before:['Clinical work without full context','Five reflections missing','Program differences scattered across tabs'],after:['Nine core experiences organized','Clinical and shadowing lessons recorded','School-specific requirements ready to review'],
 quote:'I was comparing myself to applicants aiming for completely different programs. Pathly helped me focus on what actually mattered for the schools I was considering.',outcome:'In this fictional scenario, Jordan receives offers from two DO programs, including one he had considered a reach.',features:['Reflections','School planning','Goals']},
];
export function parseStoryFilters(params: Pick<URLSearchParams,'get'|'getAll'>): StoryFilters {
 const program=params.get('program')||'', applicant=params.get('applicant')||'';
 return {program:programs.some(p=>slug(p)===program)?program:'',applicant:applicantTypes.some(a=>slug(a)===applicant)?applicant:'',profiles:[...new Set(params.getAll('profile'))].filter(p=>profileTags.some(t=>slug(t)===p))};
}
export function storyQuery(filters: StoryFilters) {
 const params=new URLSearchParams();
 if(filters.program)params.set('program',filters.program);
 if(filters.applicant)params.set('applicant',filters.applicant);
 filters.profiles.forEach(p=>params.append('profile',p));
 return params.toString();
}
export function filterStories(filters: StoryFilters) {
 return studentStories.filter(s=>(!filters.program||slug(s.program)===filters.program)&&(!filters.applicant||s.applicants.some(a=>slug(a)===filters.applicant))&&filters.profiles.every(p=>s.profiles.some(t=>slug(t)===p)));
}
export function relatedStories(story: StudentStory) {
 const score=(s:StudentStory)=>(s.program===story.program?10:0)+s.applicants.filter(a=>story.applicants.includes(a)).length*3+s.profiles.filter(p=>story.profiles.includes(p)).length;
 return studentStories.filter(s=>s.id!==story.id).sort((a,b)=>score(b)-score(a)||a.id.localeCompare(b.id)).slice(0,2);
}
