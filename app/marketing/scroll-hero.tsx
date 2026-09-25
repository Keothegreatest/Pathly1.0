import Image from 'next/image';
import {ArrowDown,ArrowUpRight} from 'lucide-react';
const fragments=[['SPREADSHEET','142 clinical hours'],['NOTES','Hospital shift reflection'],['SAVED TAB','School prerequisites'],['CALENDAR','Application deadline'],['DOC','Personal statement ideas'],['RESEARCH','Programs to compare']];
export function WorkflowFragments({product=false}:{product?:boolean}){
 return <div className={'workflow-fragments'+(product?' fragments-product':'')} aria-label="Illustrative scattered workflow becoming one Pathly workspace">
  <div className="fragment-pieces" aria-hidden="true">{fragments.map(([label,text],i)=><div className={'workflow-fragment fragment-'+i} key={label}><span>{label}</span><p>{text}</p></div>)}</div>
  <div className="fragment-destination">{product?<Image unoptimized src="/marketing/home.webp" width={1440} height={1060} alt="Real Pathly Home with example records, preparation areas, goals and next actions."/>:<><strong>Pathly</strong><span>Everything, together.</span></>}</div>
  <span className="fragment-caption">Illustrative workflow{product?' · Real Pathly interface':''}</span>
 </div>
}
export default function ScrollHero(){return <section className="scroll-hero" data-scroll-scene="pinned">
 <div className="scroll-hero-sticky">
  <div className="scroll-hero-copy"><span className="eyebrow">BUILT FOR PRE-HEALTH STUDENTS</span><h1>Your <span className="keep-together">pre-health</span> journey shouldn’t live in <em>six different places.</em></h1><p>Pathly is an all-in-one planning workspace for pre-health students to organize experiences, school requirements, reflections, goals, and application progress—and understand what deserves their attention next.</p><div className="editorial-actions"><a className="primary" href="/signup">Get started<ArrowUpRight size={18}/></a><a className="text-button" href="#how-it-works">See how it works<ArrowDown size={15}/></a></div><ul className="hero-value"><li>Track what you’ve done.</li><li>See what may be missing.</li><li>Know what comes next.</li></ul></div>
  <WorkflowFragments product/>
  <div className="hero-chapter"><span>YOU ARE HERE</span><span>A clearer picture starts with what you’ve already done.</span><ArrowDown size={16}/></div>
 </div>
</section>}
