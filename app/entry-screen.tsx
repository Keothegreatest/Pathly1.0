'use client';
import Image from 'next/image';

export function AccountLoading() {
  return <main className="entry-screen account-loading" aria-busy="true"><div className="loading-lockup">
    <span className="loading-artwork"><Image unoptimized src="/pathly-brand.png" width={2508} height={627} alt="Pathly" /></span>
    <div className="loading-dots" aria-hidden="true"><i/><i/><i/></div>
    <p role="status">Opening your workspace…</p>
  </div></main>;
}

/** Dispatch-owned authentication remains the only configured identity provider. */
export function WelcomeScreen({error, onRetry}: {error?:string; onRetry?:()=>void}) {
  return <main className="entry-screen"><div className="entry-column">
    <Image unoptimized className="entry-logo" src="/pathly-brand.png" width={2508} height={627} alt="Pathly" />
    <section className="entry-card"><h1>Welcome to Pathly</h1>
      <p>Your experiences, reflections, and next steps. Together in one personal workspace.</p>
      {error ? <><p className="error" role="alert">{error}</p><button className="primary" onClick={onRetry}>Try again</button></> : <a className="primary" href="/signin-with-chatgpt?return_to=/" target="_top">Continue with ChatGPT</a>}
      <small>Use the account connected to your Pathly workspace.</small>
    </section>
  </div></main>;
}
