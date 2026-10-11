-- Fix infinite recursion in RLS policies for business_staff
-- Migration: 003_fix_rls_recursion

-- Helper security definer functions bypass RLS during permission checks
create or replace function public.is_business_staff(b_id uuid, u_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from business_staff
    where business_id = b_id and user_id = u_id
  );
$$;

create or replace function public.is_business_owner(b_id uuid, u_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from business_staff
    where business_id = b_id and user_id = u_id and role = 'owner'
  );
$$;

-- Drop and recreate business_staff policies
drop policy if exists "Merchants can manage staff" on business_staff;
create policy "Merchants can manage staff" on business_staff for all using (
  public.is_business_owner(business_id, auth.uid())
);

-- Drop and recreate businesses policies
drop policy if exists "Merchants can update own business" on businesses;
create policy "Merchants can update own business" on businesses for update using (
  public.is_business_staff(id, auth.uid())
);

-- Drop and recreate products policies
drop policy if exists "Merchants can insert own products" on products;
create policy "Merchants can insert own products" on products for insert with check (
  public.is_business_staff(business_id, auth.uid())
);

drop policy if exists "Merchants can update own products" on products;
create policy "Merchants can update own products" on products for update using (
  public.is_business_staff(business_id, auth.uid())
);

drop policy if exists "Merchants can delete own products" on products;
create policy "Merchants can delete own products" on products for delete using (
  public.is_business_staff(business_id, auth.uid())
);

-- Drop and recreate product_options policies
drop policy if exists "Merchants can manage own product options" on product_options;
create policy "Merchants can manage own product options" on product_options for all using (
  exists (
    select 1 from products p
    where p.id = product_options.product_id
      and public.is_business_staff(p.business_id, auth.uid())
  )
);

-- Drop and recreate orders policies
drop policy if exists "Merchants can view business orders" on orders;
create policy "Merchants can view business orders" on orders for select using (
  public.is_business_staff(business_id, auth.uid())
);

-- Drop and recreate order_items policies
drop policy if exists "Merchants can view business order items" on order_items;
create policy "Merchants can view business order items" on order_items for select using (
  exists (
    select 1 from orders o
    where o.id = order_items.order_id
      and public.is_business_staff(o.business_id, auth.uid())
  )
);

-- Drop and recreate payments policies
drop policy if exists "Merchants can view business payments" on payments;
create policy "Merchants can view business payments" on payments for select using (
  exists (
    select 1 from orders o
    where o.id = payments.order_id
      and public.is_business_staff(o.business_id, auth.uid())
  )
);
