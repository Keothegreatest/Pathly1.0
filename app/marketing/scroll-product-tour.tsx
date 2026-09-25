'use client';
import Image from 'next/image';
import {useEffect,useRef,useState} from 'react';
const steps=[
 {name:'Experiences',title:'Years of work, kept in view.',copy:'Keep clinical, volunteer, research, and leadership experience from disappearing into spreadsheets. Record the role, hours, and details in one place.',image:'experiences',width:536,height:301},
 {name:'Schools',title:'A school list with context.',copy:'Keep the programs you’re considering and the requirements you’ve recorded together. Check details against official school sources as your plans develop.',image:'schools',width:536,height:425},
 {name:'Reflections',title:'Keep the details you’ll want later.',copy:'Capture meaningful moments while you still remember them. Connect what you learned to the experience that shaped it.',image:'reflections',width:536,height:226},
 {name:'Goals',title:'Give your next step a direction.',copy:'Turn a larger intention into a practical goal. Keep your progress and target dates connected to the work you’re doing.',image:'goals',width:536,height:264},
 {name:'Application',title:'Prepare from what you’ve already built.',copy:'Bring your documented preparation into view, from experiences and letters to school planning and writing. Readiness describes preparation, never admissions chances.',image:'application',width:1089,height:783},
 {name:'Next Best Actions',title:'Know what deserves attention next.',copy:'Find specific priorities based on what you’ve saved—like an experience waiting for a reflection. See the context, then open the right place to act.',image:'actions',width:656,height:394},
];
export default function ScrollProductTour(){
 const [active,setActive]=useState(0),root=useRef<HTMLElement>(null);
 useEffect(()=>{
  const media=matchMedia('(min-width: 1000px) and (prefers-reduced-motion: no-preference)');
  const observer=new IntersectionObserver(entries=>{
   if(!media.matches)return;
   for(const entry of entries)if(entry.isIntersecting)setActive(Number((entry.target as HTMLElement).dataset.tourStep));
  },{rootMargin:'-35% 0px -45% 0px',threshold:0});
  root.current?.querySelectorAll('[data-tour-step]').forEach(node=>observer.observe(node));
  return()=>observer.disconnect();
 },[]);
 function choose(index:number){
  setActive(index);
  const target=root.current?.querySelector<HTMLElement>('[data-tour-step="'+index+'"]');
  target?.focus({preventScroll:true});
  target?.scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
 }
 const step=steps[active];
 return <section className="scroll-product-tour editorial-section" ref={root} aria-labelledby="tour-title">
  <div className="tour-intro"><span className="eyebrow">ONE WORKSPACE. THE WHOLE JOURNEY.</span><h2 id="tour-title">See how the pieces<br/>work <em>together.</em></h2><p>Follow the journey below, or choose an area to explore.</p></div>
  <nav className="tour-navigation" aria-label="Product tour">{steps.map((s,i)=><button key={s.name} aria-current={active===i?'step':undefined} onClick={()=>choose(i)}>{s.name}</button>)}</nav>
  <div className="tour-layout">
   <figure className="tour-sticky product-capture">
    <div className="tour-frame-header"><span>PATHLY / {step.name.toUpperCase()}</span><span>{String(active+1).padStart(2,'0')} / 06</span></div>
    <div className="tour-image-stage"><Image key={step.image} unoptimized src={'/marketing/'+step.image+'.webp'} alt={'Real Pathly '+step.name+' interface with illustrative records.'} width={step.width} height={step.height}/></div>
    <figcaption>Real current interface · Illustrative workflow</figcaption>
    <div className="tour-progress" aria-hidden="true"><span style={{width:((active+1)/steps.length*100)+'%'}}/></div>
   </figure>
   <div className="tour-chapters">{steps.map((s,i)=><article id={'tour-'+s.image} data-tour-step={i} data-active={active===i} key={s.name} tabIndex={-1}><span className="eyebrow">{String(i+1).padStart(2,'0')} / {s.name.toUpperCase()}</span><h3>{s.title}</h3><p>{s.copy}</p><figure className="tour-inline product-capture"><Image unoptimized src={'/marketing/'+s.image+'.webp'} alt={'Real Pathly '+s.name+' interface with illustrative records.'} width={s.width} height={s.height} loading="lazy"/><figcaption>Real Pathly interface · Illustrative records</figcaption></figure></article>)}</div>
  </div>
 </section>
}
