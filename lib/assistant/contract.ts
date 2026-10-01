import {z} from 'zod';
const fact=z.object({id:z.string().min(1).max(160),type:z.enum(['documented','student_preference','pathly_recommendation','inference','unknown']),text:z.string().max(1600),entityId:z.string().max(100).optional()}).strict();
export const requestSchema=z.object({intent:z.literal('planning-tradeoffs'),question:z.literal('What should I focus on this semester?'),consent:z.literal(true),challenge:z.string().min(1).max(2048),context:z.object({version:z.literal(1),topic:z.enum(['planning','schools','experiences','writing','goals','unrelated']),facts:z.array(fact).max(55),actions:z.array(z.object({id:z.string().max(160),label:z.string().max(300)}).strict()).max(12),continuity:z.array(z.object({role:z.enum(['user','assistant']),text:z.string().max(1200)}).strict()).max(4),memories:z.array(z.object({id:z.string().max(100),text:z.string().max(240)}).strict()).max(8),selection:z.object({matchedEntities:z.array(z.string().max(100)).max(100),omittedEntities:z.number().int().nonnegative()}).strict()}).strict()}).strict();
export type ModelContext=z.infer<typeof requestSchema>['context'];
export const outputSchema=z.object({answer:z.string().min(1).max(1800),reasoningSummary:z.string().max(600),evidenceIds:z.array(z.string()).max(8),inferences:z.array(z.string().max(400)).max(3),actionIds:z.array(z.string()).max(3),memoryCandidate:z.string().max(240).nullable()}).strict();
export type ModelAnswer=z.infer<typeof outputSchema>;
export const responseFormat={type:'json_schema',name:'pathly_planning',strict:true,schema:{type:'object',additionalProperties:false,required:['answer','reasoningSummary','evidenceIds','inferences','actionIds','memoryCandidate'],properties:{answer:{type:'string'},reasoningSummary:{type:'string'},evidenceIds:{type:'array',items:{type:'string'}},inferences:{type:'array',items:{type:'string'}},actionIds:{type:'array',items:{type:'string'}},memoryCandidate:{type:['string','null']}}}};
export function validateModelAnswer(value:unknown,context:ModelContext):ModelAnswer{
 const answer=outputSchema.parse(value);
 if(answer.evidenceIds.some(id=>!context.facts.some(f=>f.id===id))||answer.actionIds.some(id=>!context.actions.some(a=>a.id===id)))throw new Error('Unrecognized evidence or action');
 if(context.facts.length&&!answer.evidenceIds.length)throw new Error('Missing grounding');
 const prose=[answer.answer,answer.reasoningSummary,...answer.inferences].join(' ');
 if(/\b(?:likely|unlikely)\s+to\s+(?:get in|be admitted|be accepted)|\b\d+(?:\.\d+)?\s*%[^.!?\n]{0,40}(?:admi|accept)|\b(?:chance|chances|probability|odds)\s+of\s+(?:acceptance|admission|getting in)|competitiveness score/i.test(prose))throw new Error('Unsupported admissions prediction');
 if(/\b(competitive applicant|you (?:will|should|are likely to|are unlikely to) (?:get|be) accepted|guarantee.{0,25}admission|acceptance (?:odds|probability)|you definitely need|you are behind|most successful applicants)\b/i.test(prose))throw new Error('Unsupported admissions claim');
 const supplied=JSON.stringify(context);
 for(const number of prose.match(/\b\d+(?:\.\d+)?\b/g)||[])if(!['1','2','3'].includes(number)&&!supplied.includes(number))throw new Error('Unsupported quantitative claim');
 if(/\b(?:requires?|required|minimum)\b/i.test(prose)&&!answer.evidenceIds.some(id=>context.facts.some(f=>f.id===id&&f.type==='documented'&&/requirement|source|prerequisite/i.test(f.text))))throw new Error('Unsupported requirement claim');
 return answer;
}
