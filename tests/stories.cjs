const fs=require('fs'),ts=require('typescript'),assert=require('node:assert/strict');
require.extensions['.ts']=(m,p)=>m._compile(ts.transpileModule(fs.readFileSync(p,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,p);
const {studentStories,programs,emptyFilters,filterStories,parseStoryFilters,storyQuery,relatedStories}=require('../app/marketing/stories-data.ts');
assert.equal(new Set(studentStories.map(s=>s.id)).size,11);
assert(studentStories.every(s=>!s.verified&&s.outcome.includes('fictional')));
for(const program of programs)assert(filterStories({...emptyFilters,program:program==='MD/DO'?'md-do':program.toLowerCase()}).length>0);
assert.deepEqual(filterStories({program:'md',applicant:'first-generation',profiles:['research-focused']}).map(s=>s.id),['maya-r']);
assert.equal(filterStories({program:'md-do',applicant:'nontraditional',profiles:[]})[0].id,'grace-w');
assert.deepEqual(new Set(filterStories({...emptyFilters,program:'md-do'}).map(s=>s.program)),new Set(['MD','DO']));
assert.equal(parseStoryFilters(new URLSearchParams('program=md')).program,'md-do');
assert.equal(parseStoryFilters(new URLSearchParams('program=do')).program,'md-do');
assert.equal(filterStories({program:'pa',applicant:'career-changer',profiles:['high-patient-care-hours','leadership-focused']})[0].id,'priya-s');
const filters={program:'pa',applicant:'nontraditional',profiles:['high-patient-care-hours']};
assert.deepEqual(parseStoryFilters(new URLSearchParams(storyQuery(filters))),filters);
assert.deepEqual(parseStoryFilters(new URLSearchParams('program=garbage&applicant=bad&profile=bad')),emptyFilters);
assert.equal(relatedStories(studentStories[0])[0].id,'luis-a');
assert(relatedStories(studentStories[0]).every(s=>s.id!=='maya-r'));
console.log('PASS story filters, combinations, URL validation/roundtrip, program representation, disclosure data, deterministic related stories');

