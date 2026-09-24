'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Home, BriefcaseBusiness, GraduationCap, FileText, Flag, X, Plus, ArrowRight } from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';

export const navigation = [
  ['Home', Home],
  ['Experiences', BriefcaseBusiness],
  ['Schools', GraduationCap],
  ['Application', FileText],
  ['Goals', Flag],
] as const;

export function PathlyBrand({ compact = false, onHome }: { compact?: boolean; onHome: () => void }) {
  return (
    <Link
      className={`pathly-brand${compact ? ' pathly-brand--compact' : ''}`}
      href="/"
      aria-label="Pathly home"
      onClick={(event) => { event.preventDefault(); onHome(); }}
    >
      <span className="brand-artwork">
        <Image unoptimized src="/pathly-brand.png" alt="Pathly" width={2508} height={627} />
      </span>

    </Link>
  );
}

export function WorkflowNavigation({
  page,
  experienceCount,
  schoolCount,
  onNavigate,
}: {
  page: string;
  experienceCount: number;
  schoolCount: number;
  onNavigate: (page: string) => void;
}) {
  const { setOpenMobile } = useSidebar();
  const counts: Record<string, number> = { Experiences: experienceCount, Schools: schoolCount };
  return (
    <nav className="workspace-navigation" id="pathly-navigation" aria-label="Workspace">
      <div className="workspace-label">Your workspace</div>
      <SidebarMenu>
        {navigation.map(([label, Icon]) => (
          <SidebarMenuItem key={label}>
            <SidebarMenuButton
              className="workspace-nav-item"
              data-tour-target={label}
              aria-label={label}
              aria-current={page === label ? 'page' : undefined}
              isActive={page === label}
              onClick={() => { onNavigate(label); setOpenMobile(false); }}
            >
              <span className="nav-icon" aria-hidden="true"><Icon size={18} strokeWidth={1.65} /></span>
              <span className="nav-label">{label}</span>
              {counts[label] !== undefined && (
                <span className="nav-count" aria-hidden="true" title={`${counts[label]} saved ${label.toLowerCase()}`}>
                  {counts[label].toLocaleString()}
                </span>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </nav>
  );
}

export function AppHeader({
  page,
  pathway,
  chapter,
  onHome,
  onCapture,
}: {
  page: string;
  pathway: string;
  chapter: string;
  onCapture:()=>void;
  onHome: () => void;
}) {
  const { openMobile } = useSidebar();
  return (
    <header className="topbar">
      <div className="header-navigation">
        <SidebarTrigger
          className="app-menu-control"
          aria-label="Open navigation"
          aria-expanded={openMobile}
          aria-controls="pathly-navigation"
        />
        <div className="mobile-brand-lockup"><PathlyBrand compact onHome={onHome} /></div>
        <span className="breadcrumb-label">My Pathly</span>
        <span className="breadcrumb-divider" aria-hidden="true">/</span>
        <span className="header-page-context" aria-current="page">{page}</span>
      </div>
      <div className="header-context"><span className="path-badge">{chapter}{pathway&&<><span aria-hidden="true">/</span>{pathway}</>}</span><button className="header-capture" onClick={onCapture}>Capture</button></div>
    </header>
  );
}

export function MobileNavigationClose(){const {setOpenMobile}=useSidebar();return <button className="mobile-nav-close" aria-label="Close navigation" onClick={()=>setOpenMobile(false)}><X size={20}/></button>;}

export function SidebarCaptureActions({onCapture,onInbox}:{onCapture:()=>void;onInbox:()=>void}) {
  const {setOpenMobile}=useSidebar();
  return <><button onClick={()=>{setOpenMobile(false);onCapture()}}><Plus size={16}/>Capture a thought</button><button onClick={()=>{setOpenMobile(false);onInbox()}}>Saved thoughts<ArrowRight size={15}/></button></>;
}
