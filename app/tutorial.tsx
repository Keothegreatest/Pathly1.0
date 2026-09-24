'use client';
import {workspaceRequest} from './browser-workspace';

import {useEffect,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import {ArrowRight,BookOpen,Home,BriefcaseBusiness,GraduationCap,FileText,Flag,Check} from 'lucide-react';
import {Dialog,DialogContent,DialogTitle,DialogDescription} from '@/components/ui/dialog';
import {DropdownMenuItem} from '@/components/ui/dropdown-menu';
import {useSidebar} from '@/components/ui/sidebar';
import {tutorialPosition} from './tutorial-position';

const steps = [
  {page:'Home',title:'Welcome to your Pathly workspace',copy:'Organize your pre-health journey, keep the details that matter, and understand what to focus on next. Here’s a quick look around.',hint:'A short tour. Go at your own pace, or skip whenever you’re ready.',icon:BookOpen},
  {page:'Home',title:'Start with what matters now',copy:'Home connects your progress with Your Next Best Actions. Each recommendation explains the saved information behind it and takes you to the next useful step.',hint:'Your recommendations grow as you add real experiences, schools, and goals.',icon:Home},
  {page:'Experiences',title:'Keep more than a record of hours',copy:'Add clinical work, research, volunteering, leadership, employment, shadowing, and other experiences. Link reflections and Story Moments to preserve details for future applications.',hint:'Start with an experience name. Add the deeper details when you’re ready.',icon:BriefcaseBusiness},
  {page:'Schools',title:'Give your school list a purpose',copy:'Organize programs you’re interested in, capture deadlines, and track requirements with official sources. Pathly brings unresolved recorded requirements back to Home.',hint:'Requirements are based on information you enter and verify—not predicted admission chances.',icon:GraduationCap},
  {page:'Application',title:'See how your preparation connects',copy:'Review readiness across the areas of your application. Organize tasks, activities, letters, and writing while keeping your original experiences intact.',hint:'Readiness reflects your documented preparation, not how likely you are to be accepted.',icon:FileText},
  {page:'Goals',title:'Turn intentions into manageable steps',copy:'Set a target, choose a date, and connect a goal to an experience. Linked hours goals can update as your experience grows.',hint:'Priorities can change. Your plan can change with them.',icon:Flag},
  {page:'Home',title:'You’re ready to get started',copy:'Add your first experience or explore your dashboard. A small beginning is enough—your workspace grows with your journey.',hint:'You can replay this tour from Settings & Help at any time.',icon:Check},
] as const;

export function Tutorial({replay,onNavigate,onClose}: {
  replay:boolean; onNavigate:(page:string)=>void; onClose:()=>void;
}) {
  const [step,setStep]=useState(0),[saving,setSaving]=useState(false),[error,setError]=useState('');
  const [target,setTarget]=useState<{left:number;top:number;width:number;height:number}|null>(null);
  const [position,setPosition]=useState<ReturnType<typeof tutorialPosition>|null>(null);
  const busy=useRef(false),title=useRef<HTMLHeadingElement>(null),panel=useRef<HTMLDivElement>(null);
  const navigate=useRef(onNavigate);useEffect(()=>{navigate.current=onNavigate},[onNavigate]);
  const current=steps[step],Icon=current.icon;
  const positioned=position!==null;
  useEffect(()=>{if(positioned)title.current?.focus({preventScroll:true})},[positioned,step]);
  useEffect(()=>{
    navigate.current(current.page);
    window.scrollTo({top:0,behavior:'instant'});
    title.current?.focus({preventScroll:true});
    const measure=()=>{
      const sidebarElement=document.querySelector<HTMLElement>('[data-slot="sidebar-container"]');
      const sidebarRect=sidebarElement?.getBoundingClientRect();
      const sidebar=sidebarRect&&sidebarRect.width>0&&sidebarRect.right>0&&sidebarElement?.getClientRects().length?sidebarRect:null;
      const selector=sidebar?`[data-tour-target="${current.page}"]`:'.header-page-context';
      const element=document.querySelector<HTMLElement>(selector);
      const rect=element?.getBoundingClientRect();
      setTarget(step>0&&step<steps.length-1&&rect?{left:rect.left-4,top:rect.top-4,width:rect.width+8,height:rect.height+8}:null);
      const height=panel.current?.offsetHeight||400;
      const focused=step>0&&step<steps.length-1?rect:null;
      setPosition(tutorialPosition({width:document.documentElement.clientWidth,height:innerHeight},sidebar?.right??null,focused??null,height));
    };
    const frame=requestAnimationFrame(measure);
    const observer=new ResizeObserver(measure);if(panel.current)observer.observe(panel.current);
    // Follow responsive layout and token-driven sidebar width changes, too.
    for(const selector of ['[data-slot="sidebar-container"]','.main']){
      const element=document.querySelector(selector);if(element)observer.observe(element);
    }
    addEventListener('resize',measure);
    return()=>{cancelAnimationFrame(frame);observer.disconnect();removeEventListener('resize',measure)};
  },[step,current.page]);

  async function finish(outcome:'completed'|'skipped') {
    if(busy.current)return;
    if(replay){navigate.current('Home');onClose();return;}
    busy.current=true;setSaving(true);setError('');
    try {
      const response=await workspaceRequest('/api/preferences',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({hasCompletedOnboarding:true,outcome}),signal:AbortSignal.timeout(10000)});
      if(!response.ok)throw new Error('We couldn’t save your tutorial preference. Try again, or close for now.');
      navigate.current('Home');onClose();
    } catch {setError('We couldn’t save your tutorial preference. Try again, or close for now. It may appear again next time.');}
    finally {busy.current=false;setSaving(false);}
  }
  const exit=()=>{if(error){onClose();return;}void finish('skipped')};
  return <>
    {target&&createPortal(<div className="tutorial-spotlight" aria-hidden="true" style={target}/>,document.body)}
    <Dialog open onOpenChange={open=>{if(!open)exit()}}>
      <DialogContent ref={panel} className={'tutorial-panel'+(position?' tutorial-contextual':'')} style={position?{...position,'--tour-width':position.width+'px'} as React.CSSProperties:{visibility:'hidden'}} showCloseButton={false} onOpenAutoFocus={e=>{e.preventDefault();title.current?.focus()}} onCloseAutoFocus={e=>{e.preventDefault();document.querySelector<HTMLHeadingElement>('.heading h1')?.focus()}} onInteractOutside={e=>e.preventDefault()}>
        <div className="tutorial-topline"><span className="eyebrow">YOUR PATHLY WORKSPACE</span><button className="text-button" onClick={exit} disabled={saving}>Skip tutorial</button></div>
        <div className="tutorial-copy" key={step}>
          <span className="tutorial-icon" aria-hidden="true"><Icon size={24} strokeWidth={1.5}/></span>
          <DialogTitle ref={title} tabIndex={-1}>{current.title}</DialogTitle>
          <DialogDescription>{current.copy}</DialogDescription>
          <p className="tutorial-hint">{current.hint}</p>
        </div>
        {error&&<div role="alert" className="error">{error}<button className="text-button" onClick={onClose}>Close for now</button></div>}
        <div className="tutorial-progress" aria-label={`Step ${step+1} of ${steps.length}`}><span aria-live="polite">{step+1} of {steps.length}</span><div aria-hidden="true">{steps.map((_,i)=><i key={i} data-complete={i<=step}/>)}</div></div>
        <div className="tutorial-actions"><button className="secondary" disabled={step===0||saving} onClick={()=>setStep(s=>s-1)}>Back</button><button className="primary" disabled={saving} onClick={()=>step===steps.length-1?void finish('completed'):setStep(s=>s+1)}>{saving?'Saving…':step===steps.length-1?'Get Started':'Next'}{!saving&&<ArrowRight size={16}/>}</button></div>
      </DialogContent>
    </Dialog>
  </>;
}

export function HelpDialog({onClose,onReplay}:{onClose:()=>void;onReplay:()=>void}) {
  return <Dialog open onOpenChange={open=>{if(!open)onClose()}}><DialogContent className="help-panel"><DialogTitle>Settings & Help</DialogTitle><DialogDescription>Get familiar with your personal workspace.</DialogDescription><section><h3>Help</h3><p>Take a short walkthrough of Home, Experiences, Schools, Application, and Goals.</p><button className="secondary" onClick={onReplay}><BookOpen size={16}/>Replay tutorial</button></section></DialogContent></Dialog>;
}

export function TutorialHelpMenuItem({onOpen}:{onOpen:()=>void}) {
  const {setOpenMobile}=useSidebar();
  return <DropdownMenuItem onSelect={()=>{setOpenMobile(false);onOpen()}}>Settings &amp; Help</DropdownMenuItem>;
}

