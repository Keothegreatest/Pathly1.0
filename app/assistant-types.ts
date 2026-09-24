import type {Destination} from './journey';
export type AssistantAction={label:string;destination:Destination};
export type AssistantMessage={id:string;role:'user'|'assistant';text:string;createdAt:string;actions?:AssistantAction[]};
export type AssistantAnswer={text:string;actions:AssistantAction[];mode:'local-planning'};
