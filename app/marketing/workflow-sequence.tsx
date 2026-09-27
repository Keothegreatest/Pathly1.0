const steps=[
 ['Capture','Log experiences, coursework notes, and milestones while the details are fresh.'],
 ['Organize','Keep experiences, reflections, schools, and requirements connected.'],
 ['Prioritize','Review next actions grounded in the records and goals you’ve saved.'],
 ['Prepare','Return to your experiences and reflections when application writing begins.'],
];
export default function WorkflowSequence(){return <ol className="workflow-sequence" aria-label="How your Pathly journey connects">{steps.map(([title,description],i)=><li key={title}><span aria-hidden="true">0{i+1}</span><div><h3>{title}</h3><p>{description}</p></div></li>)}</ol>}
