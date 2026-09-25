'use client';

import Image from 'next/image';
import {useEffect,useRef,useState,useSyncExternalStore} from 'react';
import {ArrowDown,ArrowUpRight,Plus} from 'lucide-react';
import {MarketingNavbar,MarketingFooter} from './marketing/marketing-shell';
import AskPathlyDemo from './marketing/ask-pathly-demo';
import ProductDemo from './marketing/product-demo';
import ProductStory from './marketing/product-story';
import {ClarityBenefits,ConnectedJourney,WorkspaceComparison} from './marketing/journey-benefits';
import type {ProductView} from './marketing/demo-data';

const subscribe=()=>()=>{};
export default function Marketing(){
 const [view,setView]=useState<ProductView>('Experiences'),[exploring,setExploring]=useState(false);
 const root=useRef<HTMLDivElement>(null);
 const ready=useSyncExternalStore(subscribe,()=>true,()=>false);
 useEffect(()=>{
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{
   if(e.isIntersecting){e.target.setAttribute('data-entered','true');observer.unobserve(e.target)}
  }),{threshold:.08});
  root.current?.querySelectorAll('.editorial-reveal').forEach(n=>observer.observe(n));
  return()=>observer.disconnect();
 },[]);
 function explore(next:ProductView){setView(next);setExploring(true)}
 return <div className="marketing pathly-light editorial" data-ready={ready} ref={root}>
  <a className="skip-link" href="#marketing-main">Skip to content</a>
  <MarketingNavbar/>
  <main id="marketing-main">
   <section className="editorial-hero">
    <span className="eyebrow">YOUR PRE-HEALTH JOURNEY, ALL IN ONE PLACE</span>
    <h1>Your path to healthcare,<br/><em>made clearer.</em></h1>
    <div className="editorial-hero-bottom">
     <p>Track your experiences, understand your progress, and know what to work on next.</p>
     <div className="editorial-actions"><a className="primary" href="/signup">Get started<ArrowUpRight size={18}/></a><a className="text-button" href="#how-it-works">See how Pathly works<ArrowDown size={16}/></a></div>
    </div>
    <div className="hero-chapter"><span>YOU ARE HERE</span><span>A clearer picture starts with what you’ve already done.</span><ArrowDown size={16}/></div>
   </section>

   <section className="recognition editorial-section editorial-reveal" id="for-students">
    <span className="eyebrow">SOUND FAMILIAR?</span>
    <div><h2>A lot of work.<br/>A lot of places to keep it.</h2>
     <p>Your pre-health journey shouldn’t live across spreadsheets, note apps, saved tabs, and your memory.</p>
     <ul className="recognition-list" aria-label="Parts of your journey">{['Clinical hours','Research','Volunteering','School requirements','Reflections','Letters','Application deadlines'].map(x=><li key={x}>{x}</li>)}</ul>
     <p className="recognition-payoff">You’re doing the work.<br/><strong>Pathly brings it all together.</strong></p>
    </div>
   </section>

   <div id="how-it-works" className="product-story">
    <ProductStory number="01" verb="SEE" title="One place to know where you stand." copy="Pathly connects your experiences, goals, school requirements, and application progress so you can see what’s done, what’s missing, and what deserves your attention next." image="home" alt="The real Pathly Home screen showing Next Best Actions, application readiness by area, documented hours, and upcoming goals." caption="Experiences, goals, schools, readiness, and Next Best Actions. One connected view." wide/>
    <ClarityBenefits/>
    <ConnectedJourney/>
    <ProductStory number="02" verb="BUILD" title="Your experiences are more than hours." copy="Keep the role, the hours, and the details. Capture what you learned and the moments that stayed with you—while they’re still fresh. Your future application story starts here." image="experiences" alt="Pathly Experiences showing categories, documented hours, reflection status, and Capture a moment actions." caption="Experiences, reflections, and Story Moments stay connected." reverse/>
    <section className="next-chapter" id="next-steps">
     <div className="editorial-section">
      <div className="chapter-heading editorial-reveal"><span className="chapter-number">03</span><span className="eyebrow">PLAN / A CLEARER NEXT STEP</span></div>
      <div className="next-chapter-grid editorial-reveal">
       <div><h2>Don’t just track progress.<br/>Know what deserves your attention <em>next.</em></h2><p>Next Best Actions uses the information you’ve saved to surface practical priorities—like an experience waiting for a reflection or a requirement you still need to review. Each action includes context and a way to get started.</p><a className="primary" href="/signup">Get started<ArrowUpRight size={18}/></a><small>Start with one experience. Build from there.</small></div>
       <figure className="product-capture actions-capture"><Image unoptimized src="/marketing/actions.webp" alt="Real Next Best Actions recommendations with reasons and specific actions, generated from fictional example records." width={656} height={394} loading="lazy"/><figcaption>Real Pathly interface · Illustrative student records</figcaption></figure>
      </div>
     </div>
    </section>
    <ProductStory number="04" verb="APPLY" title="When application season comes, you won’t be starting from scratch." copy="Return to experiences you’ve organized, stories you’ve saved, and schools you’ve researched. Keep requirements, letters, and writing in view as your application takes shape." image="application" alt="Pathly Application readiness showing preparation areas, documented evidence, and suggested actions." caption="Readiness means documented preparation, never an admissions prediction."/>
   </div>

   <WorkspaceComparison/>

   <section className="editorial-explore editorial-section" aria-label="Explore Pathly">
    <div className="explore-intro"><span className="eyebrow">A CLOSER LOOK</span><h2>See it for yourself.</h2><p>Explore a fictional journey. Your own workspace starts fresh.</p></div>
    <details><summary>Try an Ask Pathly example<Plus size={20}/></summary><AskPathlyDemo onExplore={explore}/></details>
    <details id="software" open={exploring} onToggle={e=>setExploring(e.currentTarget.open)}><summary>Explore the example workspace<Plus size={20}/></summary><ProductDemo view={view} onChange={setView}/></details>
    <div className="trust-note"><p>Your workspace stays in this browser. No account required. Export your records regularly.</p><a href="/privacy">How your information is stored<ArrowUpRight size={15}/></a></div>
   </section>

   <section className="editorial-final">
    <div className="editorial-section editorial-reveal"><span className="eyebrow">YOU’VE ALREADY STARTED. KEEP BUILDING.</span><h2>You’ve already put in the work.<br/>Keep the journey <em>clear.</em></h2><p>Bring your experiences, goals, schools, and application planning into one place built for the pre-health journey.</p><div className="editorial-actions"><a className="primary" href="/signup">Get started<ArrowUpRight size={18}/></a><a className="text-button" href="#software" onClick={()=>explore("Experiences")}>Explore an example workspace<ArrowUpRight size={16}/></a></div><small>You don’t need to organize your entire journey today.</small></div>
   </section>
  </main>
  <MarketingFooter/>
 </div>
}
