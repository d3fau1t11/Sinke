-- Migration: 004_missing_rls_policies
-- Adds missing RLS policies for:
--   * order_items INSERT (needed for direct DB order creation fallback)
--   * profiles INSERT/UPDATE (needed for anonymous user onboarding)
--   * orders UPDATE (needed for merchant status changes and rider assignment)

-- order_items: Users can insert order items for their own orders
create policy ""Users can insert own order items"" on order_items
  for insert
  with check (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id
        and orders.user_id = auth.uid()
    )
  );

-- profiles: Allow any authenticated user to upsert their own profile row
create policy ""Users can insert own profile"" on profiles
  for insert
  with check (auth.uid() = id);

create policy ""Users can update own profile"" on profiles
  for update
  using (auth.uid() = id);

-- orders UPDATE: Merchants can update order status for their business
drop policy if exists ""Merchants can update business orders"" on orders;
create policy ""Merchants can update business orders"" on orders
  for update
  using (public.is_business_staff(business_id, auth.uid()));

-- orders UPDATE: Riders can update orders assigned to them
drop policy if exists ""Riders can update assigned orders"" on orders;
create policy ""Riders can update assigned orders"" on orders
  for update
  using (auth.uid() = rider_id);

-- orders UPDATE: Riders can claim an unassigned ready order
drop policy if exists ""Riders can claim available orders"" on orders;
create policy ""Riders can claim available orders"" on orders
  for update
  using (
    rider_id is null
    and status in ('accepted', 'preparing', 'ready')
    and exists (
      select 1 from riders r
      where r.id = auth.uid()
        and r.status = 'available'
    )
  );
