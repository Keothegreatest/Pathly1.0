import Pathly from '../pathly';
import {workspaceRoute} from '../workspace-route';
export default async function AppPage({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
 const search=await searchParams;const params=new URLSearchParams();
 for(const key of ['view','tab'])if(typeof search[key]==='string')params.set(key,search[key]);
 return <Pathly initialRoute={workspaceRoute(params.toString())}/>;
}
