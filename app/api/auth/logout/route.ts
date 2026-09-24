import {env} from 'cloudflare:workers';
import {database} from '@/db/raw';
import {authConfig,authRedirect,SESSION_COOKIE,STATE_COOKIE,cookie,readCookie,digest} from '@/app/auth-core';
export async function POST(request:Request){
 try {const cfg=authConfig(env);if(request.headers.get('origin')!==cfg.origin||new URL(request.url).origin!==cfg.origin)return new Response('Request not allowed',{status:403});const token=readCookie(request.headers.get('cookie'),SESSION_COOKIE);if(/^[a-f0-9]{64}$/.test(token))await database().prepare('DELETE FROM auth_sessions WHERE token_hash = ?').bind(await digest(token)).run();return authRedirect(cfg.origin+'/login',[cookie(SESSION_COOKIE,'',0),cookie(STATE_COOKIE,'',0)]);}catch{return Response.json({error:'Sign out could not be completed. Please try again.'},{status:503,headers:{'Cache-Control':'no-store'}});}
}

