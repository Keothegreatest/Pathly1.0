const fs=require('fs'),ts=require('typescript'),assert=require('node:assert/strict');
require.extensions['.ts']=(m,p)=>m._compile(ts.transpileModule(fs.readFileSync(p,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,p);
const {examples}=require('../app/model.ts');
const {chromium}=require(process.env.PATHLY_PLAYWRIGHT_MODULE||'playwright');
const base=process.env.PATHLY_BASE_URL||'http://localhost:5175';
(async()=>{const b=await chromium.launch({channel:'msedge'});try{
 const p=await b.newPage({viewport:{width:1440,height:900}}),errors=[];
 p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
 await p.goto(base+'/stories');
 const records=examples.filter(r=>r.kind!=='profile').map(r=>({...r,version:1,updated:new Date().toISOString()}));
 records.unshift({id:'qa-profile',kind:'profile',version:1,updated:new Date().toISOString(),data:{title:'QA Student',setupDeferred:'true'}});
 records.find(r=>r.id==='e2').data.title='Undergraduate Research Assistant — Longitudinal Cellular Biology and Patient-Centered Translational Research';
 await p.evaluate(records=>new Promise((resolve,reject)=>{const request=indexedDB.open('pathly-personal-workspace-v1',1);request.onupgradeneeded=()=>request.result.createObjectStore('workspace');request.onerror=()=>reject(request.error);request.onsuccess=()=>{const db=request.result,tx=db.transaction('workspace','readwrite');tx.objectStore('workspace').put({records,hasCompletedOnboarding:true},'current');tx.oncomplete=()=>{db.close();resolve()}}}),records);
 await p.goto(base+'/app');await p.locator('.home-priorities li').first().waitFor();
 for(const [width,height] of [[1440,900],[1024,768],[768,1024],[390,844]]){
  await p.setViewportSize({width,height});
  assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'page overflow '+width);
  const layout=await p.locator('.home-grid').evaluate(e=>getComputedStyle(e).gridTemplateColumns.split(' ').length);
  assert.equal(layout,width>=1200?2:1);
  for(const row of await p.locator('.home-priorities li').all()){
   const title=await row.locator('h3').boundingBox(),controls=await row.locator('.home-action-controls').boundingBox();
   assert(controls.y>=title.y+title.height,'action controls collide with title');
   assert(await row.evaluate(e=>e.scrollWidth<=e.clientWidth+1),'action overflow');
  }
  await p.screenshot({path:`work/qa-home-${width}.png`,fullPage:true});
 }
 await p.setViewportSize({width:1440,height:900});
 await p.getByRole('button',{name:'Personalize my plan',exact:true}).click();
 await p.getByRole('button',{name:'Pre-Nursing',exact:true}).click();
 await p.getByRole('button',{name:'Finish later',exact:true}).click();await p.getByRole('dialog').waitFor({state:'hidden'});
 await p.reload();await p.getByRole('button',{name:'Personalize my plan',exact:true}).click();
 assert.equal(await p.getByRole('button',{name:'Pre-Nursing',exact:true}).getAttribute('aria-pressed'),'true');
 await p.getByRole('button',{name:'Finish later',exact:true}).click();await p.getByRole('dialog').waitFor({state:'hidden'});
 for(const label of ['Add reflection','Review school','Update goal']){
  await p.goto(base+'/app');await p.locator('.home-quick').getByRole('button',{name:label,exact:true}).click();await p.getByRole('dialog').waitFor();
  await p.keyboard.press('Escape');await p.getByRole('dialog').waitFor({state:'hidden'});
 }
 await p.goto(base+'/app');await p.locator('.home-readiness-grid button').first().click();await p.getByRole('dialog').waitFor();await p.keyboard.press('Escape');
 await p.locator('.home-priorities .why-action').first().click();await p.locator('.copilot-panel').waitFor();await p.keyboard.press('Escape');await p.locator('.copilot-panel').waitFor({state:'hidden'});
 await p.locator('.home-action-controls>.primary').first().click();await p.getByRole('dialog').waitFor();await p.keyboard.press('Escape');
 await p.goto(base+'/');await p.locator('.marketing[data-ready=true]').waitFor();
 assert.equal(await p.locator('.what-columns article').count(),3);
 assert(!(await p.locator('#for-students').innerText()).includes('Illustrative workflow'));
 for(const [width,height] of [[1440,900],[1024,768],[768,1024],[390,844]]){
  await p.setViewportSize({width,height});await p.locator('#for-students').scrollIntoViewIfNeeded();
  assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  await p.locator('#for-students').screenshot({path:`work/qa-workflow-${width}.png`});
 }
 assert.deepEqual(errors,[]);console.log('PASS populated dashboard layout/long titles at four widths, planning CTA and Pre-Nursing persistence, all quick actions, readiness, recommendation action and explanation, three-part responsive workflow, no console errors');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exit(1)});

