'use client';
import Image from 'next/image';
import {useState} from 'react';
const points=[
 {name:'Experiences',copy:'Your roles, hours, reflections, and meaningful moments.',left:2,top:16,width:15,height:8},
 {name:'Application readiness',copy:'Preparation by area, based on what you’ve documented.',left:66,top:22,width:31,height:39},
 {name:'Next Best Actions',copy:'Specific priorities with context and a place to begin.',left:20,top:22,width:46,height:31},
 {name:'Goals',copy:'Upcoming priorities and target dates, kept in view.',left:66,top:61,width:31,height:23},
];
export default function ProductReveal(){
 const [active,setActive]=useState(2);
 return <section className="product-reveal editorial-section chapter-wide" data-scroll-scene="reveal" aria-labelledby="product-reveal-title">
  <div className="reveal-intro"><div><span className="eyebrow">MEET PATHLY</span><h2 id="product-reveal-title">One place to know where you stand.</h2></div><p>Pathly connects your experiences, goals, school requirements, reflections, and application progress so you can see what’s done, what may still need attention, and what comes next.</p></div>
  <div className="reveal-media">
   <figure className="product-capture"><div className="annotated-product"><Image unoptimized src="/marketing/home.webp" width={1440} height={1060} loading="lazy" alt="Pathly Home showing the student's documented experiences, application readiness, next actions and upcoming goals."/><span className="product-spotlight" aria-hidden="true" style={{left:points[active].left+'%',top:points[active].top+'%',width:points[active].width+'%',height:points[active].height+'%'}}/></div><figcaption>Real Pathly interface · Illustrative records</figcaption></figure>
  </div>
  <div className="reveal-callouts" aria-label="Explore the dashboard">{points.map((point,i)=><button key={point.name} aria-pressed={active===i} aria-describedby="reveal-description" onMouseEnter={()=>setActive(i)} onFocus={()=>setActive(i)} onClick={()=>setActive(i)}>{point.name}</button>)}</div>
  <p id="reveal-description" className="reveal-description">{points[active].copy}</p>
 </section>
}
