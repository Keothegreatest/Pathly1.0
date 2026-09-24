import type {BrowserWorkspace} from './browser-records';
import {changeRecord} from './browser-records';
const DB_NAME='pathly-personal-workspace-v1';
function openDatabase():Promise<IDBDatabase>{return new Promise((resolve,reject)=>{const request=indexedDB.open(DB_NAME,1);request.onupgradeneeded=()=>request.result.createObjectStore('workspace');request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);request.onblocked=()=>reject(new Error('Close other Pathly tabs and try again.'));});}
async function transaction<T>(change:(state:BrowserWorkspace)=>T,write:boolean):Promise<T>{
 const db=await openDatabase();return new Promise((resolve,reject)=>{const tx=db.transaction('workspace',write?'readwrite':'readonly'),store=tx.objectStore('workspace');let value:T;const read=store.get('current');read.onsuccess=()=>{try{const state:BrowserWorkspace=read.result||{records:[],hasCompletedOnboarding:false};if(!Array.isArray(state.records))throw new Error('Saved workspace could not be read.');value=change(state);if(write)store.put(state,'current');}catch(e){tx.abort();reject(e);}};tx.oncomplete=()=>{db.close();resolve(value)};tx.onerror=()=>{db.close();reject(tx.error)};tx.onabort=()=>{db.close();reject(tx.error||new Error('Storage unavailable'))};});
}
export async function startWorkspace(name:string){const title=name.trim().replace(/\s+/g,' ');if(!title||title.length>80)throw new Error('Enter a name between 1 and 80 characters.');await transaction(state=>{if(state.records.some(r=>r.kind==='profile'))return;const now=new Date().toISOString();state.records.push({id:crypto.randomUUID(),kind:'profile',version:1,updated:now,data:{title,createdAt:now}})},true);}
export async function workspaceRequest(path:string,options:RequestInit={}):Promise<Response>{
 try{return await transaction(state=>{
  if(path==='/api/preferences'){state.hasCompletedOnboarding=true;return Response.json({hasCompletedOnboarding:true});}
  if(path!=='/api/records')return Response.json({error:'Unknown workspace operation.'},{status:404});
  if(!options.method||options.method==='GET'){const profile=state.records.find(r=>r.kind==='profile');if(!profile)return Response.json({error:'Choose your name to begin.'},{status:401});return Response.json({records:state.records,name:profile.data.fullName||profile.data.title,hasCompletedOnboarding:state.hasCompletedOnboarding});}
  const result=changeRecord(state,options.method,JSON.parse(String(options.body)));return Response.json(result,{status:result.status||200});
 },!!options.method&&options.method!=='GET');}catch{return Response.json({error:'Your browser could not save or open this workspace. Check available storage and browser privacy settings, then try again.'},{status:503});}
}
import type {AssistantMessage} from './assistant-types';
export async function loadConversation():Promise<AssistantMessage[]>{return transaction(state=>state.conversation||[],false)}
export async function saveConversation(messages:AssistantMessage[]){if(messages.length>30||messages.some(m=>!['user','assistant'].includes(m.role)||m.text.length>20000))throw new Error('Invalid conversation');await transaction(state=>{state.conversation=messages},true)}
export async function claimMilestone(id:string){return transaction(state=>{const seen=state.milestones||[];if(seen.includes(id))return false;state.milestones=[...seen,id].slice(-300);return true},true)}
