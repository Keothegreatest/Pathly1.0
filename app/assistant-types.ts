import type {Destination} from './journey';
export type AssistantAction={label:string;destination:Destination};
export type AssistantEvidence={type:import('./student-intelligence').EvidenceType;text:string;id?:string};
export type AssistantMessage={id:string;role:'user'|'assistant';text:string;createdAt:string;actions?:AssistantAction[];evidence?:AssistantEvidence[];mode?:'local-planning'|'model';memoryCandidate?:string;planningFocus?:string};
export type AssistantAnswer={text:string;actions:AssistantAction[];mode:'local-planning'|'model';evidence?:AssistantEvidence[];memoryCandidate?:string;planningFocus?:string};
