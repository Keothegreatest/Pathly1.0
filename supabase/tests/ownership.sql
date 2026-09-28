-- Run ONLY against disposable local Supabase after applying schema.sql.
-- psql "$LOCAL_DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/tests/ownership.sql
-- Fixtures roll back. Claims and roles simulate real Data API database access.
begin;
insert into auth.users(id) values ('10000000-0000-4000-8000-000000000001'), ('20000000-0000-4000-8000-000000000002');
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"10000000-0000-4000-8000-000000000001","role":"authenticated"}', true);
insert into public.workspace_records(id,kind,data) values ('record-a','experience','{"title":"A"}');
insert into public.workspace_preferences default values;
insert into public.workspace_conversations default values;
select set_config('request.jwt.claims', '{"sub":"20000000-0000-4000-8000-000000000002","role":"authenticated"}', true);
insert into public.workspace_records(id,kind,data) values ('record-b','experience','{"title":"B"}');
insert into public.workspace_preferences default values;
insert into public.workspace_conversations default values;
do $$ begin
 begin
  insert into public.workspace_records(user_id,id,kind) values ('10000000-0000-4000-8000-000000000001','spoof','experience');
  raise exception 'FAIL: B spoofed A ownership in workspace_records';
 exception when insufficient_privilege then null; end;
end $$;
do $$ begin
 begin
  insert into public.workspace_preferences(user_id) values ('10000000-0000-4000-8000-000000000001');
  raise exception 'FAIL: B spoofed A ownership in workspace_preferences';
 exception when insufficient_privilege then null; end;
end $$;
do $$ begin
 begin
  insert into public.workspace_conversations(user_id) values ('10000000-0000-4000-8000-000000000001');
  raise exception 'FAIL: B spoofed A ownership in workspace_conversations';
 exception when insufficient_privilege then null; end;
end $$;
select set_config('request.jwt.claims', '{"sub":"10000000-0000-4000-8000-000000000001","role":"authenticated"}', true);
do $$ declare n integer; begin
 select count(*) into n from public.workspace_records;
 if n <> 1 then raise exception 'FAIL: SELECT isolation workspace_records'; end if;
 select count(*) into n from public.workspace_records where user_id = '20000000-0000-4000-8000-000000000002';
 if n <> 0 then raise exception 'FAIL: A read B workspace_records'; end if;
 update public.workspace_records set updated = now() where user_id = '20000000-0000-4000-8000-000000000002';
 get diagnostics n = row_count;
 if n <> 0 then raise exception 'FAIL: A updated B workspace_records'; end if;
 delete from public.workspace_records where user_id = '20000000-0000-4000-8000-000000000002';
 get diagnostics n = row_count;
 if n <> 0 then raise exception 'FAIL: A deleted B workspace_records'; end if;
 update public.workspace_records set updated = now() where user_id = '10000000-0000-4000-8000-000000000001';
 get diagnostics n = row_count;
 if n <> 1 then raise exception 'FAIL: own UPDATE workspace_records'; end if;
 begin
  update public.workspace_records set user_id = '20000000-0000-4000-8000-000000000002' where user_id = '10000000-0000-4000-8000-000000000001';
  raise exception 'FAIL: owner reassignment workspace_records';
 exception when insufficient_privilege then null; end;
 delete from public.workspace_records where user_id = '10000000-0000-4000-8000-000000000001';
 get diagnostics n = row_count;
 if n <> 1 then raise exception 'FAIL: own DELETE workspace_records'; end if;
end $$;
do $$ declare n integer; begin
 select count(*) into n from public.workspace_preferences;
 if n <> 1 then raise exception 'FAIL: SELECT isolation workspace_preferences'; end if;
 select count(*) into n from public.workspace_preferences where user_id = '20000000-0000-4000-8000-000000000002';
 if n <> 0 then raise exception 'FAIL: A read B workspace_preferences'; end if;
 update public.workspace_preferences set updated = now() where user_id = '20000000-0000-4000-8000-000000000002';
 get diagnostics n = row_count;
 if n <> 0 then raise exception 'FAIL: A updated B workspace_preferences'; end if;
 delete from public.workspace_preferences where user_id = '20000000-0000-4000-8000-000000000002';
 get diagnostics n = row_count;
 if n <> 0 then raise exception 'FAIL: A deleted B workspace_preferences'; end if;
 update public.workspace_preferences set updated = now() where user_id = '10000000-0000-4000-8000-000000000001';
 get diagnostics n = row_count;
 if n <> 1 then raise exception 'FAIL: own UPDATE workspace_preferences'; end if;
 begin
  update public.workspace_preferences set user_id = '20000000-0000-4000-8000-000000000002' where user_id = '10000000-0000-4000-8000-000000000001';
  raise exception 'FAIL: owner reassignment workspace_preferences';
 exception when insufficient_privilege then null; end;
 delete from public.workspace_preferences where user_id = '10000000-0000-4000-8000-000000000001';
 get diagnostics n = row_count;
 if n <> 1 then raise exception 'FAIL: own DELETE workspace_preferences'; end if;
