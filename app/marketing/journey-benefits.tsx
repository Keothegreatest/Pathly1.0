import {ArrowDown,ArrowRight} from 'lucide-react';

const questions=[
 ['Am I doing enough?','See the experiences and preparation you’ve documented, without turning your journey into a score.'],
 ['What am I forgetting?','Keep requirements, reflections, and open tasks in view instead of in your head.'],
 ['Am I on track?','Compare your documented progress with the goals and target dates you’ve chosen.'],
 ['What should I focus on next?','Return to specific next steps grounded in what you’ve saved.'],
];
export function ClarityBenefits(){return <section className="clarity-benefits editorial-section editorial-reveal" id="about">
 <div><span className="eyebrow">LESS GUESSING.</span><h2>Know what you’ve done.<br/>Know what’s missing.<br/>Know what to do <em>next.</em></h2><p>You don’t need every answer today. Start with a clearer picture of what you’ve recorded and what still needs your attention.</p></div>
 <dl>{questions.map(([question,answer])=><div key={question}><dt>{question}</dt><dd>{answer}</dd></div>)}</dl>
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

export function WorkspaceComparison(){return <section className="workspace-comparison editorial-section editorial-reveal" aria-labelledby="comparison-heading">
 <span className="eyebrow">FEWER PLACES TO LOOK. MORE CLARITY.</span><h2 id="comparison-heading">The same journey.<br/>A clearer way to <em>keep it.</em></h2>
 <div className="comparison-layout">
  <div className="comparison-before"><h3>Before Pathly</h3><p>Pieces spread across your day.</p><ul>{['Spreadsheet','Notes app','Saved tabs','Calendar reminders','School requirement pages','Mental reminders'].map(item=><li key={item}>{item}</li>)}</ul></div>
  <span className="comparison-direction" aria-hidden="true"><ArrowRight className="comparison-horizontal" size={24}/><ArrowDown className="comparison-vertical" size={24}/></span>
  <div className="comparison-after"><h3>With Pathly</h3><p>One connected workspace.</p><ul>{['Experiences','Goals','Schools','Requirements','Reflections','Application planning'].map(item=><li key={item}>{item}</li>)}</ul><span className="comparison-note">The details stay connected to the bigger picture.</span></div>
 </div>
</section>}
