begin;
select plan(3);
select ok((select relrowsecurity from pg_class where oid = 'public.messages'::regclass),
  'Messages have row level security enabled');
select ok(not exists (select 1 from pg_policies where schemaname = 'public'
  and tablename = 'messages' and policyname = 'Users can insert own messages'),
  'The sender-only insertion policy is removed');
select ok(exists (select 1 from pg_policies where schemaname = 'public'
  and tablename = 'messages' and policyname = 'Participants can send order messages'
  and cmd = 'INSERT' and roles = array['authenticated']::name[]),
  'Only authenticated order participants may insert messages');
select * from finish();
rollback;
