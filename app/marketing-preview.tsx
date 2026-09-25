'use client';
import {useState,useSyncExternalStore} from 'react';
const subscribe=()=>()=>{};
import {Sparkles,ArrowUpRight} from 'lucide-react';
import {examples} from './model';
import {getDashboardState} from './dashboard-state';
import {NextBestActions,ReadinessCard} from './home-dashboard';
import {CopilotResponse} from './copilot-parts';
import {sendAskPathlyMessage,explainRecommendation} from './copilot-context';
import type {AssistantAnswer} from './assistant-types';
const initial=sendAskPathlyMessage('What should I focus on this semester?',examples,'Home');
const state=getDashboardState(examples,new Date('2026-09-24T12:00:00Z'),'Alex');
export default function MarketingPreview({compact=false}:{compact?:boolean}){
 const ready=useSyncExternalStore(subscribe,()=>true,()=>false);
 const [answer,setAnswer]=useState<AssistantAnswer>(initial),[question,setQuestion]=useState('What should I focus on this semester?'),[shown,setShown]=useState(true),[notice,setNotice]=useState('');
 const act=()=>setNotice('This is an example. Open your own Pathly workspace to review and save changes.');
 return <div data-ready={ready} className={'marketing-preview '+(compact?'compact':'')} id={compact?undefined:'product-preview'}><div className="preview-toolbar"><span>PATHLY / EXAMPLE JOURNEY</span><span>Illustrative records · Interactive preview</span></div><div className="preview-workspace">{!compact&&<div className="preview-dashboard home-dashboard"><div className="eyebrow">YOUR PATH, MADE CLEAR</div><h3>Your focus, Alex.</h3><p>A little perspective. A clear next step.</p><NextBestActions state={state} demo={false} onAction={act} onWhy={action=>{setQuestion('Why this? '+action.title);setAnswer(explainRecommendation(action));setShown(true)}}/><ReadinessCard state={state} onAction={act}/></div>}<div className="preview-copilot"><button className="preview-toggle" aria-expanded={shown} onClick={()=>setShown(!shown)}><Sparkles size={17}/>Ask Pathly<span>{shown?'−':'+'}</span></button>{shown&&<><div className="preview-prompts" aria-label="Try an example question">{['What should I focus on this semester?','What schools should I research?'].map(p=><button key={p} aria-pressed={question===p} onClick={()=>{setQuestion(p);setAnswer(sendAskPathlyMessage(p,examples,'Home'))}}>{p}</button>)}</div><p className="preview-question">{question}</p><CopilotResponse message={{id:'preview',role:'assistant',text:answer.text,actions:answer.actions,createdAt:''}} onAction={act}/><small>Local planning rules, using example data. No connected AI model.</small></>}</div></div>{notice&&<div className="preview-notice" role="status">{notice}<a href="/app">Start your path<ArrowUpRight size={14}/></a></div>}</div>
}
