const fs=require('fs'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PATHLY_PLAYWRIGHT_MODULE||'playwright');
const base=process.env.PATHLY_BASE_URL||'http://localhost:5174';
(async()=>{
 fs.mkdirSync('work',{recursive:true});
 const b=await chromium.launch({channel:process.env.PATHLY_BROWSER_CHANNEL||'msedge',headless:true});
 const p=await b.newPage({viewport:{width:1440,height:900}}),errors=[];
 p.on('pageerror',e=>errors.push(e.message));
 await p.addInitScript(()=>{window.__reads=0;const open=indexedDB.open.bind(indexedDB);indexedDB.open=(...a)=>{window.__reads++;return open(...a)}});
 await p.goto(base+'/app');
 await p.getByLabel('Your name',{exact:true}).fill('Private Sentinel');
 await p.getByRole('button',{name:'Continue to Pathly'}).click();
 await p.getByRole('button',{name:'Finish later',exact:true}).click();
 await p.goto(base);
 await p.locator('.marketing[data-ready=true]').waitFor();
 assert(!(await p.locator('main').innerText()).includes('Private Sentinel'));
 assert.equal(await p.evaluate(()=>window.__reads),0);
 assert.equal(await p.getByRole('link',{name:'Sign in',exact:true}).count(),0);
 assert(!(await p.locator('footer.marketing-footer').innerText()).includes('Planning support. Always your decisions.'));
 assert(await p.locator('#for-students').evaluate(e=>e.nextElementSibling?.id==='how-it-works'));
 await p.getByRole('link',{name:'Explore an example workspace',exact:true}).click();
 await p.getByRole('region',{name:'Example Experiences',exact:true}).waitFor();
 await p.locator('#software > summary').click();
 await p.evaluate(()=>scrollTo(0,0));
 await p.screenshot({path:'work/editorial-hero.png'});
 for(const selector of ['.recognition','.clarity-benefits','.connected-journey','.chapter-wide','.chapter-reverse','.next-chapter','.workspace-comparison','.editorial-final']){
  await p.locator(selector).scrollIntoViewIfNeeded();await p.waitForTimeout(650);
  await p.locator(selector).screenshot({path:'work/editorial-'+selector.slice(1)+'.png'});
 }
 await p.getByText('Try an Ask Pathly example',{exact:true}).click();
 const demo=p.getByTestId('ask-pathly-demo');
 for(const [q,h] of [['What should I focus on next?','Make room for the work that connects the pieces.'],['How are my experiences developing?','A foundation with different kinds of perspective.'],['What should I work on this semester?','A focused semester, not a longer checklist.'],['Which experiences support my story?','Look for the moments that changed your perspective.'],['Give me a progress update','Your journey is taking shape.']]){
  await p.getByRole('button',{name:q,exact:true}).click();await demo.getByRole('heading',{name:h,exact:true}).waitFor();
 }
 await demo.getByRole('link',{name:'Explore the example journey'}).click();
 await p.getByRole('region',{name:'Example Journey',exact:true}).waitFor();
 for(const v of ['Experiences','Schools','Application','Goals','Journey','Ask Pathly']){
  await p.getByRole('navigation',{name:'Explore the example workspace'}).getByRole('button',{name:new RegExp(v)}).click();
  await p.getByRole('region',{name:'Example '+v,exact:true}).waitFor();
 }
 for(const [width,height] of [[1920,1080],[1366,768],[768,1024],[430,932],[375,812]]){
  await p.setViewportSize({width,height});await p.goto(base);await p.locator('.marketing[data-ready=true]').waitFor();
  assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'overflow '+width);
  const h=await p.locator('h1').boundingBox();assert(h.x>=0&&h.x+h.width<=width,'heading '+width);
  for(const img of await p.locator('.product-capture img').all()){await img.scrollIntoViewIfNeeded();await img.evaluate(el=>el.decode());assert(await img.evaluate(el=>el.naturalWidth>0));}
  await p.evaluate(()=>scrollTo(0,0));await p.waitForTimeout(650);await p.screenshot({path:'work/editorial-'+width+'.png'});
  if(width===375){
   await p.getByRole('button',{name:'Open navigation',exact:true}).click();
   await p.getByRole('navigation',{name:'Mobile website navigation'}).getByRole('link',{name:'For students'}).click();
   await p.getByText('Try an Ask Pathly example',{exact:true}).click();
   await p.getByRole('button',{name:'What should I focus on next?',exact:true}).click();
   await demo.getByRole('heading',{name:'Make room for the work that connects the pieces.'}).waitFor();
   assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  }
 }
 await p.emulateMedia({reducedMotion:'reduce'});
 assert.equal(await p.locator('.editorial-reveal').first().evaluate(e=>getComputedStyle(e).animationName),'none');
 const links=await p.locator('a[href^="/#"],a[href^="#"]').evaluateAll(els=>els.map(e=>e.getAttribute('href')).filter(h=>h!=='#'));
 for(const link of links)assert(await p.locator(link.replace('/#','#')).count(),link);
 assert.equal(await p.evaluate(()=>window.__reads),0);
 for(const route of ['/login','/signup']){await p.goto(base+route);await p.waitForURL('**/app');await p.getByRole('button',{name:'Open Ask Pathly',exact:true}).waitFor();}
 assert.deepEqual(errors,[]);await b.close();
 console.log('PASS six responsive sizes, screenshots, intact entry routes, zero public personal-data reads, five Ask demos, six product views, mobile navigation, anchors and reduced motion');
})().catch(e=>{console.error(e);process.exit(1)});
