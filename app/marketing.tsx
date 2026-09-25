'use client';

import Image from 'next/image';
import {useEffect,useRef,useState,useSyncExternalStore} from 'react';
import {ArrowDown,ArrowUpRight,Plus} from 'lucide-react';
import {MarketingNavbar,MarketingFooter} from './marketing/marketing-shell';
import AskPathlyDemo from './marketing/ask-pathly-demo';
import ProductDemo from './marketing/product-demo';
import ProductStory from './marketing/product-story';
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
     <div className="editorial-actions"><a className="primary" href="/signup">Start your journey<ArrowUpRight size={18}/></a><a className="text-button" href="#how-it-works">See how Pathly works<ArrowDown size={16}/></a></div>
    </div>
    <div className="hero-chapter"><span>YOU ARE HERE</span><span>A clearer picture starts with what you’ve already done.</span><ArrowDown size={16}/></div>
   </section>

   <section className="recognition editorial-section editorial-reveal" id="for-students">
    <span className="eyebrow">SOUND FAMILIAR?</span>
    <div><h2>A lot of work.<br/>A lot of places to keep it.</h2>
     <p>Your pre-health journey shouldn’t live across spreadsheets, note apps, saved tabs, and your memory.</p>
     <ul className="recognition-list" aria-label="Parts of your journey">{['Clinical hours','Research','Volunteering','School requirements','Reflections','Letters','Application deadlines'].map(x=><li key={x}>{x}</li>)}</ul>
     <p className="recognition-payoff">You’re doing the work.<br/><strong>Pathly helps you see the bigger picture.</strong></p>
    </div>
   </section>

   <section className="editorial-statement editorial-section editorial-reveal" id="about">
    <span className="eyebrow">ONE JOURNEY. A CLEARER PICTURE.</span>
    <h2>Everything you’re doing<br/>is going <em>somewhere.</em></h2>
    <p>Bring your experiences, goals, school requirements, reflections, and application progress into one place. See how the pieces are building on each other.</p>
   </section>

   <div id="how-it-works" className="product-story">
    <ProductStory number="01" verb="SEE" title="See the whole journey, not just today’s checklist." copy="Understand what you’ve documented across experiences, academics, schools, and application preparation. A clear view of your progress, with room for what’s still developing." image="home" alt="The real Pathly Home screen showing Next Best Actions, application readiness by area, documented hours, and upcoming goals." caption="Home brings your preparation into one connected view." wide/>
    <ProductStory number="02" verb="BUILD" title="Your experiences are more than hours." copy="Keep the role, the hours, and the details. Capture what you learned and the moments that stayed with you—while they’re still fresh. Your future application story starts here." image="experiences" alt="Pathly Experiences showing categories, documented hours, reflection status, and Capture a moment actions." caption="Experiences, reflections, and Story Moments stay connected." reverse/>
    <section className="next-chapter" id="next-steps">
     <div className="editorial-section">
      <div className="chapter-heading editorial-reveal"><span className="chapter-number">03</span><span className="eyebrow">PLAN / A CLEARER NEXT STEP</span></div>
      <div className="next-chapter-grid editorial-reveal">
       <div><h2>Stop wondering<br/>what to work<br/>on <em>next.</em></h2><p>Pathly looks across your saved journey to surface specific next steps, with the context behind each one. Less searching through your plan. More clarity about where to begin.</p><a className="primary" href="/signup">Start your journey<ArrowUpRight size={18}/></a><small>Start with one experience. Build from there.</small></div>
       <figure className="product-capture actions-capture"><Image unoptimized src="/marketing/actions.webp" alt="Real Next Best Actions recommendations with reasons and specific actions, generated from fictional example records." width={656} height={394} loading="lazy"/><figcaption>Real Pathly interface · Illustrative student records</figcaption></figure>
      </div>
     </div>
    </section>
    <ProductStory number="04" verb="APPLY" title="When application season comes, you won’t be starting from scratch." copy="Return to experiences you’ve organized, stories you’ve saved, and schools you’ve researched. Keep requirements, letters, and writing in view as your application takes shape." image="application" alt="Pathly Application readiness showing preparation areas, documented evidence, and suggested actions." caption="Readiness means documented preparation, never an admissions prediction."/>
   </div>

   <section className="future-self editorial-section editorial-reveal">
    <span className="eyebrow">FOR THE PERSON YOU’RE BECOMING</span>
    <h2>Imagine remembering<br/>the moments that<br/><em>shaped you most.</em></h2>
    <div className="future-self-bottom"><p>You don’t become application-ready in one semester. Your story develops across years of experiences, decisions, reflections, and growth.</p><p>A conversation you learned from. A challenge you worked through. A new perspective. Give those moments a place to live, so you can return to them when it matters.</p></div>
   </section>

   <section className="editorial-explore editorial-section" aria-label="Explore Pathly">
    <div className="explore-intro"><span className="eyebrow">A CLOSER LOOK</span><h2>See it for yourself.</h2><p>Explore a fictional journey. Your own workspace starts fresh.</p></div>
    <details><summary>Try an Ask Pathly example<Plus size={20}/></summary><AskPathlyDemo onExplore={explore}/></details>
    <details id="software" open={exploring} onToggle={e=>setExploring(e.currentTarget.open)}><summary>Explore the example workspace<Plus size={20}/></summary><ProductDemo view={view} onChange={setView}/></details>
    <div className="trust-note"><p>Your workspace stays in this browser. No account required. Export your records regularly.</p><a href="/privacy">How your information is stored<ArrowUpRight size={15}/></a></div>
   </section>

   <section className="editorial-final">
    <div className="editorial-section editorial-reveal"><span className="eyebrow">YOU’VE ALREADY STARTED. KEEP BUILDING.</span><h2>Know where you’re going.<br/>And what comes <em>next.</em></h2><p>Bring your experiences, goals, schools, and application journey together in one place.</p><div className="editorial-actions"><a className="primary" href="/signup">Start your journey<ArrowUpRight size={18}/></a><a className="text-button" href="/login">Sign in<ArrowUpRight size={16}/></a></div><small>You don’t need to organize your entire journey today.</small></div>
   </section>
  </main>
  <MarketingFooter/>
 </div>
}
