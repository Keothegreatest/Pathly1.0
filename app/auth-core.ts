export const SESSION_COOKIE = '__Host-pathly_session';
export const STATE_COOKIE = '__Host-pathly_oauth';
export const SESSION_SECONDS = 60 * 60 * 24 * 7;
export function randomToken() { return Array.from(crypto.getRandomValues(new Uint8Array(32)), b => b.toString(16).padStart(2, '0')).join(''); }
export async function digest(value: string) { return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))), b => b.toString(16).padStart(2, '0')).join(''); }
export async function challenge(value: string) { const bytes = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))); return btoa(String.fromCharCode(...bytes)).replaceAll('+','-').replaceAll('/','_').replaceAll('=',''); }
export function readCookie(header: string | null, name: string) { const values = (header || '').split(';').map(x => x.trim()).filter(x => x.startsWith(name + '=')); return values.length === 1 ? values[0].slice(name.length + 1) : ''; }
export function cookie(name: string, value: string, age: number) { return `${name}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${age}`; }
export function safeReturn(value: string | null) { if (!value?.startsWith('/') || value.startsWith('//') || value.includes('\\')) return '/'; try {const url=new URL(value,'https://pathly.invalid');return url.origin==='https://pathly.invalid'&&!url.pathname.startsWith('/api/auth')&&url.pathname!=='/login'?url.pathname+url.search+url.hash:'/';}catch{return '/';} }
export type AuthConfig = {APP_URL?:string;GOOGLE_CLIENT_ID?:string;GOOGLE_CLIENT_SECRET?:string};
export function authConfig(env: AuthConfig) { const url=new URL(env.APP_URL || 'invalid:'); if(url.protocol!=='https:'||url.username||url.password||url.pathname!=='/'||url.search||url.hash||!env.GOOGLE_CLIENT_ID||!env.GOOGLE_CLIENT_SECRET)throw new Error('Authentication not configured');return {origin:url.origin,clientId:env.GOOGLE_CLIENT_ID,secret:env.GOOGLE_CLIENT_SECRET,callback:url.origin+'/api/auth/callback/google'}; }
export function authRedirect(location: string, cookies: string[] = []) { const headers=new Headers({'Location':location,'Cache-Control':'no-store','Referrer-Policy':'no-referrer'});for(const c of cookies)headers.append('Set-Cookie',c);return new Response(null,{status:303,headers}); }

