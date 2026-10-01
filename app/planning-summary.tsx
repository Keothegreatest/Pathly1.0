'use client';
import {useEffect,useSyncExternalStore} from 'react';
import type {Entry} from './model';
import {getPlanningStatus,changesSince} from './planning-status';

const subscribe=(listener:()=>void)=>{window.addEventListener('pathly-visit',listener);return()=>window.removeEventListener('pathly-visit',listener)};
function previousVisit(key:string){try{const value=sessionStorage.getItem(key);return value&&value!=='first'?value:'';}catch{return '';}}

export function PlanningSummary({records,onSetup}:{records:Entry[];onSetup:()=>void}){
 const status=getPlanningStatus(records);
 const profileId=records.find(r=>r.kind==='profile')?.id;
 const key='pathly-visit-'+profileId;
 const previous=useSyncExternalStore(subscribe,()=>previousVisit(key),()=>'');
 useEffect(()=>{
  if(!profileId)return;
  // Local timestamps only: no telemetry, no record contents, no cross-browser claims.
  try{
   const session=sessionStorage.getItem(key);
   if(session)return;
   const last=localStorage.getItem(key)||'';
   sessionStorage.setItem(key,last||'first');localStorage.setItem(key,new Date().toISOString());window.dispatchEvent(new Event('pathly-visit'));
  }catch{/* A blocked storage preference must not prevent using the workspace. */}
 },[profileId,key]);
 const changed=changesSince(records,previous);
 return <section className="planning-summary" aria-label="Your current position"><div><span className="eyebrow">YOUR CURRENT POSITION</span><h2>{status.title}</h2><p>{status.evidence} {status.timeline}</p>{previous&&changed.length>0&&<small>{changed.length} records updated since your previous visit in this browser.</small>}</div><button className="text-button" onClick={onSetup}>{status.profile.completed?'Update your Pathly plan':'Personalize my plan'}</button></section>;
}
