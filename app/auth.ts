import {headers} from 'next/headers';
import {database} from '@/db/raw';
import {SESSION_COOKIE,readCookie,digest} from './auth-core';
export type PathlyUser={userId:string;email:string;fullName:string|null;displayName:string};
export async function getUser():Promise<PathlyUser|null>{
 const token=readCookie((await headers()).get('cookie'),SESSION_COOKIE);
 if(!/^[a-f0-9]{64}$/.test(token))return null;
 try {const row=await database().prepare('SELECT user_id,email,full_name FROM auth_sessions WHERE token_hash = ? AND expires_at > ?').bind(await digest(token),Math.floor(Date.now()/1000)).first<{user_id:string;email:string;full_name:string|null}>();return row?{userId:row.user_id,email:row.email,fullName:row.full_name,displayName:row.full_name||row.email}:null;}catch{return null;}
}

