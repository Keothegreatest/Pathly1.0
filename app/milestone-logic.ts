import type {Entry} from './model';
import type {Milestone} from './milestone';
import {goalProgress} from './journey';
import {targetProgress} from './personalization';
export function meaningfulMilestone(before:Entry[],after:Entry[],changed:Entry):Milestone|null{
 const previous=before.find(r=>r.id===changed.id);
 if(changed.kind==='goal'&&!previous)return {id:'goal-created:'+changed.id,title:'Goal created.',detail:`You’re now working toward “${changed.data.title}”. Keep your next step realistic and adjust the plan as your semester changes.`};
 for(const goal of after.filter(r=>r.kind==='goal')){const old=before.find(r=>r.id===goal.id);if(!old)continue;const current=goalProgress(goal,after),was=goalProgress(old,before);if(goal.data.status==='Completed'&&old.data.status!=='Completed'||current.total>0&&current.current>=current.total&&(was.total<=0||was.current<was.total))return {id:'goal-reached:'+goal.id+':'+current.total,title:'A goal reached.',detail:`“${goal.data.title}” now meets your saved target. Take a moment to recognize the work behind it.`};}
 const target=targetProgress(after),old=targetProgress(before);if(target&&old&&target.current>=target.total&&old.current<old.total)return {id:'clinical-target:'+target.total,title:`${target.total.toLocaleString()} clinical hours reached.`,detail:'You set this personal target in your Pathly plan. Your documented experiences now meet it.'};return null;
}
