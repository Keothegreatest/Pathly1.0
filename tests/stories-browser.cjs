const assert=require('node:assert/strict');
const {chromium}=require(process.env.PATHLY_PLAYWRIGHT_MODULE||'playwright');
const base=process.env.PATHLY_BASE_URL||'http://localhost:5174';
(async()=>{
 const b=await chromium.launch({channel:'msedge',headless:true});
 try{
 const p=await b.newPage({viewport:{width:1440,height:900}}),errors=[];
 p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error'&&!m.text().includes('404'))errors.push(m.text())});
 await p.addInitScript(()=>{window.__reads=0;const original=indexedDB.open.bind(indexedDB);indexedDB.open=(...args)=>{window.__reads++;return original(...args)}});
 await p.goto(base+'/stories?program=pa&applicant=nontraditional');
 await p.getByRole('heading',{name:'Priya S.',exact:true}).waitFor();
 assert.equal(await p.locator('.student-story').count(),1);
 await p.reload();await p.getByRole('heading',{name:'Priya S.',exact:true}).waitFor();
 await p.getByRole('button',{name:'Clear filters',exact:true}).click();
 await p.waitForFunction(()=>document.querySelectorAll('.student-story').length===10);
 await p.getByRole('button',{name:'MD/DO',exact:true}).click();await p.getByRole('heading',{name:'Jordan T.',exact:true}).waitFor();await p.getByRole('heading',{name:'Maya R.',exact:true}).waitFor();
 await p.waitForURL('**/stories?program=md-do');await p.goBack();await p.waitForFunction(()=>document.querySelectorAll('.student-story').length===10);
 await p.waitForURL('**/stories');await p.goForward();await p.getByRole('heading',{name:'Jordan T.',exact:true}).waitFor();await p.getByRole('heading',{name:'Maya R.',exact:true}).waitFor();
 await p.getByLabel('Applicant type',{exact:true}).selectOption('career-changer');
 await p.getByRole('heading',{name:'No stories match those filters yet.'}).waitFor();
 await p.locator('.stories-empty').getByRole('button',{name:'Clear filters'}).click();
 await p.waitForFunction(()=>document.querySelectorAll('.student-story').length===10);
 await p.getByText('More filters',{exact:true}).click();
 await p.getByLabel('Research-focused',{exact:true}).check();await p.getByLabel('Applicant type',{exact:true}).selectOption('first-generation');
 await p.waitForFunction(()=>document.querySelectorAll('.student-story').length===1);
 assert((await p.locator('.student-story').innerText()).includes('Maya'));
 await p.getByRole('link',{name:'Read Maya’s path'}).click();await p.waitForURL('**/stories/maya-r?*');
 await p.getByRole('heading',{name:'More activities wasn’t the missing piece.'}).waitFor();
 await p.getByText('See how their path changed',{exact:true}).click();
 assert(await p.getByRole('heading',{name:'With Pathly',exact:true}).isVisible());
 await p.getByRole('link',{name:'Back to stories'}).click();
 await p.waitForFunction(()=>document.querySelectorAll('.student-story').length===1);
 assert(p.url().includes('profile=research-focused'));
 await p.goto(base+'/');
 const preview=p.locator('#student-stories');await preview.getByRole('button',{name:'PA',exact:true}).click();
 await preview.getByRole('heading',{name:'Priya S.',exact:true}).waitFor();
 assert.equal(await preview.locator('.student-story').count(),1);
 await preview.getByRole('link',{name:'Explore all student stories'}).click();await p.waitForURL('**/stories?program=pa');
 await p.getByRole('heading',{name:'Priya S.',exact:true}).waitFor();assert(p.url().includes('program=pa'));
 for(const [width,height] of [[1440,900],[1280,800],[1024,768],[768,1024],[390,844],[375,812]]){
  await p.setViewportSize({width,height});await p.goto(base+'/stories');
  await p.getByRole('heading',{name:'Maya R.',exact:true}).waitFor();
  assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'overflow at '+width);
  for(const image of await p.locator('.story-visual').all()){await image.scrollIntoViewIfNeeded();await image.evaluate(el=>el.decode());assert(await image.evaluate(el=>el.naturalWidth>0))}
  if(width===1440||width===375)await p.screenshot({path:`work/stories-${width}.png`,fullPage:true});
  if(width===375){await p.getByRole('button',{name:'Open navigation'}).click();await p.getByRole('navigation',{name:'Mobile website navigation'}).getByRole('link',{name:'Student Stories'}).waitFor();await p.keyboard.press('Escape')}
 }
 for(const id of ['maya-r','daniel-k','priya-s','ethan-m','jordan-t','alex-c','samira-l','elena-v','grace-w','luis-a']){
  await p.goto(base+'/stories');const link=p.locator('.student-story > a[href="/stories/'+id+'"]');await link.click();await p.waitForURL('**/stories/'+id);await p.locator('.story-outcome').waitFor();await p.reload();await p.locator('.story-outcome').waitFor();await p.goBack();await p.waitForURL('**/stories');await p.goto(base+'/stories/'+id);await p.locator('.story-outcome').waitFor();
  assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  assert((await p.locator('.story-disclosure').innerText()).includes('not customer testimonials'));
 }
 for(const program of ['pa','pt','ot','nursing','dental']){await p.goto(base+'/stories?program='+program);await p.locator('.student-story').first().waitFor();assert(await p.locator('.student-story').count()>0)}
 assert.equal(await p.getByRole('button',{name:'Pre-Nursing',exact:true}).count(),0);
 await p.goto(base+'/stories/noah-b');await p.getByRole('heading',{name:'We couldn’t find that student story.'}).waitFor();
 await p.goto(base+'/stories/not-a-student');await p.getByRole('heading',{name:'We couldn’t find that student story.'}).waitFor();
 await p.goto(base+'/stories?program=invalid&profile=invalid');await p.getByRole('heading',{name:'Maya R.',exact:true}).waitFor();assert.equal(await p.locator('.student-story').count(),10);
 await p.emulateMedia({reducedMotion:'reduce'});assert.equal(await p.locator('.story-grid').evaluate(e=>getComputedStyle(e).animationName),'none');
 await p.getByRole('button',{name:'Dental',exact:true}).focus();await p.keyboard.press('Enter');await p.getByRole('heading',{name:'Ethan M.',exact:true}).waitFor();
 assert.equal(await p.evaluate(()=>window.__reads),0);assert.deepEqual(errors,[]);
 console.log('PASS homepage → filters → shareable URL → detail → retained filters; back/forward, refresh, empty/invalid routes, ten stories, keyboard, reduced motion, six viewport widths, no private storage access or browser errors');
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)});


