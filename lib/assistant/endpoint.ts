import {requestSchema} from './contract';
import {modelProvider} from './provider';
export type AssistantConfig={OPENAI_API_KEY?:string;PATHLY_ASSISTANT_MODEL?:string;PATHLY_ASSISTANT_ORIGIN?:string;TURNSTILE_SECRET_KEY?:string;TURNSTILE_SITE_KEY?:string;ASSISTANT_RATE_LIMITER?:{limit:(input:{key:string})=>Promise<{success:boolean}>}};
export function configured(c:AssistantConfig){return !!(c.OPENAI_API_KEY&&c.PATHLY_ASSISTANT_MODEL&&c.PATHLY_ASSISTANT_ORIGIN&&c.TURNSTILE_SECRET_KEY&&c.TURNSTILE_SITE_KEY&&c.ASSISTANT_RATE_LIMITER)}
const json=(body:unknown,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store'}});
async function readBounded(request:Request){const reader=request.body?.getReader();if(!reader)throw new Error('Empty request');const chunks:Uint8Array[]=[];let size=0;while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>48000){await reader.cancel();throw new Error('Too large');}chunks.push(value);}const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}return JSON.parse(new TextDecoder().decode(bytes));}
export async function handleAssistant(request:Request,config:AssistantConfig,send:typeof fetch=fetch){
 if(!configured(config))return json({error:'External reasoning is not configured. Your local planning guide remains available.',code:'MODEL_NOT_CONFIGURED'},503);
 if(request.headers.get('origin')!==config.PATHLY_ASSISTANT_ORIGIN||new URL(request.url).origin!==config.PATHLY_ASSISTANT_ORIGIN)return json({error:'This request could not be verified.'},403);
 const ip=request.headers.get('cf-connecting-ip');if(!ip)return json({error:'This request requires the configured Cloudflare access boundary.'},403);
 try{
  if(!(await config.ASSISTANT_RATE_LIMITER!.limit({key:ip})).success)return json({error:'Too many requests. Use local planning or try again shortly.'},429);
  if(!(request.headers.get('content-type')||'').includes('application/json'))return json({error:'A JSON request is required.'},400);
  const parsed=requestSchema.safeParse(await readBounded(request));if(!parsed.success)return json({error:'This planning request could not be read. Review the selected context and retry.'},400);
  const {question,context,challenge}=parsed.data;
  const check=await send('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',signal:AbortSignal.timeout(8000),headers:{'Content-Type':'application/json'},body:JSON.stringify({secret:config.TURNSTILE_SECRET_KEY,response:challenge,remoteip:ip})});
  const result=await check.json() as {success?:boolean;hostname?:string;action?:string};
  if(!check.ok||!result.success||result.hostname!==new URL(config.PATHLY_ASSISTANT_ORIGIN!).hostname||result.action!=='pathly_assistant')return json({error:'Verification expired or failed. Please try again.'},403);
  const answer=await modelProvider({key:config.OPENAI_API_KEY,model:config.PATHLY_ASSISTANT_MODEL},send)!.answer(question,context);
  return json({answer});
 }catch{return json({error:'External reasoning is unavailable. Your local planning guide remains available.'},503);}
}
