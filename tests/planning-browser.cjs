const assert=require('node:assert/strict');
const {chromium}=require(process.env.PATHLY_PLAYWRIGHT_MODULE||'playwright');
const base=process.env.PATHLY_BASE_URL||'http://localhost:5175';
(async()=>{const browser=await chromium.launch({channel:'msedge'});try{
 const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'/app');await page.getByLabel('Your name',{exact:true}).fill('Jordan');await page.getByRole('button',{name:'Continue to Pathly'}).click();
 const setup=page.locator('.assessment-dialog');await setup.waitFor();
 await setup.getByRole('button',{name:'PA',exact:true}).click();await setup.getByRole('button',{name:'Continue',exact:true}).click();
 await setup.getByRole('button',{name:'Junior',exact:true}).click();await setup.getByRole('button',{name:'Continue',exact:true}).click();
 await setup.getByRole('button',{name:String(new Date().getFullYear()+2),exact:true}).click();await setup.getByRole('button',{name:'Continue',exact:true}).click();
 await setup.getByRole('button',{name:'Clinical experience',exact:true}).click();
 await setup.getByText('Personalize further (optional)',{exact:true}).click();
 await setup.getByRole('button',{name:'Build patient-care experience',exact:true}).click();
 await setup.getByLabel('Clinical-hours target (your own, optional)').fill('100');
 await setup.getByRole('button',{name:'See my plan',exact:true}).click();
 await setup.getByRole('heading',{name:'Your starting plan.'}).waitFor();
 assert((await setup.innerText()).includes('Reach 100 clinical hours'));
 await setup.getByRole('button',{name:'Open my workspace',exact:true}).click();await setup.waitFor({state:'hidden'});
 assert(await page.locator('.planning-summary').isVisible());assert(await page.locator('.home-priorities li').count()<=3);
 await page.locator('.home-priorities').getByRole('button',{name:'Review suggested goal'}).click();
 await page.getByRole('button',{name:'Save goal',exact:true}).click();await page.locator('.editor').waitFor({state:'hidden'});
 async function nav(name){if(await page.getByRole('button',{name:'Open navigation',exact:true}).isVisible()&&!(await page.getByRole('navigation',{name:'Workspace',exact:true}).isVisible()))await page.getByRole('button',{name:'Open navigation',exact:true}).click();await page.getByRole('navigation',{name:'Workspace',exact:true}).getByRole('button',{name,exact:true}).click();if(page.viewportSize().width<768)await page.getByRole('navigation',{name:'Workspace',exact:true}).waitFor({state:'hidden'});}
 await nav('Experiences');await page.getByRole('button',{name:'Add experience',exact:true}).first().click();
 await page.getByLabel('Experience name').fill('Community clinic');await page.getByRole('combobox',{name:'Category',exact:true}).click();await page.getByRole('option',{name:'Clinical Experience',exact:true}).click();await page.getByLabel('Total documented hours').fill('12');await page.getByRole('button',{name:'Save experience',exact:true}).click();await page.locator('.editor').waitFor({state:'hidden'});
 await page.setViewportSize({width:375,height:812});
 await page.getByRole('button',{name:'Log hours',exact:true}).click();await page.getByLabel('Hours to add').fill('8');await page.getByRole('button',{name:'Save hours',exact:true}).click();await page.getByRole('heading',{name:'Log hours',exact:true}).waitFor({state:'hidden'});
 await page.getByText('Saving changes…',{exact:true}).waitFor({state:'hidden'});assert((await page.locator('.record-card').innerText()).includes('20 hours'));
 await page.getByRole('button',{name:'Add reflection',exact:true}).click();await page.getByLabel('Reflection title').fill('Listening first');await page.getByLabel('Your reflection',{exact:true}).fill('I asked what would help before offering directions. Listening changed my approach.');await page.getByRole('combobox',{name:'Writing status',exact:true}).click();await page.getByRole('option',{name:'Complete',exact:true}).click();await page.getByRole('button',{name:'Save reflection',exact:true}).click();await page.locator('.editor').waitFor({state:'hidden'});
 await nav('Home');assert(!(await page.locator('.home-priorities').innerText()).includes('Add a reflection for Community clinic'));assert((await page.locator('.target-panel').innerText()).includes('20 / 100'));
 await nav('Schools');await page.getByRole('button',{name:'Add school',exact:true}).first().click();await page.getByLabel('School / program name').fill('My saved PA program');await page.getByRole('button',{name:'Save school',exact:true}).click();await page.locator('.editor').waitFor({state:'hidden'});await page.getByRole('heading',{name:'My saved PA program'}).waitFor();
 await page.getByRole('button',{name:'Add requirement',exact:true}).click();await page.getByLabel('Requirement or recommendation').fill('Biology');await page.getByRole('combobox',{name:'Classification',exact:true}).click();await page.getByRole('option',{name:'Hard requirement',exact:true}).click();await page.getByRole('combobox',{name:'Your preparation',exact:true}).click();await page.getByRole('option',{name:'Not reviewed',exact:true}).click();await page.getByRole('button',{name:'Save requirement',exact:true}).click();await page.locator('.editor').waitFor({state:'hidden'});
 await page.getByRole('tab',{name:'Compare programs',exact:true}).click();await page.locator('.comparison-mobile').waitFor();assert((await page.locator('.comparison-mobile').innerText()).includes('1 not reviewed'));await page.locator('.comparison-mobile summary').click();assert((await page.locator('.comparison-mobile').innerText()).includes('other program details are not documented'));assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await page.screenshot({path:'work/planning-schools-mobile.png',fullPage:true});
 for(const [width,height] of [[1440,900],[1366,768],[768,1024],[430,932],[375,812]]){
  await page.setViewportSize({width,height});await nav('Home');assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:`work/planning-home-${width}.png`,fullPage:true});
  for(const name of ['Experiences','Goals','Application','Schools']){await nav(name);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),name+' overflow '+width);}
 }
 await page.reload();await page.getByRole('heading',{name:'My saved PA program'}).waitFor();assert.equal(await setup.count(),0);
 await page.setViewportSize({width:1440,height:900});await nav('Goals');assert((await page.locator('.record-card').innerText()).includes('20 / 100'));
 await page.getByRole('button',{name:'Edit Reach 100 clinical hours',exact:true}).click();await page.getByLabel('Goal title').fill('My clinical hours plan');await page.getByRole('button',{name:'Save goal',exact:true}).click();await page.locator('.editor').waitFor({state:'hidden'});await page.getByText('Saving changes…',{exact:true}).waitFor({state:'hidden'});await page.getByRole('button',{name:'Edit My clinical hours plan',exact:true}).click();await page.getByRole('button',{name:'Delete entry',exact:true}).click();await page.getByRole('button',{name:'Delete permanently',exact:true}).click();await page.getByRole('heading',{name:'My clinical hours plan',exact:true}).waitFor({state:'hidden'});
 assert.deepEqual(errors,[]);console.log('PASS four-question onboarding, personalized result, recommendation-to-goal, mobile hours/reflection/school capture, live Home and goal updates, mobile school comparison, five routes at five sizes, refresh restores records without repeating setup');
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});

