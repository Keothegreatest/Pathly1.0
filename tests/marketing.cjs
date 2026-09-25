const fs=require('fs'),path=require('path'),ts=require('typescript'),assert=require('node:assert/strict');
require.extensions['.ts']=(m,p)=>m._compile(ts.transpileModule(fs.readFileSync(p,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,p);
const {demoAnswers,demoFacts,productViews,demoExperiences}=require('../app/marketing/demo-data.ts');
assert.equal(demoAnswers[0].question,'Give me a progress update');assert.equal(demoAnswers.length,5);
assert.equal(new Set(demoAnswers.map(a=>a.heading)).size,5);assert.equal(new Set(demoAnswers.map(a=>a.context.join(','))).size,5);
for(const a of demoAnswers){assert(a.priorities.length>=1&&a.priorities.length<=3);assert(productViews.includes(a.destination));assert(a.stats.length>=2);assert(a.body.length>80)}
assert.equal(demoExperiences.find(e=>e.category==='Clinical experience').hours,demoFacts.clinical);
const seen=new Set(),forbidden=/browser-workspace|browser-records|assistant-service|assistant-context|copilot-context|copilot-parts|ask-pathly-copilot|dashboard-state|home-dashboard|\/model(?:\.|$)/;
function inspect(file){file=path.resolve(file);if(seen.has(file))return;seen.add(file);const text=fs.readFileSync(file,'utf8');assert(!/indexedDB|loadConversation\(|saveConversation\(|workspaceRequest\(|sendAskPathlyMessage\(|answerFromRecords\(|\/api\/assistant|modelProvider\(/.test(text),file+' touches production state');for(const m of text.matchAll(/from\s+['"]([^'"]+)['"]/g)){assert(!forbidden.test(m[1]),file+' imports '+m[1]);if(m[1].startsWith('.')){const base=path.resolve(path.dirname(file),m[1]),target=['.tsx','.ts','/index.tsx'].map(e=>base+e).find(fs.existsSync);if(target)inspect(target)}}}
inspect(path.join(__dirname,'../app/marketing.tsx'));inspect(path.join(__dirname,'../app/public-document.tsx'));
const combined=[...seen].map(f=>fs.readFileSync(f,'utf8')).join('\n');for(const term of ['Local planning rules','No connected AI model','Source needs verification','MODEL_NOT_CONFIGURED','Missing · Required','A clearer next step, at every stage.'])assert(!combined.includes(term),term+' leaked into marketing');
assert(combined.includes('Your Path, Made Clear.'));assert(combined.includes('Consulting services are being developed'));assert(!fs.existsSync(path.join(__dirname,'../app/marketing-preview.tsx')));
console.log('PASS curated demo consistency, distinct prompts/context, public dependency isolation, no storage/provider calls, technical-copy exclusion and consulting/brand honesty');
