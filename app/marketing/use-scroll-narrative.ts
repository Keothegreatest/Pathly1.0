'use client';
import {useEffect,type RefObject} from 'react';

/** One passive listener, one queued frame, and only visible scenes are measured. */
export function useScrollNarrative(root:RefObject<HTMLDivElement|null>){
 useEffect(()=>{
  const element=root.current;if(!element)return;
  const scenes=[...element.querySelectorAll<HTMLElement>('[data-scroll-scene]')];
  const media=matchMedia('(min-width: 1000px) and (prefers-reduced-motion: no-preference)');
  const visible=new Set<HTMLElement>();let frame=0;
  const update=()=>{
   frame=0;if(!media.matches)return;
   const measurements=[...visible].map(scene=>{
    const rect=scene.getBoundingClientRect();
    const progress=scene.dataset.scrollScene==='pinned'
     ? (100-rect.top)/Math.max(1,rect.height-innerHeight+100)
     : (innerHeight*.85-rect.top)/Math.max(1,rect.height*.65+innerHeight*.2);
    return {scene,progress:Math.max(0,Math.min(1,progress))};
   });
   measurements.forEach(({scene,progress})=>scene.style.setProperty('--story-progress',progress.toFixed(4)));
  };
  const schedule=()=>{if(media.matches&&!frame)frame=requestAnimationFrame(update)};
  const observer=new IntersectionObserver(entries=>{
   entries.forEach(entry=>{const node=entry.target as HTMLElement;if(entry.isIntersecting)visible.add(node);else visible.delete(node)});
   schedule();
  },{rootMargin:'100px'});
  scenes.forEach(scene=>observer.observe(scene));
  const configure=()=>{
   element.setAttribute('data-motion',media.matches?'scroll':'still');
   if(!media.matches){cancelAnimationFrame(frame);frame=0;scenes.forEach(scene=>scene.style.removeProperty('--story-progress'))}
   else schedule();
  };
  configure();media.addEventListener('change',configure);
  addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule,{passive:true});
  return()=>{observer.disconnect();cancelAnimationFrame(frame);media.removeEventListener('change',configure);removeEventListener('scroll',schedule);removeEventListener('resize',schedule);element.removeAttribute('data-motion')};
 },[root]);
}
