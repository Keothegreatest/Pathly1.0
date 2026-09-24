import type { Entry } from './model';
import {goalProgress} from './goal-progress';
import {getStudentStage,getStagePriority} from './student-context';
import {taskComplete,letterStatus,recordDestination} from './record-links';
import type { Destination, NextAction } from './journey';

const DAY = 86400000;
const closedSchools = ['Submitted', 'Withdrawn', 'Rejected', 'Accepted'];
const addressed = (r: Entry) => ['Complete', 'Not applicable'].includes(r.data.status);

/** Evidence-only rules. Priority bands: deadlines, requirements, reflection, planning.
 * Ties use stable IDs; the same data produces the same order. No admission scoring.
 */
export function recommendActions(records: Entry[], now = new Date()): NextAction[] {
  const of = (kind: string) => records.filter(r => r.kind === kind);
  const actions: NextAction[] = [];
  const stage=getStudentStage(records);
  const daysTo = (date: string) => Math.ceil((Date.parse(date + 'T23:59:59') - now.getTime()) / DAY);
  const add = (id: string, title: string, reason: string, evidence: string, label: string, priority: number, destination: Destination) => {
    const kind=destination.record?.kind||destination.kind||'';
    actions.push({ id, title, reason, evidence, label, priority:priority+getStagePriority(kind,stage), tone: priority >= 80 ? 'attention' : 'opportunity', destination });
  };
  const edit = (page: string, record: Entry, tab?: string): Destination => ({ page, record, tab, edit: true });
  for (const school of of('school').filter(s => !closedSchools.includes(s.data.status))) {
    const requirements = of('requirement').filter(r => r.data.school === school.id);
    const days = daysTo(school.data.deadline);
    if (Number.isFinite(days) && days <= 45 && days >= -14) {
      add('deadline-' + school.id, `Review ${school.data.title}’s deadline`, 'Verify the official date and address the remaining preparation before submitting.', `${school.data.deadline} · ${days < 0 ? 'Recorded deadline has passed' : `${days} days remaining`} · ${requirements.filter(r => !addressed(r)).length} unresolved recorded requirements`, 'Review school', 110 - Math.max(days, 0) / 10, edit('Schools', school, 'school'));
    }
    for (const requirement of requirements.filter(r => !addressed(r))) {
      const hard = requirement.data.type === 'Hard requirement';
      add('requirement-' + requirement.id, `Review ${requirement.data.title}`, 'Check your completion evidence and the school’s official source, then update this requirement.', `${school.data.title} · ${requirement.data.category || 'Requirement'} · ${requirement.data.status || 'Not reviewed'} · ${hard ? 'Required' : 'Recommendation'}${requirement.data.source && requirement.data.verified ? '' : ' · Source needs verification'}`, 'Update requirement', hard ? 88 : 63, edit('Schools', requirement, 'requirement'));
    }
    if (!requirements.length) add('research-' + school.id, `Document requirements for ${school.data.title}`, 'No structured requirements are saved. Add requirements from the program’s official information so Pathly can connect them to your preparation.', `${school.data.title} · 0 saved requirements`, 'Add requirement', 54, {page:'Schools', tab:'requirement', kind:'requirement', data:{school:school.id}});
    else if (requirements.some(r => addressed(r) && (!r.data.source || !r.data.verified))) {
      const r = requirements.find(r => addressed(r) && (!r.data.source || !r.data.verified))!;
      add('verify-' + r.id, `Verify ${r.data.title}`, 'This item is marked addressed, but its source or verification date is missing.', school.data.title + ' · ' + r.data.title, 'Verify requirement', 59, edit('Schools', r, 'requirement'));
    }
    const clinical = of('experience').filter(e => e.data.category === 'Clinical Experience').reduce((n,e) => n + Number(e.data.hours || 0), 0);
    const required = Number(school.data.clinical);
    if (Number.isFinite(required) && required > clinical) add('clinical-' + school.id, `Review the clinical-hour gap for ${school.data.title}`, 'Compare your experience with the school’s definition of eligible hours. This is a recorded requirement, not an admissions prediction.', `${clinical} documented clinical hours / ${required} entered requirement${school.data.verified ? '' : ' · Requirement needs verification'}`, 'Review school', 84, edit('Schools', school, 'school'));
  }
  for (const task of of('task').filter(t => !taskComplete(t))) {
    const days = daysTo(task.data.target);
    add('task-' + task.id, `Finish ${task.data.title}`, 'This preparation task is still open in your application plan.', `${task.data.category || 'Application task'}${task.data.target ? ' · Target ' + task.data.target : ' · No target date'}`, 'Open task', Number.isFinite(days) && days <= 14 ? 100 - Math.max(days,0) / 10 : 62, edit('Application', task, 'tasks'));
  }
  for (const goal of of('goal').filter(g => !['Completed','Paused'].includes(g.data.status))) {
    const days = daysTo(goal.data.target);
    const {current} = goalProgress(goal,records);
    const progress = Number(goal.data.total) > 0 ? `${current} / ${goal.data.total} ${goal.data.unit || ''}` : goal.data.status || 'Not Started';
    if (Number.isFinite(days) && days <= 30 || goal.data.priority === 'High') add('goal-' + goal.id, `Review ${goal.data.title}`, 'Your goal is approaching its target or marked high priority. Review its progress and choose the next step.', `${progress}${goal.data.target ? ' · Target ' + goal.data.target : ''}${goal.data.priority === 'High' ? ' · High priority' : ''}`, 'Update goal', Number.isFinite(days) && days <= 7 ? 93 : 78, edit('Goals', goal));
    if (goal.data.category && !of('experience').some(e => e.data.category === goal.data.category) && ['Clinical Experience','Shadowing','Research','Volunteering','Community Service','Leadership'].includes(goal.data.category)) add('category-' + goal.id, `Build toward ${goal.data.title}`, 'You set a goal in this category, but no matching experience has been documented. Add relevant work you have done or revisit the goal.', `${goal.data.category} · 0 documented experiences · Goal: ${goal.data.title}`, 'Add experience', 51, {page:'Experiences',kind:'experience',data:{category:goal.data.category}});
  }
  for (const experience of of('experience')) {
    const reflections = of('reflection').filter(r => r.data.experience === experience.id && r.data.content?.trim() && r.data.status!=='Draft').sort((a,b)=>b.updated.localeCompare(a.updated));
    const latest = reflections[0];
    const draft=of('reflection').filter(r=>r.data.experience===experience.id&&(r.data.status==='Draft'||!r.data.content?.trim())).sort((a,b)=>b.updated.localeCompare(a.updated))[0];
    const addedHours = latest?.data.hoursAtReflection !== undefined ? Number(experience.data.hours || 0)-Number(latest.data.hoursAtReflection) : 0;
    const recent = now.getTime()-Date.parse(experience.updated) <= 30*DAY;
    // A new reflection needs meaningful accumulated hours and a two-week cooldown.
    const needsAnother = latest && addedHours >= 8 && now.getTime()-Date.parse(latest.updated) >= 14*DAY;
    if((!latest||needsAnother)&&draft)add('reflection-'+experience.id,`Continue your reflection on ${experience.data.title}`,'You have a saved reflection draft. Pick up with the details you want to preserve.','Draft last updated '+draft.updated.slice(0,10),'Continue reflection',recent?81:66,edit('Experiences',draft,'reflection'));
    else if (!latest || needsAnother) add('reflection-' + experience.id, `Add a reflection for ${experience.data.title}`, 'Capture what you learned while the details are fresh. This context can support future activity descriptions and essays.', `${experience.data.organization || experience.data.category || 'Experience'} · ${latest ? `${addedHours} hours added since your last reflection` : `${experience.data.hours || 0} documented hours · No saved reflection`}`, 'Add reflection', recent ? 81 : 66, {page:'Experiences',tab:'reflection',kind:'reflection',data:{experience:experience.id,title:`Reflection on ${experience.data.title}`,date:now.toISOString().slice(0,10)}});
    if (!experience.data.supervisor || !experience.data.contact) add('contact-' + experience.id, `Complete contact details for ${experience.data.title}`, 'Keep a reliable point of contact alongside the experience for future verification or follow-up.', `${!experience.data.supervisor ? 'Supervisor not recorded' : experience.data.supervisor} · ${!experience.data.contact ? 'Contact information missing' : 'Contact information saved'}`, 'Add contact details', 57, edit('Experiences',experience,'experience'));
    if (recent && latest && !of('story').some(s => s.data.experience === experience.id)) add('story-' + experience.id, `Keep a moment from ${experience.data.title}`, 'You have reflected on this experience. Preserve a specific interaction or lesson if one stands out.', `${reflections.length} saved reflection${reflections.length === 1 ? '' : 's'} · No linked Story Moment`, 'Capture Story Moment', 48, {page:'Experiences',tab:'story',kind:'story',data:{experience:experience.id}});
    if (experience.data.application === 'Include' && !experience.data.applicationDescription?.trim()) add('description-' + experience.id, `Draft the activity description for ${experience.data.title}`, 'You chose to include this experience in your application, but its application description is empty.', 'Application relevance: Include · Description not started', 'Write description', 64, edit('Application',experience,'experience'));
  }
  for (const essay of of('essay').filter(e=>!e.data.content?.trim())) add('writing-'+essay.id, `Start ${essay.data.title}`, 'You created this writing record, but no draft text is saved yet.', `${essay.data.type || 'Writing'} · Empty draft`, 'Open draft', 60, edit('Application',essay,'writing'));
  for(const letter of of('letter').filter(l=>letterStatus(l)!=='Submitted')){const days=daysTo(letter.data.target);if(Number.isFinite(days)&&days<=30)add('letter-'+letter.id,`Review the recommendation from ${letter.data.title}`,'Check the request and confirm the target date with your recommender.',`${letterStatus(letter)} · Target ${letter.data.target}`,'Open recommender',days<=7?96:82,recordDestination(letter,true));}
  if(!of('school').length&&of('experience').length)add('start-schools','Start your school list.','Even one program gives Pathly something concrete to organize.','No saved schools','Add school',35,{page:'Schools',kind:'school'});
  const unused=of('story').filter(s=>!s.data.essay);if(unused.length&&['Preparing to apply','Applying now'].includes(stage))add('story-bank','You have moments worth returning to.','Revisit your own examples as you prepare writing or interviews.',unused.length+' Story Moments not linked to writing','Open Story Bank',58,{page:'Experiences',tab:'story'});
  return actions.sort((a,b)=>b.priority-a.priority || a.id.localeCompare(b.id)).slice(0,5);
}
