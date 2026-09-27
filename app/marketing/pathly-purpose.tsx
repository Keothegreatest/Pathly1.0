import {profilePathways} from '../pathways';
import Image from 'next/image';
export default function PathlyPurpose(){return <section className="pathly-purpose editorial-section" id="about">
 <span className="eyebrow">WHY PATHLY EXISTS</span><h2>The work was always connected.<br/>The tools <em>weren’t.</em></h2>
 <div className="purpose-body"><p>Years of experiences, requirements, school research, and meaningful moments shouldn’t end up scattered across spreadsheets, notes, tabs, and memory.</p><div><p>Pathly was created to give that journey one organized home.</p><p>We’re building a clearer way to understand where you’ve been, where you stand, and what deserves your attention next.</p></div></div>
 <div className="pathly-pathways"><span className="eyebrow">FOR YOUR PATH INTO HEALTHCARE</span><ul>{profilePathways.map(path=><li key={path}>{path}</li>)}</ul><p>Organize your own pathway. Verify specific requirements with each program.</p></div>
 <figure className="purpose-product product-capture editorial-reveal"><Image unoptimized src="/marketing/application.webp" width={1089} height={783} loading="lazy" alt="Application preparation in Pathly, showing documented experience, letters, schools, writing and next steps."/><figcaption>Your path is yours. Pathly helps make it clear. · Illustrative records</figcaption></figure>
</section>}
