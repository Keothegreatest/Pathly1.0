import {configured,handleAssistant,type AssistantConfig} from '@/lib/assistant/endpoint';
async function config():Promise<AssistantConfig>{try{const {env}=await import('cloudflare:workers');return env as unknown as AssistantConfig;}catch{return {};}}
export async function GET(){const c=await config();return Response.json({available:configured(c),provider:'OpenAI',siteKey:configured(c)?c.TURNSTILE_SITE_KEY:undefined},{headers:{'Cache-Control':'no-store'}});}
export async function POST(request:Request){return handleAssistant(request,await config());}
