import {StoriesCTA,StoryJourneyMap} from '../../marketing/story-presentation';
import Link from '../../marketing/public-link';
import {notFound} from 'next/navigation';
import {MarketingNavbar,MarketingFooter} from '../../marketing/marketing-shell';
import {StoryCard,StoryDisclosure} from '../../marketing/student-stories';
import {studentStories,relatedStories,parseStoryFilters,storyQuery} from '../../marketing/stories-data';
export async function generateMetadata({params}:{params:Promise<{id:string}>}){const {id}=await params;const story=studentStories.find(s=>s.id===id);return {title:story?`${story.name}’s illustrative path — Pathly`:'Story not found — Pathly'}}
export default async function StoryPage({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<Record<string,string|string[]|undefined>>}){
 const [{id},search]=await Promise.all([params,searchParams]);const story=studentStories.find(s=>s.id===id);if(!story)notFound();
 const raw=new URLSearchParams();Object.entries(search).forEach(([key,value])=>{if(value!==undefined)(Array.isArray(value)?value:[value]).forEach(v=>raw.append(key,v))});const query=storyQuery(parseStoryFilters(raw));
 return <div className="marketing pathly-light editorial stories-page"><a className="skip-link" href="#story-main">Skip to story</a><MarketingNavbar/><main id="story-main" className="editorial-section story-detail"><Link className="story-link" href={'/stories'+(query?'?'+query:'')}>← Back to stories</Link><header className="stories-heading"><span className="eyebrow">{story.program} / {story.name}</span><h1>{story.headline}</h1><p>{story.major} · {story.applicants.join(' · ')}</p><StoryDisclosure/></header>
 <div className="story-detail-map"><StoryJourneyMap story={story}/></div>
 <div className="story-narrative"><aside><h2>Starting position</h2><p>{story.goal}</p><dl>{story.metrics.map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><p className="story-note">Example profile details—not targets, minimums, or an admissions formula.</p></aside><div>
 <section><span className="eyebrow">01 / BEFORE</span><h2>Where {story.name.split(' ')[0]} started</h2><p>{story.starting}</p></section>
 <section><span className="eyebrow">02 / CLARITY</span><h2>What became clearer</h2><p>{story.insight}</p></section>
 <section><span className="eyebrow">03 / NEXT STEPS</span><h2>Small actions, connected</h2><ol>{story.actions.map(action=><li key={action}>{action}</li>)}</ol></section>
 <details className="story-change"><summary>See how their path changed</summary><div><section><h3>Before Pathly</h3><ul>{story.before.map(x=><li key={x}>{x}</li>)}</ul></section><section><h3>With Pathly</h3><ul>{story.after.map(x=><li key={x}>{x}</li>)}</ul></section></div></details>
 <blockquote><p>“{story.quote}”</p><cite>{story.name}</cite></blockquote>
 <section className="story-outcome"><span className="eyebrow">EXAMPLE OUTCOME</span><p>{story.outcome}</p><p className="story-note">Preparation is the goal. Pathly does not predict or guarantee admission.</p></section>
 <section><h2>Tools behind the story</h2><p>{story.features.join(' · ')}</p><Link className="story-link" href="/#how-it-works">See how Pathly works →</Link></section></div></div>
 <StoriesCTA/><section className="related-stories"><span className="eyebrow">KEEP EXPLORING</span><h2>Explore another student path.</h2><p>Selected by shared program, applicant background, and profile characteristics.</p><div className="story-grid">{relatedStories(story).map(s=><StoryCard key={s.id} story={s}/>)}</div></section></main><MarketingFooter/></div>;
}
