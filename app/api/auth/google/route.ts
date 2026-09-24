import {env} from 'cloudflare:workers';
import {database} from '@/db/raw';
import {authConfig,authRedirect,STATE_COOKIE,cookie,randomToken,digest,challenge,safeReturn} from '@/app/auth-core';
export async function GET(request:Request){
 try {
  const cfg=authConfig(env),url=new URL(request.url);
  if(url.origin!==cfg.origin)return authRedirect(cfg.origin+'/login');
  if(request.headers.get('sec-purpose')?.includes('prefetch')||request.headers.get('purpose')==='prefetch')return new Response(null,{status:204});
  const state=randomToken(),verifier=randomToken(),now=Math.floor(Date.now()/1000),db=database();
  await db.batch([db.prepare('DELETE FROM auth_transactions WHERE expires_at <= ?').bind(now),db.prepare('DELETE FROM auth_sessions WHERE expires_at <= ?').bind(now),db.prepare('INSERT INTO auth_transactions (state_hash,verifier,return_to,expires_at) VALUES (?,?,?,?)').bind(await digest(state),verifier,safeReturn(url.searchParams.get('return_to')),now+600)]);
  const target=new URL('https://accounts.google.com/o/oauth2/v2/auth');target.search=new URLSearchParams({client_id:cfg.clientId,redirect_uri:cfg.callback,response_type:'code',scope:'openid email profile',state,code_challenge:await challenge(verifier),code_challenge_method:'S256',prompt:'select_account'}).toString();
  return authRedirect(target.href,[cookie(STATE_COOKIE,state,600)]);
 }catch{return authRedirect('/login?error=configuration');}
}

