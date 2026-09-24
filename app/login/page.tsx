import {getUser} from '../auth';
import {redirect} from 'next/navigation';
import {WelcomeScreen} from '../entry-screen';
export const dynamic = 'force-dynamic';
const errors:Record<string,string>={configuration:'Google sign-in is not ready yet. Please contact the site owner.',cancelled:'Google sign-in was cancelled. You can try again when you’re ready.',expired:'This sign-in request expired. Please start again.',failed:'We couldn’t complete Google sign-in. Please try again.'};
export default async function LoginPage({searchParams}:{searchParams:Promise<{error?:string}>}) {
  const user = await getUser();
  if (user) redirect('/');
  const {error}=await searchParams;
  return <WelcomeScreen error={error?errors[error]||errors.failed:undefined}/>;
}

