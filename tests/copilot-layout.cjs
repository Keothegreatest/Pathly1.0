const {chromium}=require(process.env.PATHLY_PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
(async()=>{
 const b=await chromium.launch({channel:'msedge',headless:true}),p=await b.newPage(),errors=[];
 p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://localhost:5174/app');
 await p.getByLabel('Your name',{exact:true}).fill('Drawer Check');
 await p.getByRole('button',{name:'Continue to Pathly'}).click();
 await p.getByRole('button',{name:'Finish later',exact:true}).click();
 for(const [width,height] of [[1920,1080],[1440,900],[1366,768],[768,1024],[430,932],[375,667]]){
  await p.setViewportSize({width,height});
  const before=await p.locator('.main').boundingBox();
  await p.getByRole('button',{name:'Open Ask Pathly',exact:true}).click();
  await p.waitForTimeout(400);
  const panel=p.locator('.copilot-panel'),box=await panel.boundingBox();
  assert(box.x>=0&&box.y>=0&&box.x+box.width<=width+1&&box.y+box.height<=height+1,JSON.stringify({width,box}));
  for(const selector of ['.copilot-header','.copilot-footer']){
   const r=await p.locator(selector).boundingBox();assert(r.y>=box.y&&r.y+r.height<=box.y+box.height+1,selector);
  }
  assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  assert.equal(await panel.evaluate(e=>e.scrollHeight<=e.clientHeight),true);
  if(width>640)assert.deepEqual(await p.locator('.main').boundingBox(),before);
  const input=p.getByLabel('Ask Pathly a question',{exact:true});
  await input.fill('What should I focus on next?');await input.press('Enter');
  await p.waitForFunction(()=>document.querySelectorAll('.copilot-message.assistant').length>0);
  await p.screenshot({path:'work/drawer-'+width+'.png'});
  await p.getByRole('button',{name:'Minimize Ask Pathly'}).click();
 }
 await p.setViewportSize({width:1366,height:768});
 await p.getByRole('button',{name:'Open Ask Pathly',exact:true}).click();
 await p.waitForTimeout(400);
 const scroll=p.locator('.copilot-scroll'),header=await p.locator('.copilot-header').boundingBox(),footer=await p.locator('.copilot-footer').boundingBox();
 assert(await scroll.evaluate(e=>e.scrollHeight>e.clientHeight));
 await scroll.evaluate(e=>e.scrollTop=0);
 assert.deepEqual(await p.locator('.copilot-header').boundingBox(),header);assert.deepEqual(await p.locator('.copilot-footer').boundingBox(),footer);
 await p.getByLabel('Ask Pathly a question',{exact:true}).fill('Long draft\n'.repeat(30));
 assert((await p.getByLabel('Ask Pathly a question',{exact:true}).boundingBox()).height<=96);
 await p.getByRole('button',{name:'Conversation options'}).click();
 await p.getByRole('menuitem',{name:'Clear conversation',exact:true}).click();
 await p.getByRole('button',{name:'Clear conversation',exact:true}).click();
 await p.getByRole('heading',{name:'What can we figure out together?'}).waitFor();
 await p.getByRole('button',{name:'Clear conversation',exact:true}).waitFor({state:'hidden'});await p.waitForTimeout(350);await p.keyboard.press('Escape');
 await p.getByRole('button',{name:'Open Ask Pathly',exact:true}).waitFor();
 await p.reload();
 await p.getByRole('button',{name:'Open Ask Pathly',exact:true}).click();
 await p.getByRole('heading',{name:'What can we figure out together?'}).waitFor();
 await p.emulateMedia({reducedMotion:'reduce'});
 assert.equal(await p.locator('.copilot-panel').evaluate(e=>getComputedStyle(e).animationName),'none');
 assert.deepEqual(errors,[]);await b.close();
 console.log('PASS six viewport bounds, fixed header/footer, history-only scrolling, stable desktop dashboard, bounded composer, send/minimize/clear/persistence/Escape and reduced motion');
})().catch(e=>{console.error(e);process.exit(1)});
