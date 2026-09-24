import {getChatGPTUser} from '../chatgpt-auth';
import {redirect} from 'next/navigation';
import {WelcomeScreen} from '../entry-screen';
export const dynamic = 'force-dynamic';
export default async function LoginPage() {
  const user = await getChatGPTUser();
  if (user) redirect('/');
  return <WelcomeScreen/>;
}
