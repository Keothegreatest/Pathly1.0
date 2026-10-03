'use client';
import {useState,useSyncExternalStore,useId} from 'react';
import Link from './public-link';
import {StoryJourneyMap,ApplicantMetrics} from './story-presentation';
import {ArrowUpRight,Check,SlidersHorizontal} from 'lucide-react';
import {storyPathways,applicantTypes,emptyFilters,filterStories,parseStoryFilters,profileTags,slug,storyQuery,type StoryFilters,type StudentStory} from './stories-data';
const subscribe=()=>()=>{};
const clientReady=()=>true,serverReady=()=>false;
function subscribeFilters(listener:()=>void){window.addEventListener('popstate',listener);window.addEventListener('pathly:story-filters',listener);return()=>{window.removeEventListener('popstate',listener);window.removeEventListener('pathly:story-filters',listener)}}
const readFilters=()=>window.location.search;

export function StoryDisclosure(){return <p className="story-disclosure">These illustrative journeys show how Pathly can organize different paths into healthcare. Profiles and quotes are examples, not customer testimonials.</p>}
export function StoryCard({story,query=''}:{story:StudentStory;query?:string}){
 return <article className="student-story">
  <div className="story-art"><span className="story-example">Illustrative profile</span><StoryJourneyMap story={story}/></div>
  <div className="story-person"><div><h3>{story.name}</h3><span>{story.program} · {story.applicants.join(' · ')}</span></div></div>
  <h4>{story.headline}</h4>
  <p className="story-before"><span>BEFORE</span>{story.before[0]}</p>
  <div className="story-insight"><span className="eyebrow">PATHLY INSIGHT</span><p>{story.insight}</p></div>
  <p className="story-next"><span>NEXT STEP</span>{story.actions[0]}</p><div className="story-tags">{story.profiles.slice(0,2).map(tag=><span key={tag}>{tag}</span>)}</div>
  <ApplicantMetrics metrics={story.metrics}/>
  <Link className="story-link" href={`/stories/${story.id}${query?'?'+query:''}`}>Read {story.name.split(' ')[0]}’s story <ArrowUpRight size={16}/></Link>
 </article>;
}

function StoryFiltersControl({value,onChange}:{value:StoryFilters;onChange:(value:StoryFilters)=>void}){
 const ready=useSyncExternalStore(subscribe,clientReady,serverReady);
 const applicantId=useId();
 return <div className="story-filters" id={applicantId+'-filters'}>
  <fieldset className="program-filters" disabled={!ready}><legend>Program type</legend><div>{[{id:'',label:'All'},...storyPathways].map(program=>{const key=program.id,active=value.program===key;return <button type="button" key={key} aria-pressed={active} onClick={()=>onChange({...value,program:key})}>{active&&<Check size={13}/>} {program.label}</button>})}</div></fieldset>
  <div className="story-filter-options"><div className="story-applicant"><label htmlFor={applicantId}>Applicant type</label><select id={applicantId} disabled={!ready} value={value.applicant} onChange={e=>onChange({...value,applicant:e.target.value})}><option value="">All applicants</option>{applicantTypes.map(a=><option key={a} value={slug(a)}>{a}</option>)}</select></div>
  <details className="story-more"><summary><SlidersHorizontal size={15}/> More filters{value.profiles.length?` (${value.profiles.length})`:''}</summary><fieldset disabled={!ready}><legend>Profile characteristics</legend><p>Show stories matching every selected characteristic. These describe examples, not admissions benchmarks.</p>{profileTags.map(tag=>{const key=slug(tag);return <label key={tag}><input type="checkbox" checked={value.profiles.includes(key)} onChange={e=>onChange({...value,profiles:e.target.checked?[...value.profiles,key]:value.profiles.filter(p=>p!==key)})}/>{tag}</label>})}</fieldset></details></div>
 </div>;
}
function StoryCollection({value,onChange,preview=false}:{value:StoryFilters;onChange:(value:StoryFilters)=>void;preview?:boolean}){
 const ready=useSyncExternalStore(subscribe,clientReady,serverReady);
 const results=filterStories(value),query=storyQuery(value),shown=preview?results.slice(0,3):results;
 return <><StoryFiltersControl value={value} onChange={onChange}/><div className="story-results-meta"><div><h2>Stories like yours</h2><p role="status" aria-live="polite">{results.length} illustrative {results.length===1?'profile matches':'profiles match'} your filters</p></div>{query&&<button disabled={!ready} type="button" onClick={()=>onChange(emptyFilters)}>Clear filters</button>}</div>
  {shown.length?<div className="story-grid" key={query}>{shown.map(story=><StoryCard key={story.id} story={story} query={query}/>)}</div>:<div className="stories-empty"><h3>No stories match those filters yet.</h3><p>Try broadening your filters to explore more student paths.</p><button className="primary" disabled={!ready} type="button" onClick={()=>onChange(emptyFilters)}>Clear filters</button></div>}
  {preview&&<Link className="story-link stories-explore" href={'/stories'+(query?'?'+query:'')}>Explore all student stories <ArrowUpRight size={18}/></Link>}
 </>;
}
export function StoriesDirectory({initialQuery=""}:{initialQuery?:string}){
 // Query-only edits need no server navigation. The URL is the single source of
 // truth; native history supports immediate controls, refresh and back/forward.
 const query=useSyncExternalStore(subscribeFilters,readFilters,()=>initialQuery);
 const filters=parseStoryFilters(new URLSearchParams(query));
 function change(next:StoryFilters){const query=storyQuery(next);window.history.pushState(null,'','/stories'+(query?'?'+query:''));window.dispatchEvent(new Event('pathly:story-filters'))}
 return <div className="stories-directory"><div className="story-personalize"><div><strong>Looking for a familiar starting point?</strong><p>Choose your program and background to explore examples that feel relevant.</p></div><button className="secondary" onClick={()=>{const select=document.querySelector<HTMLElement>('.stories-directory .story-applicant select');select?.scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});select?.focus({preventScroll:true})}}>Find stories like mine <ArrowUpRight size={16}/></button></div><StoryCollection value={filters} onChange={change}/></div>;
}
export function StoriesPreview(){
 const [filters,setFilters]=useState<StoryFilters>(emptyFilters);
 return <section id="student-stories" className="editorial-section stories-preview" aria-labelledby="stories-preview-heading"><span className="eyebrow">STUDENT PATHS / MANY WAYS FORWARD</span><h2 id="stories-preview-heading">Every journey takes its own shape.</h2><p>Find a starting point that feels familiar, then see how clearer records can help.</p><StoryDisclosure/><StoryCollection value={filters} onChange={setFilters} preview/></section>;
}


