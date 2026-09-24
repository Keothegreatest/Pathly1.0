import {env} from 'cloudflare:workers';
import {database} from '@/db/raw';
import {authConfig,authRedirect,STATE_COOKIE,SESSION_COOKIE,SESSION_SECONDS,cookie,readCookie,randomToken,digest,safeReturn} from '@/app/auth-core';
export async function GET(request:Request){
 const clear=cookie(STATE_COOKIE,'',0);const fail=(code:string)=>authRedirect('/login?error='+code,[clear]);
 try{
  const cfg=authConfig(env),url=new URL(request.url),state=url.searchParams.get('state'),browserState=readCookie(request.headers.get('cookie'),STATE_COOKIE);
  if(url.origin!==cfg.origin||!state||!/^[a-f0-9]{64}$/.test(state)||state!==browserState)return fail('expired');
  const db=database(),now=Math.floor(Date.now()/1000);
  const transaction=await db.prepare('DELETE FROM auth_transactions WHERE state_hash = ? AND expires_at > ? RETURNING verifier,return_to').bind(await digest(state),now).first<{verifier:string;return_to:string}>();
  if(!transaction)return fail('expired');
  if(url.searchParams.has('error'))return fail(url.searchParams.get('error')==='access_denied'?'cancelled':'failed');
  const code=url.searchParams.get('code');if(!code||code.length>4096)return fail('failed');
  const tokenResponse=await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({code,client_id:cfg.clientId,client_secret:cfg.secret,redirect_uri:cfg.callback,grant_type:'authorization_code',code_verifier:transaction.verifier}),signal:AbortSignal.timeout(10000)});
  if(!tokenResponse.ok)return fail('failed');
  const token=await tokenResponse.json() as {access_token?:string;token_type?:string};if(!token.access_token||token.token_type?.toLowerCase()!=='bearer')return fail('failed');
  // Obtain identity only from Google's authenticated UserInfo endpoint, never unverified JWT claims or request headers.
  const infoResponse=await fetch('https://openidconnect.googleapis.com/v1/userinfo',{headers:{Authorization:`Bearer ${token.access_token}`},signal:AbortSignal.timeout(10000)});
  if(!infoResponse.ok)return fail('failed');
  const info=await infoResponse.json() as {sub?:unknown;email?:unknown;email_verified?:unknown;name?:unknown};
  if(typeof info.sub!=='string'||!info.sub||info.sub.length>255||typeof info.email!=='string'||info.email.length>320||info.email_verified!==true)return fail('failed');
  const session=randomToken(),previous=readCookie(request.headers.get('cookie'),SESSION_COOKIE),commands=[db.prepare('INSERT INTO auth_sessions (token_hash,user_id,email,full_name,expires_at) VALUES (?,?,?,?,?)').bind(await digest(session),'google:'+info.sub,info.email,typeof info.name==='string'?info.name.slice(0,150):null,now+SESSION_SECONDS)];
  if(/^[a-f0-9]{64}$/.test(previous))commands.push(db.prepare('DELETE FROM auth_sessions WHERE token_hash = ?').bind(await digest(previous)));
  await db.batch(commands);
  return authRedirect(cfg.origin+safeReturn(transaction.return_to),[clear,cookie(SESSION_COOKIE,session,SESSION_SECONDS)]);
 }catch{return fail('failed');}
}

