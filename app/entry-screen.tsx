'use client';
import Image from 'next/image';
import {useState} from 'react';

export function AccountLoading() {
  return <main className="entry-screen account-loading" aria-busy="true"><div className="loading-lockup">
    <span className="loading-artwork"><Image unoptimized src="/pathly-brand.png" width={2508} height={627} alt="Pathly" /></span>
    <div className="loading-dots" aria-hidden="true"><i/><i/><i/></div>
    <p role="status">Opening your workspace…</p>
  </div></main>;
}

/** Google authorization is completed on the server. */
export function WelcomeScreen({error, onRetry}: {error?:string; onRetry?:()=>void}) {
  const [pending,setPending]=useState(false);
  return <main className="entry-screen"><div className="entry-column">
    <Image unoptimized className="entry-logo" src="/pathly-brand.png" width={2508} height={627} alt="Pathly" />
    <section className="entry-card"><h1>Welcome to Pathly</h1>
      <p>Your experiences, reflections, and next steps. Together in one personal workspace.</p>
      {error&&<p className="error" role="alert">{error}</p>}
      {onRetry?<button className="primary" onClick={onRetry}>Try again</button>:<form action="/api/auth/google" method="GET" onSubmit={()=>setPending(true)}><button className="primary" type="submit" disabled={pending} aria-busy={pending}>{pending?'Connecting to Google…':'Continue with Google'}</button></form>}
      <small>Sign in or create your workspace with your Google account.</small>
    </section>
  </div></main>;
}

