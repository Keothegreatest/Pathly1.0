const fs=require('fs'),vm=require('vm'),ts=require('typescript'),assert=require('node:assert/strict'),{DatabaseSync}=require('node:sqlite');
const db=new DatabaseSync(':memory:');db.exec(fs.readFileSync('drizzle/0001_google_auth.sql','utf8'));db.exec(fs.readFileSync('drizzle/0001_google_auth.sql','utf8'));
const adapter={prepare(sql){let args=[];const q={bind(...v){args=v;return q},async run(){return db.prepare(sql).run(...args)},async first(){return db.prepare(sql).get(...args)||null}};return q},async batch(q){return Promise.all(q.map(x=>x.run()))}};
const env={APP_URL:'https://pathly.test',GOOGLE_CLIENT_ID:'test-client',GOOGLE_CLIENT_SECRET:'test-only-secret'};let requestCookie='',fetches=0,subject='student-a',failFetch=false;
function load(path){const mod={exports:{}};vm.runInNewContext(ts.transpileModule(fs.readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{exports:mod.exports,require:n=>n==='cloudflare:workers'?{env}:n==='next/headers'?{headers:async()=>new Headers({cookie:requestCookie})}:n.includes('auth-core')?core:{database:()=>adapter},crypto,TextEncoder,Uint8Array,btoa,URL,URLSearchParams,Response,Headers,Request,AbortSignal,Date,console,fetch:async(url,options)=>{fetches++;if(failFetch)throw Error('network');if(url.includes('/token')){assert(new URLSearchParams(options.body).get('code_verifier'));return Response.json({access_token:'mock-provider-token',token_type:'Bearer'})}assert.equal(options.headers.Authorization,'Bearer mock-provider-token');return Response.json({sub:subject,email:'student@example.test',email_verified:true,name:'Student'})}});return mod.exports}
const core=load('app/auth-core.ts'),start=load('app/api/auth/google/route.ts'),callback=load('app/api/auth/callback/google/route.ts'),logout=load('app/api/auth/logout/route.ts'),auth=load('app/auth.ts');
const cookies=r=>r.headers.getSetCookie().map(x=>x.split(';')[0]).join('; ');
async function begin(){const r=await start.GET(new Request(env.APP_URL+'/api/auth/google?return_to=%2F%3Fview%3DGoals'));assert.equal(r.status,303);const u=new URL(r.headers.get('location'));assert.equal(u.origin,'https://accounts.google.com');assert.equal(u.searchParams.get('code_challenge_method'),'S256');assert.equal(u.searchParams.get('redirect_uri'),env.APP_URL+'/api/auth/callback/google');return {state:u.searchParams.get('state'),cookie:cookies(r)}}
function cb(x,query='code=test'){return callback.GET(new Request(env.APP_URL+'/api/auth/callback/google?state='+x.state+'&'+query,{headers:{cookie:x.cookie}}))}
(async()=>{
assert.equal(core.safeReturn('//evil.test'),'/');assert.equal(core.safeReturn('/\\evil.test'),'/');assert.equal(core.safeReturn('/?view=Goals'),'/?view=Goals');assert.equal(core.readCookie('a=1; a=2','a'),'');assert.throws(()=>core.authConfig({...env,APP_URL:'http://pathly.test'}));
let x=await begin();const bad=await cb({...x,cookie:''});assert(bad.headers.get('location').includes('expired'));assert.equal(fetches,0);
let r=await cb(x);assert.equal(r.headers.get('location'),'https://pathly.test/?view=Goals');assert(r.headers.get('set-cookie').includes('HttpOnly'));assert(r.headers.get('set-cookie').includes('Secure'));requestCookie=cookies(r);assert.equal((await auth.getUser()).userId,'google:student-a');const firstCookie=requestCookie;
assert((await cb(x)).headers.get('location').includes('expired'));assert.equal(fetches,2);
assert.equal((await logout.POST(new Request(env.APP_URL+'/api/auth/logout',{method:'POST',headers:{origin:'https://evil.test',cookie:requestCookie}}))).status,403);assert(await auth.getUser());
await logout.POST(new Request(env.APP_URL+'/api/auth/logout',{method:'POST',headers:{origin:env.APP_URL,cookie:requestCookie}}));assert.equal(await auth.getUser(),null);
x=await begin();assert((await cb(x,'error=access_denied')).headers.get('location').includes('cancelled'));assert((await cb(x)).headers.get('location').includes('expired'));
x=await begin();db.exec('UPDATE auth_transactions SET expires_at=0');assert((await cb(x)).headers.get('location').includes('expired'));
subject='student-b';x=await begin();r=await cb(x);requestCookie=cookies(r);assert.equal((await auth.getUser()).userId,'google:student-b');requestCookie=firstCookie;assert.equal(await auth.getUser(),null);
requestCookie=cookies(r);db.exec('UPDATE auth_sessions SET expires_at=0');assert.equal(await auth.getUser(),null);
x=await begin();failFetch=true;assert((await cb(x)).headers.get('location').includes('failed'));failFetch=false;
env.GOOGLE_CLIENT_SECRET='';assert((await start.GET(new Request(env.APP_URL+'/api/auth/google'))).headers.get('location').includes('configuration'));
requestCookie='';assert.equal(await auth.getUser(),null);console.log('PASS Google OAuth PKCE, browser state, replay/expiry, cancellation, provider failure, session persistence, account separation, revocation, CSRF, missing config, idempotent migration');
})().catch(e=>{console.error(e);process.exit(1)});

