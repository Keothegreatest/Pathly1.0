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
  if(window.turnstile)mount();else{script.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';script.async=true;script.onload=mount;script.onerror=()=>setError('Verification could not load. You can continue without sharing.');document.head.appendChild(script);}
  return()=>{active=false;if(id)window.turnstile?.remove(id);script.remove();};
 },[siteKey]);
 return <><div ref={element}/>{error&&<p role="alert" className="error">{error}</p>}</>;
}
export function ExternalReasoning({records,memories,history,question,onAnswer,onBusy,fallback,disabled}:{records:Entry[];memories:PlanningMemory[];history:AssistantMessage[];question:string;onAnswer:(q:string,a:AssistantAnswer)=>Promise<void>;onBusy:(v:boolean)=>void;fallback:(q:string)=>AssistantAnswer;disabled:boolean}){
 const [config,setConfig]=useState<{available:boolean;siteKey?:string}|null>(null),[notice,setNotice]=useState('');
 const [review,setReview]=useState<{question:string;context:RetrievedContext}|null>(null),[approved,setApproved]=useState(false),[pending,setPending]=useState(false);
 const lock=useRef(false),abort=useRef<AbortController|null>(null);
 useEffect(()=>()=>abort.current?.abort(),[]);
 const [request]=useState(()=>({question,records,memories,history,onAnswer,fallback}));
 useEffect(()=>{
  let active=true;
  fetch('/api/assistant',{cache:'no-store'}).then(async response=>{
   if(!response.ok)throw new Error();
   const next=await response.json() as {available:boolean;siteKey?:string};
   if(!active)return;
   setConfig(next);
   if(!next.available)await request.onAnswer(request.question,request.fallback(request.question));
   else setReview({question:request.question,context:retrievePlanningContext(buildStudentIntelligence(request.records,request.memories),request.question,request.history)});
  }).catch(()=>{if(active)void request.onAnswer(request.question,request.fallback(request.question))});
  return()=>{active=false};
 },[request]);
 async function send(token:string){if(!review||lock.current)return;lock.current=true;setPending(true);onBusy(true);setNotice('');abort.current=new AbortController();const timer=setTimeout(()=>abort.current?.abort(),32000);
  try{const context=externalPlanningContext(review.context);const response=await fetch('/api/assistant',{method:'POST',signal:abort.current.signal,headers:{'Content-Type':'application/json'},body:JSON.stringify({intent:'planning-tradeoffs',question:redact(review.question),context,consent:true,challenge:token})});if(!response.ok)throw new Error();const data=await response.json() as {answer?:unknown};const answer=validateModelAnswer(data.answer,context);await onAnswer(review.question,{mode:'model',text:[answer.answer,answer.reasoningSummary,...answer.inferences.map(t=>'Planning inference: '+t)].filter(Boolean).join('\n\n'),evidence:answer.evidenceIds.map(id=>context.facts.find(f=>f.id===id)!),actions:answer.actionIds.map(id=>review.context.actions.find(a=>a.id===id)!).map(a=>({label:a.label,destination:a.destination})),memoryCandidate:answer.memoryCandidate||undefined});setReview(null);setApproved(false);
  }catch{if(!abort.current?.signal.aborted){await onAnswer(review.question,fallback(review.question));setNotice('The additional analysis was unavailable. Your saved information was used instead.');}else setNotice('The external request stopped. You can continue without sharing.');}
  finally{clearTimeout(timer);setPending(false);onBusy(false);lock.current=false;setApproved(false);}
 }
 return <section className="external-reasoning" aria-label="Review information sharing"><h3>Review your planning context</h3><p>For this guided analysis, Pathly can send the selected information below to OpenAI. Cloudflare verifies the request. Review it for names or sensitive details before continuing. Your records will not change.</p>{!config&&!notice&&<p role="status">Checking availability…</p>}{review&&<><details><summary>Information to be shared</summary><pre className="context-preview" tabIndex={0}>{JSON.stringify({question:redact(review.question),context:externalPlanningContext(review.context)},null,2)}</pre></details><button type="button" className="primary" disabled={pending||approved||disabled} onClick={()=>setApproved(true)}>Approve and continue</button><button type="button" className="text-button" disabled={pending} onClick={()=>void onAnswer(question,fallback(question))}>Continue without sharing</button>{approved&&config?.siteKey&&<Challenge siteKey={config.siteKey} onToken={token=>void send(token)}/>}</>}{pending&&<p role="status">Preparing your plan… You can keep using Pathly.</p>}{notice&&<p role="status">{notice}</p>}</section>;
}
