import Link from './public-link';
import {ArrowUpRight} from 'lucide-react';
import type {StudentStory} from './stories-data';

/** A conceptual connection diagram, not a score or measured profile change. */
export function StoryJourneyMap({story}:{story?:StudentStory}){
 const labels=story?.features.slice(0,3)||['Experiences','Reflections','School planning'];
 return <div className={'story-journey-map '+(story?'map-'+story.program.toLowerCase():'map-intro')} aria-hidden="true"><div className="map-sources">{labels.map((label,i)=><span key={label}><i/>{label}<small>0{i+1}</small></span>)}</div><svg viewBox="0 0 72 120" preserveAspectRatio="none"><path d="M0 20 C40 20 20 60 72 60 M0 60 H72 M0 100 C40 100 20 60 72 60"/></svg><div className="map-destination"><span>{story?story.name.split(' ').map(n=>n[0]).join(''):'P'}</span><small>{story?'One connected journey':'A clearer next step'}</small></div></div>;
}
export function ApplicantMetrics({metrics}:{metrics:StudentStory['metrics']}){return <dl className="story-metrics">{metrics.slice(0,3).map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>}
export function StoriesCTA(){return <section className="stories-cta" aria-labelledby="stories-cta-title"><span className="eyebrow">MAKE ROOM FOR YOUR OWN STORY</span><h2 id="stories-cta-title">Your application already<br/>has a story.</h2><p>Bring your experiences together. See what you’ve documented, what needs context, and what deserves your attention next.</p><div><Link className="primary" href="/app">Build my Pathly profile <ArrowUpRight size={17}/></Link><Link className="story-link" href="/#how-it-works">See how Pathly works <ArrowUpRight size={16}/></Link></div><small>Start with what you’ve already done. Pathly helps you plan; it does not predict admission.</small></section>}
