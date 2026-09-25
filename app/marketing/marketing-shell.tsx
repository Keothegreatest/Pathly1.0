'use client';
import Image from 'next/image';
import Link from 'next/link';
import {useRef,useState} from 'react';
import {Menu,X,ArrowUpRight} from 'lucide-react';
const links=[['How it works','/#how-it-works'],['For students','/#for-students'],['Resources','/help']];
export function MarketingBrand(){return <Link className="company-brand" href="/" aria-label="Pathly home"><span className="brand-artwork"><Image unoptimized src="/pathly-brand.png" alt="Pathly" width={2508} height={627}/></span><span className="company-tagline">Your Path, Made Clear.</span></Link>}
export function MarketingNavbar(){
 const [open,setOpen]=useState(false),toggle=useRef<HTMLButtonElement>(null);
 return <header className="marketing-nav" onKeyDown={e=>{if(e.key==='Escape'&&open){setOpen(false);toggle.current?.focus()}}}>
  <MarketingBrand/>
  <nav aria-label="Website navigation">{links.map(([title,url])=><a href={url} key={url}>{title}</a>)}</nav>
  <div className="marketing-nav-actions"><a className="marketing-open" href="/login">Sign in</a><a className="primary" href="/signup">Get started<ArrowUpRight size={14}/></a><button ref={toggle} className="icon-button mobile-menu-toggle" aria-label={open?'Close navigation':'Open navigation'} aria-expanded={open} aria-controls="marketing-mobile-nav" onClick={()=>setOpen(!open)}>{open?<X size={21}/>:<Menu size={21}/>}</button></div>
  {open&&<nav id="marketing-mobile-nav" className="marketing-mobile-nav" aria-label="Mobile website navigation">{links.map(([title,url])=><a href={url} key={url} onClick={()=>setOpen(false)}>{title}</a>)}<a href="/login">Sign in</a></nav>}
 </header>
}
const groups=[
 {title:'Product',links:[['How it works','/#how-it-works'],['Open Pathly','/app']]},
 {title:'Resources',links:[['Help & getting started','/help'],['Example workspace','/#software']]},
 {title:'Company',links:[['Our purpose','/#about'],['For students','/#for-students']]},
 {title:'Legal',links:[['Privacy','/privacy'],['Terms','/terms']]},
];
export function MarketingFooter(){return <footer className="marketing-footer editorial-footer"><MarketingBrand/><nav aria-label="Footer">{groups.map(group=><div key={group.title}><h2>{group.title}</h2>{group.links.map(([title,url])=><a key={url} href={url}>{title}</a>)}</div>)}</nav><div className="footer-bottom"><span>Built around the way a pre-health journey actually unfolds.</span><span>Planning support. Always your decisions.</span></div></footer>}
