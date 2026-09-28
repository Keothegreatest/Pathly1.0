export const metadata={title:'Pathly — Your Path to Healthcare, Made Clear',description:'A connected pre-health planning workspace for experiences, reflections, school research, goals, and application preparation. See what deserves your attention next.'};
import {redirect} from 'next/navigation';
import Marketing from './marketing';
import {workspaceRoute} from './workspace-route';
export default async function Page({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){const params=await searchParams;if(typeof params.view==='string'){const route=workspaceRoute(new URLSearchParams({view:params.view,tab:typeof params.tab==='string'?params.tab:''}).toString());redirect('/app?view='+encodeURIComponent(route.page)+'&tab='+encodeURIComponent(route.tab))}return <Marketing/>}