end $$;
do $$ declare n integer; begin
 select count(*) into n from public.workspace_conversations;
 if n <> 1 then raise exception 'FAIL: SELECT isolation workspace_conversations'; end if;
 select count(*) into n from public.workspace_conversations where user_id = '20000000-0000-4000-8000-000000000002';
 if n <> 0 then raise exception 'FAIL: A read B workspace_conversations'; end if;
 update public.workspace_conversations set updated = now() where user_id = '20000000-0000-4000-8000-000000000002';
 get diagnostics n = row_count;
 if n <> 0 then raise exception 'FAIL: A updated B workspace_conversations'; end if;
 delete from public.workspace_conversations where user_id = '20000000-0000-4000-8000-000000000002';
 get diagnostics n = row_count;
 if n <> 0 then raise exception 'FAIL: A deleted B workspace_conversations'; end if;
 update public.workspace_conversations set updated = now() where user_id = '10000000-0000-4000-8000-000000000001';
 get diagnostics n = row_count;
 if n <> 1 then raise exception 'FAIL: own UPDATE workspace_conversations'; end if;
 begin
  update public.workspace_conversations set user_id = '20000000-0000-4000-8000-000000000002' where user_id = '10000000-0000-4000-8000-000000000001';
  raise exception 'FAIL: owner reassignment workspace_conversations';
 exception when insufficient_privilege then null; end;
 delete from public.workspace_conversations where user_id = '10000000-0000-4000-8000-000000000001';
 get diagnostics n = row_count;
 if n <> 1 then raise exception 'FAIL: own DELETE workspace_conversations'; end if;
end $$;
select set_config('request.jwt.claims', '{"sub":"20000000-0000-4000-8000-000000000002","role":"authenticated"}', true);
do $$ begin if (select count(*) from public.workspace_records) <> 1 then raise exception 'FAIL: B record changed'; end if; end $$;
do $$ begin if (select count(*) from public.workspace_preferences) <> 1 then raise exception 'FAIL: B record changed'; end if; end $$;
do $$ begin if (select count(*) from public.workspace_conversations) <> 1 then raise exception 'FAIL: B record changed'; end if; end $$;
reset role;
set local role anon;
select set_config('request.jwt.claims', '{}', true);
do $$ begin begin perform * from public.workspace_records; raise exception 'FAIL: anonymous SELECT'; exception when insufficient_privilege then null; end; end $$;
do $$ begin begin update public.workspace_records set updated=now(); raise exception 'FAIL: anonymous access'; exception when insufficient_privilege then null; end; end $$;
do $$ begin begin delete from public.workspace_records; raise exception 'FAIL: anonymous access'; exception when insufficient_privilege then null; end; end $$;
do $$ begin begin insert into public.workspace_records(id,kind) values ('anon','experience'); raise exception 'FAIL: anonymous access'; exception when insufficient_privilege then null; end; end $$;
do $$ begin begin perform * from public.workspace_preferences; raise exception 'FAIL: anonymous SELECT'; exception when insufficient_privilege then null; end; end $$;
do $$ begin begin update public.workspace_preferences set updated=now(); raise exception 'FAIL: anonymous access'; exception when insufficient_privilege then null; end; end $$;
do $$ begin begin delete from public.workspace_preferences; raise exception 'FAIL: anonymous access'; exception when insufficient_privilege then null; end; end $$;
do $$ begin begin insert into public.workspace_preferences default values; raise exception 'FAIL: anonymous access'; exception when insufficient_privilege then null; end; end $$;
do $$ begin begin perform * from public.workspace_conversations; raise exception 'FAIL: anonymous SELECT'; exception when insufficient_privilege then null; end; end $$;
do $$ begin begin update public.workspace_conversations set updated=now(); raise exception 'FAIL: anonymous access'; exception when insufficient_privilege then null; end; end $$;
do $$ begin begin delete from public.workspace_conversations; raise exception 'FAIL: anonymous access'; exception when insufficient_privilege then null; end; end $$;
do $$ begin begin insert into public.workspace_conversations default values; raise exception 'FAIL: anonymous access'; exception when insufficient_privilege then null; end; end $$;
reset role;
rollback;
\echo 'PASS: ownership CRUD, spoofing, reassignment, and anonymous denial for all private tables'
