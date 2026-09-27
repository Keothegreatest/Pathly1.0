import PublicDocument from '../public-document';
import Link from 'next/link';
export default function MissingStory(){return <PublicDocument title="We couldn’t find that student story."><p>This story may have moved. <Link href="/stories">Explore all student stories</Link> to find another path.</p></PublicDocument>}
