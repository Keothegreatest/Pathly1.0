import {getUser} from '@/app/auth';
import {database} from '@/db/raw';

/** Idempotent and account-scoped. Replaying never resets completion. */
export async function PUT(request: Request) {
  const user = await getUser();
  if (!user) return Response.json({error:'Sign in to save your preferences.'},{status:401});
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return Response.json({error:'Request origin not allowed.'},{status:403});
  let body: unknown;
  try { body = await request.json(); } catch { return Response.json({error:'Invalid preference request.'},{status:400}); }
  if (!body || typeof body !== 'object' || !('hasCompletedOnboarding' in body) || body.hasCompletedOnboarding !== true || !('outcome' in body) || (body.outcome !== 'completed' && body.outcome !== 'skipped')) {
    return Response.json({error:'Choose a valid tutorial outcome.'},{status:400});
  }
  try {
    const now = new Date().toISOString();
    const id = 'preferences:' + user.userId;
    // Only this endpoint writes this reserved record kind; concurrent completions are harmless.
    await database().prepare('INSERT INTO records (id,owner,kind,data,version,updated) VALUES (?,?,?,?,1,?) ON CONFLICT(id) DO NOTHING')
      .bind(id,user.userId,'preferences',JSON.stringify({hasCompletedOnboarding:true,outcome:body.outcome,completedAt:now}),now).run();
    return Response.json({hasCompletedOnboarding:true},{headers:{'Cache-Control':'no-store'}});
  } catch {
    return Response.json({error:'We couldn’t save your tutorial preference. Try again, or close for now.'},{status:503});
  }
}

