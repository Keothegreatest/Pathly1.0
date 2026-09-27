'use client';
import {useState,useSyncExternalStore,useId} from 'react';
import Link from 'next/link';
import {useSearchParams} from 'next/navigation';
import {ArrowUpRight,Check,SlidersHorizontal} from 'lucide-react';
import {applicantTypes,emptyFilters,filterStories,parseStoryFilters,profileTags,programs,slug,storyQuery,type StoryFilters,type StudentStory} from './stories-data';
const subscribe=()=>()=>{};
const clientReady=()=>true,serverReady=()=>false;
function subscribeFilters(listener:()=>void){window.addEventListener('popstate',listener);window.addEventListener('pathly:story-filters',listener);return()=>{window.removeEventListener('popstate',listener);window.removeEventListener('pathly:story-filters',listener)}}
const readFilters=()=>window.location.search;

export function StoryDisclosure(){return <p className="story-disclosure">Illustrative student stories shown for product demonstration. These profiles, quotes, and outcomes are fictional—not verified customer results or evidence of admissions success.</p>}
export function StoryCard({story,query=''}:{story:StudentStory;query?:string}){
 return <article className="student-story">
  <div className="story-person"><span className="story-monogram" aria-hidden="true">{story.name.charAt(0)}</span><div><h3>{story.name}</h3><span>{story.program} · {story.applicants.join(' · ')}</span></div></div>
  <span className="story-example">{story.verified?'Verified student story':'Fictional example'}</span>
  <h4>{story.headline}</h4><p>{story.insight}</p>
  <div className="story-metrics">{story.metrics.slice(0,3).map(([label,value])=><span key={label}>{value} <small>{label}</small></span>)}</div>
  <Link className="story-link" href={`/stories/${story.id}${query?'?'+query:''}`}>Read {story.name.split(' ')[0]}’s path <ArrowUpRight size={16}/></Link>
 </article>;
}
function StoryFiltersControl({value,onChange}:{value:StoryFilters;onChange:(value:StoryFilters)=>void}){
 const ready=useSyncExternalStore(subscribe,clientReady,serverReady);
 const applicantId=useId();
 return <div className="story-filters">
  <fieldset className="program-filters" disabled={!ready}><legend>Program type</legend><div>{['All',...programs].map(program=>{const key=program==='All'?'':slug(program),active=value.program===key;return <button type="button" key={program} aria-pressed={active} onClick={()=>onChange({...value,program:key})}>{active&&<Check size={13}/>} {program}</button>})}</div></fieldset>
  <div className="story-filter-options"><div className="story-applicant"><label htmlFor={applicantId}>Applicant type</label><select id={applicantId} disabled={!ready} value={value.applicant} onChange={e=>onChange({...value,applicant:e.target.value})}><option value="">All applicants</option>{applicantTypes.map(a=><option key={a} value={slug(a)}>{a}</option>)}</select></div>
  <details className="story-more"><summary><SlidersHorizontal size={15}/> More filters{value.profiles.length?` (${value.profiles.length})`:''}</summary><fieldset disabled={!ready}><legend>Profile characteristics</legend><p>Show stories matching every selected characteristic. These describe examples, not admissions benchmarks.</p>{profileTags.map(tag=>{const key=slug(tag);return <label key={tag}><input type="checkbox" checked={value.profiles.includes(key)} onChange={e=>onChange({...value,profiles:e.target.checked?[...value.profiles,key]:value.profiles.filter(p=>p!==key)})}/>{tag}</label>})}</fieldset></details></div>
 </div>;
}
function StoryCollection({value,onChange,preview=false}:{value:StoryFilters;onChange:(value:StoryFilters)=>void;preview?:boolean}){
 const ready=useSyncExternalStore(subscribe,clientReady,serverReady);
 const results=filterStories(value),query=storyQuery(value),shown=preview?results.slice(0,3):results;
 return <><StoryFiltersControl value={value} onChange={onChange}/><div className="story-results-meta"><p role="status" aria-live="polite">{results.length} {results.length===1?'story':'stories'}{preview&&results.length>3?' · Showing 3':''}</p>{query&&<button disabled={!ready} type="button" onClick={()=>onChange(emptyFilters)}>Clear filters</button>}</div>
  {shown.length?<div className="story-grid" key={query}>{shown.map(story=><StoryCard key={story.id} story={story} query={query}/>)}</div>:<div className="stories-empty"><h3>No stories match those filters yet.</h3><p>Try broadening your filters to explore more student paths.</p><button className="primary" disabled={!ready} type="button" onClick={()=>onChange(emptyFilters)}>Clear filters</button></div>}
  {preview&&<Link className="story-link stories-explore" href={'/stories'+(query?'?'+query:'')}>Explore all student stories <ArrowUpRight size={18}/></Link>}
 </>;
}
export function StoriesDirectory(){
 const params=useSearchParams();
 // Query-only edits need no server navigation. The URL is the single source of
 // truth; native history supports immediate controls, refresh and back/forward.
 const query=useSyncExternalStore(subscribeFilters,readFilters,()=>params.toString());
 const filters=parseStoryFilters(new URLSearchParams(query));
 function change(next:StoryFilters){const query=storyQuery(next);window.history.pushState(null,'','/stories'+(query?'?'+query:''));window.dispatchEvent(new Event('pathly:story-filters'))}
 return <StoryCollection value={filters} onChange={change}/>;
}
export function StoriesPreview(){
 const [filters,setFilters]=useState<StoryFilters>(emptyFilters);
 return <section id="student-stories" className="editorial-section stories-preview" aria-labelledby="stories-preview-heading"><span className="eyebrow">STUDENT PATHS / MANY WAYS FORWARD</span><h2 id="stories-preview-heading">Real paths look different.</h2><p>Explore fictional student journeys. Find a starting point that feels familiar, then see how clearer records can help.</p><StoryDisclosure/><StoryCollection value={filters} onChange={setFilters} preview/></section>;
}


