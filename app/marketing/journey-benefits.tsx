import Image from 'next/image';
import {ArrowDown,ArrowRight} from 'lucide-react';

const questions=['Did I ever log those clinical hours?','What am I missing for this school?','Where did I save that reflection?','What should I work on next?'];
export function ClarityBenefits(){return <section className="clarity-benefits editorial-section" data-scroll-scene="questions">
 <div><span className="eyebrow">RECOGNITION, THEN RELIEF.</span><h2>Because “Am I doing enough?” shouldn’t be this hard to <em>answer.</em></h2><p>You don’t need every answer today. Begin with what you’ve documented and what still needs attention.</p></div>
 <div className="questions-to-clarity"><ol>{questions.map(question=><li key={question}>{question}</li>)}</ol><p className="clarity-payoff">Pathly helps turn a scattered journey into something you can actually see.</p><figure className="product-capture"><Image unoptimized src="/marketing/goals.webp" alt="A real Pathly goal, with progress connected to documented experiences." width={536} height={264} loading="lazy"/><figcaption>Goal progress · Illustrative records</figcaption></figure></div>
</section>}

const stages=[
 ['Experiences','Record the work you’re doing.'],
 ['Reflections','Keep what you’re learning.'],
 ['Goals','Give your priorities a direction.'],
 ['School requirements','Bring preparation into focus.'],
 ['Application readiness','See what you’ve documented.'],
 ['Next Best Actions','Choose a useful next step.'],
];
export function ConnectedJourney(){return <section className="connected-journey editorial-section editorial-reveal" aria-labelledby="connected-journey-title">
 <span className="eyebrow">PATHLY CONNECTS THE JOURNEY</span><div className="connected-journey-intro"><h2 id="connected-journey-title">Your journey is connected.<br/>Your tools should be <em>too.</em></h2><p>Pathly turns the pieces of your pre-health journey into one connected workspace, so the work you do today helps inform what comes next.</p></div>
 <ol className="connected-journey-flow">{stages.map(([title,copy],index)=><li key={title}><span className="flow-marker" aria-hidden="true">{String(index+1).padStart(2,'0')}</span><h3>{title}</h3><p>{copy}</p>{index<stages.length-1&&<ArrowRight className="flow-arrow" size={17} aria-hidden="true"/>}</li>)}</ol>
</section>}

export function WorkspaceComparison(){return <section className="workspace-comparison editorial-section" data-scroll-scene="comparison" aria-labelledby="comparison-heading">
 <span className="eyebrow">A FAMILIAR PRE-HEALTH STORY</span><h2 id="comparison-heading">Everything was there.<br/>Just not in the <em>same place.</em></h2>
 <p className="illustrative-label">An illustrative workflow, not a student testimonial.</p>
 <div className="comparison-layout">
  <div className="comparison-before"><h3>Before Pathly</h3><p>Pieces spread across your day.</p><ul>{['Spreadsheet · Clinical hours','Notes · Reflections','Saved tabs · School requirements','Calendar · Deadlines','Docs · Application ideas','Memory · Everything else'].map(item=><li key={item}>{item}</li>)}</ul></div>
  <span className="comparison-direction" aria-hidden="true"><ArrowRight className="comparison-horizontal" size={24}/><ArrowDown className="comparison-vertical" size={24}/></span>
  <div className="comparison-after"><h3>With Pathly</h3><p>One connected workspace.</p><ul>{['Experiences','Schools','Reflections','Goals','Application','Next Best Actions'].map(item=><li key={item}>{item}</li>)}</ul><span className="comparison-note">The work didn’t change. The way you could see it did.</span></div>
 </div>
</section>}
