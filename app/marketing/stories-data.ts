import {pathways,normalizeStoryProgram,matchesStoryProgram,type StoryProgram} from '../pathways';
export const programs = pathways.map(p=>p.label);
export const applicantTypes = ['Traditional', 'Nontraditional', 'First-generation', 'Career changer', 'Gap year applicant'] as const;
export const profileTags = ['Research-focused', 'Clinical-heavy', 'Service-heavy', 'Strong academics', 'High patient-care hours', 'Leadership-focused', 'Building academics', 'Early exploration', 'Observation diversity', 'Deadline planning'] as const;
export type Program = StoryProgram;
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
 {id:'alex-c',name:'Alex C.',major:'Kinesiology major',program:'PT',applicants:['Traditional'],profiles:['Observation diversity','Deadline planning'],verified:false,
 headline:'Different settings. A broader perspective.',goal:'Physical therapy programs',metrics:[['GPA','3.54'],['Observation hours','92'],['Settings observed','1']],
 starting:'Alex had observed outpatient rehabilitation regularly but kept comparing hour totals rather than reviewing what each program actually requested.',
 insight:'His notes represented only one setting. Reviewing saved program requirements could clarify whether additional observation settings or documentation were needed.',
 actions:['Organize observation dates, settings, and supervisor details.','Verify each program’s observation requirements at the source.','Set a goal to explore another setting if relevant to his chosen programs.'],before:['Observation hours in a single total','Program requirements not compared','Questions about different settings left unwritten'],after:['Observation setting documented','Requirements reviewed individually','Questions and next steps organized'],
 quote:'I could see what I had learned—and what I still wanted to understand.',outcome:'In this fictional scenario, Alex enters application preparation with documented observation records and a plan to verify remaining requirements.',features:['Experiences','School requirements','Goals']},
 {id:'samira-l',name:'Samira L.',major:'Psychology major',program:'OT',applicants:['Traditional','First-generation'],profiles:['Leadership-focused'],verified:false,
 headline:'The details were the part worth keeping.',goal:'Occupational therapy programs',metrics:[['GPA','3.62'],['Observation hours','65'],['Community service hours','220']],
 starting:'Samira supported an adaptive recreation program and observed occupational therapists. Her records listed hours but little about her role or what she learned.',
 insight:'Connecting specific responsibilities and reflections to each experience made the records more useful than one combined activity summary.',
 actions:['Separate observation and volunteer roles.','Record lessons about participation, access, and teamwork without identifying patient details.','Link meaningful moments to their original experiences.'],before:['Different roles grouped together','Lessons remembered but not written','No clear source for activity examples'],after:['Roles and dates organized','Reflections attached to experiences','Examples ready to revisit for writing'],
 quote:'I didn’t need a perfect essay. I needed a place to remember the small things.',outcome:'In this fictional scenario, Samira prepares an organized set of activity records and reflections to use during application writing.',features:['Experiences','Reflections','Story moments']},
 {id:'elena-v',name:'Elena V.',major:'Career changer',program:'Nursing',applicants:['Nontraditional','Career changer'],profiles:['Deadline planning'],verified:false,
 headline:'One deadline, with the pieces in view.',goal:'An accelerated nursing program',metrics:[['GPA','3.42'],['Prerequisites documented','6 of 8'],['Healthcare volunteer hours','120']],
 starting:'Elena was balancing work with prerequisite courses. An approaching application deadline made it difficult to distinguish completed work from missing documentation.',
 insight:'Her personal checklist separated courses still in progress from requirements that simply needed verification. Program rules and transcript timing still required confirmation.',
 actions:['Record completed and in-progress prerequisites.','Check transcript timing and requirements on the program website.','Add individual tasks for remaining documents and deadlines.'],before:['Course and document tasks mixed together','Deadline saved in email','Unclear transcript timing'],after:['Prerequisite status recorded','Deadline connected to tasks','Questions ready for the program office'],
 quote:'Seeing the remaining pieces together made planning my week much simpler.',outcome:'In this fictional scenario, Elena has a clear submission checklist and knows which timing questions to confirm with the program.',features:['School requirements','Application tasks','Goals']},
 {id:'noah-b',name:'Noah B.',major:'First-year college student',program:'Pre-Nursing',applicants:['Traditional','First-generation'],profiles:['Early exploration','Building academics'],verified:false,
 headline:'A starting point, not a finished plan.',goal:'Explore nursing pathways and prerequisite options',metrics:[['GPA','3.30'],['Prerequisites documented','2 of 7'],['Volunteer hours','28']],
 starting:'Noah was early in college and did not yet know which nursing program he would pursue. Advice and course notes were scattered across messages.',
 insight:'He could begin with completed coursework and one volunteer experience without claiming to have a complete application plan. His seven-item checklist was personal, not a universal nursing requirement.',
 actions:['Add the volunteer experience he already had.','Save programs to research with an advisor.','Record questions about prerequisite sequences and transfer policies.'],before:['Course questions in messages','Volunteer details kept from memory','No single place for program notes'],after:['First experience documented','Program research started','A short list of questions for advising'],
 quote:'I could start with what I knew and leave room for what I hadn’t figured out.',outcome:'In this fictional scenario, Noah leaves his first planning session with an organized starting point and one manageable research goal.',features:['Experiences','School planning','Goals']},
 {id:'grace-w',name:'Grace W.',major:'Post-baccalaureate student',program:'DO',applicants:['Nontraditional','Gap year applicant'],profiles:['Building academics','Clinical-heavy'],verified:false,
 headline:'An academic trend deserves context.',goal:'Review DO program prerequisites and application timing',metrics:[['Cumulative GPA','3.28'],['Recent coursework GPA','3.72'],['Clinical hours','680']],
 starting:'Grace had returned to coursework after several years working. A cumulative GPA alone did not help her organize her recent classes or explain the timing of her experiences.',
 insight:'Keeping recent coursework notes, program policies, and longitudinal clinical experiences together helped her prepare specific questions for an advisor. Pathly did not assess her chances.',
 actions:['Record academic context and questions in school notes.','Verify prerequisite recency policies for saved programs.','Organize clinical responsibilities and reflections across dates.'],before:['Coursework context scattered','Prerequisite policies unverified','Clinical roles missing dates'],after:['Questions organized for advising','Program policies ready to verify','A clearer experience timeline'],
 quote:'I stopped asking one number to explain my whole journey.',outcome:'In this fictional scenario, Grace reviews her timeline with an advisor using organized coursework notes and program-specific questions.',features:['School notes','Experiences','Reflections']},
 {id:'luis-a',name:'Luis A.',major:'Biochemistry major',program:'MD',applicants:['Traditional'],profiles:['Research-focused','Early exploration'],verified:false,
 headline:'Room to explore beyond the laboratory.',goal:'Build a thoughtful plan before choosing MD programs',metrics:[['GPA','3.91'],['Research hours','520'],['Clinical hours','24']],
 starting:'Luis enjoyed research and had limited clinical exposure. He wanted to understand patient-facing work without treating new activities as boxes to collect.',
 insight:'His saved records showed a research-centered journey. A self-defined exploration goal could help him learn more about clinical work and service, without inventing an hours benchmark.',
 actions:['Capture what research had taught him.','Set a manageable goal to explore patient-facing opportunities.','Record questions and reflections before deciding on longer commitments.'],before:['Research documented mainly as hours','Clinical questions left vague','No small exploration goal'],after:['Research lessons preserved','A realistic exploration goal','Questions to revisit after new experiences'],
 quote:'My next step could be about learning, not just adding another line.',outcome:'In this fictional scenario, Luis begins a manageable exploration plan alongside his research and coursework.',features:['Reflections','Goals','Experiences']},
];
export function parseStoryFilters(params: Pick<URLSearchParams,'get'|'getAll'>): StoryFilters {
 const program=params.get('program')||'', applicant=params.get('applicant')||'';
 return {program:normalizeStoryProgram(program),applicant:applicantTypes.some(a=>slug(a)===applicant)?applicant:'',profiles:[...new Set(params.getAll('profile'))].filter(p=>profileTags.some(t=>slug(t)===p))};
}
export function storyQuery(filters: StoryFilters) {
 const params=new URLSearchParams();
 if(normalizeStoryProgram(filters.program))params.set('program',normalizeStoryProgram(filters.program));
 if(filters.applicant)params.set('applicant',filters.applicant);
 filters.profiles.forEach(p=>params.append('profile',p));
 return params.toString();
}
export function filterStories(filters: StoryFilters) {
 return studentStories.filter(s=>matchesStoryProgram(s.program,normalizeStoryProgram(filters.program))&&(!filters.applicant||s.applicants.some(a=>slug(a)===filters.applicant))&&filters.profiles.every(p=>s.profiles.some(t=>slug(t)===p)));
}
export function relatedStories(story: StudentStory) {
 const score=(s:StudentStory)=>(s.program===story.program?10:0)+s.applicants.filter(a=>story.applicants.includes(a)).length*3+s.profiles.filter(p=>story.profiles.includes(p)).length;
 return studentStories.filter(s=>s.id!==story.id).sort((a,b)=>score(b)-score(a)||a.id.localeCompare(b.id)).slice(0,2);
}
