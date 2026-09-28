# Supabase preparation — not deployed

Pathly still uses IndexedDB on this browser. There is no configured Supabase project, Auth integration, client library, or production database connection in this repository. RLS is **not active in production**. This directory is an inactive schema proposal and database integration test, not a storage migration performed on any user data.

## Apply and verify in a disposable environment

1. Install the Supabase CLI, run `supabase init` in a scratch checkout if needed, then `supabase start`.
2. Run `supabase migration new pathly_workspace`. Copy `schema.sql` into that CLI-generated migration filename. No fabricated migration timestamp/history is committed here.
3. Apply with `supabase db reset` against the local development database. This is destructive to that local database; never use production for these tests.
4. Run `psql "$LOCAL_DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/tests/ownership.sql`. It uses database-owner access only to create transactional test users, then explicitly switches to `authenticated` and `anon`. All fixtures are rolled back.
5. Review grants, policies, existing public-schema objects, and test real Auth sessions through the Data API before a separate production rollout. These tests have not run here: no Supabase project or Postgres runtime is available.

Future client configuration needs `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Neither is populated, and the current app does not read them. Never put a service-role/secret key in client code, a NEXT_PUBLIC variable, or this repository. Database owner connection strings belong only in local test environments/CI secrets.

## Ownership and boundary

- `workspace_records` preserves the current Entry shape (id, kind, data, version, updated). Its composite primary key is indexed by user_id. One profile per user is enforced.
- Preferences and conversation are one row per Auth UUID; their primary keys index ownership.
- Each table has a UUID owner referencing Auth, default auth.uid(), explicit authenticated CRUD policies, UPDATE USING and WITH CHECK, RLS/FORCE RLS, and no anonymous/public grants. No permissive true policies.
- No views, RPCs, custom functions, storage buckets, or global tables are introduced. Audit existing objects on the target project before rollout; any future view should use security_invoker and any attachment bucket needs its own ownership policies.
- Public story fixtures and artwork remain static files. Marketing never reads personal storage or the proposed database.

## Still required before cloud storage

Implement real Auth and session handling, an authenticated adapter, opt-in browser-record import/export, optimistic concurrency with an atomic version predicate, validation equivalent to `browser-records.ts`, and same-owner link validation for JSON record references. The schema does not validate application-level JSON links by itself. No records should be imported until those checks and two-user end-to-end tests pass. Clearing browser storage still removes current records; existing export guidance remains accurate.

References: [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), [API grants and security](https://supabase.com/docs/guides/api/securing-your-api).
