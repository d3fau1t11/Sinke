-- pgTAP tests for RLS policies
-- Run with: supabase db test

BEGIN;

SELECT plan(8);

-- Test 1: Profiles are viewable by everyone
SELECT tests.test('profiles are viewable by everyone', $$
  SELECT has_table_privilege('authenticated', 'public.profiles', 'SELECT');
$$);

-- Test 2: Users can update own profile
SELECT tests.test('users can update own profile', $$
  SELECT has_function_privilege('authenticated', 'public.profiles', 'UPDATE');
$$);

-- Test 3: Users can view own addresses
SELECT tests.test('users can view own addresses', $$
  SELECT has_table_privilege('authenticated', 'public.addresses', 'SELECT');
$$);

-- Test 4: Users can insert own addresses
SELECT tests.test('users can insert own addresses', $$
  SELECT has_table_privilege('authenticated', 'public.addresses', 'INSERT');
$$);

-- Test 5: Orders are viewable by owner
SELECT tests.test('orders are viewable by owner', $$
  SELECT has_table_privilege('authenticated', 'public.orders', 'SELECT');
$$);

-- Test 6: Products are viewable by everyone
SELECT tests.test('products are viewable by everyone', $$
  SELECT has_table_privilege('authenticated', 'public.products', 'SELECT');
$$);

-- Test 7: Zones are viewable by everyone
SELECT tests.test('zones are viewable by everyone', $$
  SELECT has_table_privilege('authenticated', 'public.zones', 'SELECT');
$$);

-- Test 8: Messages are viewable by order participants
SELECT tests.test('messages are viewable by order participants', $$
  SELECT has_table_privilege('authenticated', 'public.messages', 'SELECT');
$$);

SELECT * FROM finish();
ROLLBACK;