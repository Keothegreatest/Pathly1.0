import {ArrowUpRight} from 'lucide-react';
import type {NextAction,Destination} from './journey';

export function RecommendationCard({action,index,onAction,onWhy}:{action:NextAction;index:number;onAction:(d:Destination)=>void;onWhy?:(a:NextAction)=>void}){
 const priority=action.priority>=95?'Time-sensitive':action.tone==='attention'?'Needs review':'Worth considering';
 return <li><span className="home-action-number">{index+1}</span><div className="home-action-body"><span className="recommendation-priority">{priority}</span><h3>{action.title}</h3><p className="home-action-reason">{action.reason}</p><p className="home-evidence">Based on: {action.evidence}</p><div className="home-action-controls">{onWhy&&<button className="why-action text-button" onClick={()=>onWhy(action)}>Why this?</button>}<button className={index===0?'primary':'secondary'} onClick={()=>onAction(action.destination)}>{action.label}<ArrowUpRight size={14}/></button></div></div></li>;
}
