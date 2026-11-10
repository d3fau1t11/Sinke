-- Baseline access checks; behavior and privilege-escalation regressions are in sibling tests.
begin;
select plan(8);
select ok(not exists (select 1 from pg_tables t join pg_class c
  on c.oid = (quote_ident(t.schemaname) || '.' || quote_ident(t.tablename))::regclass
  where t.schemaname = 'public' and not c.relrowsecurity
    and not exists (select 1 from pg_depend d where d.classid = 'pg_class'::regclass
      and d.objid = c.oid and d.deptype = 'e')),
  'Every application table enables row level security');
select ok(not has_column_privilege('authenticated', 'public.profiles', 'role', 'update'),
  'Authenticated users cannot promote their role');
select ok(has_table_privilege('authenticated', 'public.addresses', 'select'),
  'Authenticated address reads are subject to RLS');
select ok(has_table_privilege('authenticated', 'public.addresses', 'insert'),
  'Authenticated address creation is subject to RLS');
select ok(not has_table_privilege('authenticated', 'public.orders', 'insert'),
  'Orders must use validated atomic checkout');
select ok(has_table_privilege('anon', 'public.products', 'select'),
  'Anonymous users can browse the catalog');
select ok(has_table_privilege('anon', 'public.zones', 'select'),
  'Anonymous users can browse delivery zones');
select ok(exists (select 1 from pg_policies where schemaname = 'public'
  and tablename = 'messages' and policyname = 'Participants can send order messages'),
  'Messages require order participation');
select * from finish();
rollback;
