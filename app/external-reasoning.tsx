'use client';
import {useEffect,useRef,useState} from 'react';
import {buildStudentIntelligence,type PlanningMemory} from './student-intelligence';
import {retrievePlanningContext,externalPlanningContext,redact,type RetrievedContext} from './assistant-retrieval';
import {validateModelAnswer} from '../lib/assistant/contract';
import type {Entry} from './model';
import type {AssistantMessage,AssistantAnswer} from './assistant-types';
type ChallengeAPI={render:(element:HTMLElement,options:Record<string,unknown>)=>string;remove:(id:string)=>void};
declare global{interface Window{turnstile?:ChallengeAPI}}
function Challenge({siteKey,onToken}:{siteKey:string;onToken:(token:string)=>void}){
 const element=useRef<HTMLDivElement>(null),callback=useRef(onToken);
 useEffect(()=>{callback.current=onToken},[onToken]);
 const [error,setError]=useState('');
 useEffect(()=>{let id:string|undefined,active=true;const script=document.createElement('script');
  function mount(){if(active&&element.current&&window.turnstile)id=window.turnstile.render(element.current,{sitekey:siteKey,action:'pathly_assistant',callback:(token:string)=>callback.current(token),'error-callback':()=>setError('Verification failed. Close and try again.'),'expired-callback':()=>setError('Verification expired. Close and try again.')});}
  if(window.turnstile)mount();else{script.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';script.async=true;script.onload=mount;script.onerror=()=>setError('Verification could not load. Local planning remains available.');document.head.appendChild(script);}
  return()=>{active=false;if(id)window.turnstile?.remove(id);script.remove();};
 },[siteKey]);
 return <><div ref={element}/>{error&&<p role="alert" className="error">{error}</p>}</>;
}
export function ExternalReasoning({records,memories,history,question,onAnswer,onBusy,fallback,disabled}:{records:Entry[];memories:PlanningMemory[];history:AssistantMessage[];question:string;onAnswer:(q:string,a:AssistantAnswer)=>Promise<void>;onBusy:(v:boolean)=>void;fallback:(q:string)=>AssistantAnswer;disabled:boolean}){
 const [config,setConfig]=useState<{available:boolean;siteKey?:string}|null>(null),[notice,setNotice]=useState('');
 const [review,setReview]=useState<{question:string;context:RetrievedContext}|null>(null),[approved,setApproved]=useState(false),[pending,setPending]=useState(false);
 const lock=useRef(false),abort=useRef<AbortController|null>(null);
 useEffect(()=>()=>abort.current?.abort(),[]);
 async function check(){if(config)return;try{const response=await fetch('/api/assistant',{cache:'no-store'});if(!response.ok)throw new Error();setConfig(await response.json());}catch{setNotice('External reasoning is unavailable. Local planning remains available.');}}
 async function send(token:string){if(!review||lock.current)return;lock.current=true;setPending(true);onBusy(true);setNotice('');abort.current=new AbortController();const timer=setTimeout(()=>abort.current?.abort(),32000);
  try{const context=externalPlanningContext(review.context);const response=await fetch('/api/assistant',{method:'POST',signal:abort.current.signal,headers:{'Content-Type':'application/json'},body:JSON.stringify({question:redact(review.question),context,consent:true,challenge:token})});if(!response.ok)throw new Error();const data=await response.json() as {answer?:unknown};const answer=validateModelAnswer(data.answer,context);await onAnswer(review.question,{mode:'model',text:[answer.answer,answer.reasoningSummary,...answer.inferences.map(t=>'Planning inference: '+t)].filter(Boolean).join('\n\n'),evidence:answer.evidenceIds.map(id=>context.facts.find(f=>f.id===id)!),actions:answer.actionIds.map(id=>review.context.actions.find(a=>a.id===id)!).map(a=>({label:a.label,destination:a.destination})),memoryCandidate:answer.memoryCandidate||undefined});setReview(null);setApproved(false);
  }catch{if(!abort.current?.signal.aborted){await onAnswer(review.question,fallback(review.question));setNotice('External reasoning could not be verified. This answer uses the local planning guide.');}else setNotice('The external request stopped. Your question is still available; you can use local planning.');}
  finally{clearTimeout(timer);setPending(false);onBusy(false);lock.current=false;setApproved(false);}
 }
 return <details className="external-reasoning" onToggle={e=>{if(e.currentTarget.open)void check()}}><summary>External reasoning · optional</summary>{!config&&!notice&&<p role="status">Checking availability…</p>}{config&&!config.available&&<p>External reasoning is not enabled. Your local planning guide remains available.</p>}{config?.available&&<><p>Review exactly what will leave this browser. OpenAI receives your question and selected context; Cloudflare verifies the request. Names or sensitive details you put in free text may remain. No records are changed.</p><button type="button" className="secondary" disabled={disabled||pending||!question.trim()} onClick={()=>{setApproved(false);setReview({question:question.trim(),context:retrievePlanningContext(buildStudentIntelligence(records,memories),question,history)})}}>Review selected context</button>{review&&<><pre className="context-preview" tabIndex={0}>{JSON.stringify({question:redact(review.question),context:externalPlanningContext(review.context)},null,2)}</pre><button type="button" className="primary" disabled={pending||approved||disabled} onClick={()=>setApproved(true)}>Send this context to OpenAI</button><button type="button" className="text-button" disabled={pending} onClick={()=>{setReview(null);setApproved(false)}}>Cancel</button>{approved&&config.siteKey&&<Challenge siteKey={config.siteKey} onToken={token=>void send(token)}/>}</>}</>}{pending&&<p role="status">Preparing your answer… You can keep using Pathly.</p>}{notice&&<p role="status">{notice}</p>}</details>;
}
