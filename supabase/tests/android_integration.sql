begin;
select plan(24);

select has_function('public', 'claim_delivery', array['uuid'], 'Delivery claim RPC exists');
select has_function('public', 'transition_order', array['uuid', 'order_status'], 'Transition RPC exists');
select has_function('public', 'upsert_rider_location',
  array['double precision', 'double precision', 'double precision'], 'GPS RPC exists');
select ok(not has_function_privilege('anon', 'public.claim_delivery(uuid)', 'execute'),
  'Anonymous users cannot claim deliveries');
select ok(not has_function_privilege('anon',
  'public.upsert_rider_location(double precision,double precision,double precision)', 'execute'),
  'Anonymous users cannot publish coordinates');
select ok(not has_column_privilege('authenticated', 'public.profiles', 'role', 'update'),
  'A client cannot elevate its profile role');

-- Every unauthorized call must fail before reading/modifying an order.
set local role authenticated;
select set_config('request.jwt.claim.sub', '', true);
select throws_ok($$select public.claim_delivery('00000000-0000-0000-0000-000000000001')$$,
  '42501', 'Only online riders may claim jobs', 'Missing auth cannot claim a job');
select throws_ok($$select public.upsert_rider_location(9.01, 38.75, 0)$$,
  '42501', 'Only online riders may share location', 'Missing auth cannot send GPS');
select throws_ok($$select public.transition_order('00000000-0000-0000-0000-000000000001', 'delivered')$$,
  '42501', 'Sign in to continue', 'Missing auth cannot complete an order');
reset role;

select ok(exists (select 1 from pg_policies where schemaname = 'public'
  and tablename = 'orders' and policyname = 'Riders can discover ready jobs'),
  'Rider discovery is explicitly covered by RLS');
select ok(not exists (select 1 from pg_policies where schemaname = 'public'
  and tablename = 'rider_locations' and policyname = 'Rider locations are viewable by everyone'),
  'Coordinates are not publicly visible');
select ok(not exists (select 1 from pg_policies where schemaname = 'public'
  and tablename = 'orders' and policyname in ('Riders can claim available orders',
    'Merchants can update business orders', 'Riders can update assigned orders')),
  'Direct writes cannot bypass transition checks');

select ok(not has_table_privilege('authenticated', 'public.rider_locations', 'insert'),
  'Rider GPS cannot bypass the authenticated publishing function');
select ok(not has_column_privilege('authenticated', 'public.riders', 'rating', 'update'),
  'Riders cannot change their own rating');
select ok(not exists (select 1 from pg_policies where schemaname = 'public'
  and tablename = 'riders' and policyname = 'Riders are viewable by everyone'),
  'Rider metadata is not an alternate source of public coordinates');
select ok(not exists (select 1 from pg_policies where schemaname = 'public'
  and tablename = 'profiles' and policyname = 'Profiles are viewable by everyone'),
  'Personal contact details are not public');
select ok(exists (select 1 from pg_policies where schemaname = 'public'
  and tablename = 'profiles' and policyname = 'Participants can view relevant profiles'),
  'Order participant contact access is explicitly covered');
select ok(exists (select 1 from pg_policies where schemaname = 'public'
  and tablename = 'orders' and policyname = 'Admins can view orders'),
  'Admins can inspect shared orders');
select ok(exists (select 1 from pg_policies where schemaname = 'public'
  and tablename = 'order_status_history' and policyname = 'Participants can view order history'),
  'Participants and admins can inspect status history');
select has_function('public', 'create_cash_order', array['jsonb'], 'Atomic checkout RPC exists');
select ok(not has_function_privilege('anon', 'public.create_cash_order(jsonb)', 'execute'),
  'Anonymous users cannot create orders');
select ok(not has_table_privilege('authenticated', 'public.orders', 'insert'),
  'Clients cannot bypass server prices with direct order inserts');
select ok(not has_table_privilege('authenticated', 'public.order_items', 'insert'),
  'Clients cannot create partial or unpriced order items');
set local role authenticated;
select set_config('request.jwt.claim.sub', '', true);
select throws_ok($$select public.create_cash_order('{}')$$,
  '42501', 'A customer account is required', 'Missing auth cannot create a cash order');
reset role;

select * from finish();
rollback;
