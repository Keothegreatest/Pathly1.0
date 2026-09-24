function unavailable(){return Response.json({error:'Pathly now saves work privately in your browser. Open the application to continue.'},{status:410,headers:{'Cache-Control':'no-store'}})}
export const GET=unavailable;
export const PUT=unavailable;
export const DELETE=unavailable;
