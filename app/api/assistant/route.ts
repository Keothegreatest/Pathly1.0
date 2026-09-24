import {modelProvider} from '@/lib/assistant/provider';
export async function POST(){
 // Guest workspaces have no server identity. Do not accept private context or
 // enable a paid, publicly callable model endpoint without an access boundary.
 if(!modelProvider())return Response.json({error:'A language-model provider is not configured. The local planning guide remains available.',code:'MODEL_NOT_CONFIGURED'},{status:503,headers:{'Cache-Control':'no-store'}});
 return Response.json({error:'Server-side assistant access is not enabled.'},{status:403,headers:{'Cache-Control':'no-store'}});
}
