-- RLS Policies for all tables
-- Migration: 002_rls_policies

-- Enable RLS on all tables
alter table profiles enable row level security;
alter table addresses enable row level security;
alter table zones enable row level security;
alter table businesses enable row level security;
alter table categories enable row level security;
alter table business_staff enable row level security;
alter table products enable row level security;
alter table product_options enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table order_status_history enable row level security;
alter table promo_codes enable row level security;
alter table riders enable row level security;
alter table rider_locations enable row level security;
alter table payments enable row level security;
alter table messages enable row level security;
alter table device_tokens enable row level security;

-- Profiles policies
create policy "Profiles are viewable by everyone" on profiles for select using (true);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);

-- Addresses policies
create policy "Users can view own addresses" on addresses for select using (auth.uid() = user_id);
create policy "Users can insert own addresses" on addresses for insert with check (auth.uid() = user_id);
create policy "Users can update own addresses" on addresses for update using (auth.uid() = user_id);
create policy "Users can delete own addresses" on addresses for delete using (auth.uid() = user_id);

-- Zones policies (public read)
create policy "Zones are viewable by everyone" on zones for select using (true);

-- Businesses policies (public read, merchant write)
create policy "Businesses are viewable by everyone" on businesses for select using (true);
create policy "Merchants can update own business" on businesses for update using (
  exists (select 1 from business_staff where business_id = businesses.id and user_id = auth.uid())
);

-- Categories policies (public read)
create policy "Categories are viewable by everyone" on categories for select using (true);

-- Business staff policies
create policy "Staff can view own business staff" on business_staff for select using (user_id = auth.uid());
create policy "Merchants can manage staff" on business_staff for all using (
  exists (select 1 from business_staff bs where bs.business_id = business_staff.business_id and bs.user_id = auth.uid() and bs.role = 'owner')
);

-- Products policies (public read, merchant write)
create policy "Products are viewable by everyone" on products for select using (true);
create policy "Merchants can insert own products" on products for insert with check (
  exists (select 1 from business_staff where business_id = products.business_id and user_id = auth.uid())
);
create policy "Merchants can update own products" on products for update using (
  exists (select 1 from business_staff where business_id = products.business_id and user_id = auth.uid())
);
create policy "Merchants can delete own products" on products for delete using (
  exists (select 1 from business_staff where business_id = products.business_id and user_id = auth.uid())
);

-- Product options policies (public read, merchant write)
create policy "Product options are viewable by everyone" on product_options for select using (true);
create policy "Merchants can manage own product options" on product_options for all using (
  exists (select 1 from products p join business_staff bs on p.business_id = bs.business_id where p.id = product_options.product_id and bs.user_id = auth.uid())
);

-- Orders policies
create policy "Users can view own orders" on orders for select using (auth.uid() = user_id);
create policy "Merchants can view business orders" on orders for select using (
  exists (select 1 from business_staff where business_id = orders.business_id and user_id = auth.uid())
);
create policy "Riders can view assigned orders" on orders for select using (auth.uid() = rider_id);
create policy "Users can insert own orders" on orders for insert with check (auth.uid() = user_id);

-- Order items policies
create policy "Users can view own order items" on order_items for select using (
  exists (select 1 from orders where orders.id = order_items.order_id and orders.user_id = auth.uid())
);
create policy "Merchants can view business order items" on order_items for select using (
  exists (select 1 from orders o join business_staff bs on o.business_id = bs.business_id where o.id = order_items.order_id and bs.user_id = auth.uid())
);

-- Order status history policies
create policy "Users can view own order history" on order_status_history for select using (
  exists (select 1 from orders where orders.id = order_status_history.order_id and orders.user_id = auth.uid())
);

-- Promo codes policies (public read for active)
create policy "Active promo codes are viewable by everyone" on promo_codes for select using (is_active = true);

-- Riders policies
create policy "Riders are viewable by everyone" on riders for select using (true);
create policy "Riders can update own status" on riders for update using (auth.uid() = id);

-- Rider locations policies
create policy "Rider locations are viewable by everyone" on rider_locations for select using (true);
create policy "Riders can update own location" on rider_locations for insert with check (auth.uid() = rider_id);
create policy "Riders can update own location" on rider_locations for update using (auth.uid() = rider_id);

-- Payments policies
create policy "Users can view own payments" on payments for select using (
  exists (select 1 from orders where orders.id = payments.order_id and orders.user_id = auth.uid())
);
create policy "Merchants can view business payments" on payments for select using (
  exists (select 1 from orders o join business_staff bs on o.business_id = bs.business_id where o.id = payments.order_id and bs.user_id = auth.uid())
);

-- Messages policies
create policy "Users can view own order messages" on messages for select using (
  exists (select 1 from orders where orders.id = messages.order_id and (orders.user_id = auth.uid() or orders.rider_id = auth.uid()))
);
create policy "Users can insert own messages" on messages for insert with check (auth.uid() = sender_id);

-- Device tokens policies
create policy "Users can view own device tokens" on device_tokens for select using (auth.uid() = user_id);
create policy "Users can insert own device tokens" on device_tokens for insert with check (auth.uid() = user_id);
create policy "Users can delete own device tokens" on device_tokens for delete using (auth.uid() = user_id);