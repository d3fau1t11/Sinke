-- Senik Initial Schema
-- Migration: 001_initial_schema
-- Description: Core tables for the Senik delivery platform

-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "postgis";

-- Custom types
create type user_role as enum ('customer', 'merchant_staff', 'rider', 'admin');
create type order_status as enum ('pending_payment', 'placed', 'accepted', 'preparing', 'ready', 'picked_up', 'delivered', 'cancelled');
create type payment_method as enum ('cash', 'telebirr', 'cbe_birr');
create type payment_status as enum ('pending', 'processing', 'completed', 'failed', 'refunded');

-- Profiles table
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text not null unique,
  email text,
  avatar_url text,
  role user_role not null default 'customer',
  zone_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Addresses table
create table addresses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  label text not null,
  full_address text not null,
  landmark text,
  latitude double precision,
  longitude double precision,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

-- Zones table
create table zones (
  id uuid primary key default uuid_generate_v4(),
  name_am text not null,
  name_en text not null,
  subcity_am text not null,
  subcity_en text not null,
  delivery_fee integer not null default 0,
  delivery_eta text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Categories table
create table categories (
  id uuid primary key default uuid_generate_v4(),
  name_am text not null,
  name_en text not null,
  icon text not null,
  color text not null,
  sort_order integer not null default 0
);

-- Businesses table
create table businesses (
  id uuid primary key default uuid_generate_v4(),
  name_am text not null,
  name_en text not null,
  description_am text not null,
  description_en text not null,
  category uuid not null references categories(id),
  zone_id uuid not null references zones(id),
  cover_image text not null,
  avatar_image text not null,
  rating numeric(2,1) not null default 0,
  reviews_count integer not null default 0,
  delivery_eta text not null,
  delivery_fee integer not null default 0,
  is_open boolean not null default true,
  is_halal boolean not null default true,
  is_fasting_friendly boolean not null default false,
  featured boolean not null default false,
  latitude double precision not null,
  longitude double precision not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Business staff table
create table business_staff (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid not null references businesses(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  role text not null default 'staff' check (role in ('owner', 'manager', 'staff')),
  created_at timestamptz not null default now(),
  unique(business_id, user_id)
);

-- Products table
create table products (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid not null references businesses(id) on delete cascade,
  name_am text not null,
  name_en text not null,
  description_am text not null,
  description_en text not null,
  category text not null,
  price integer not null,
  image text not null,
  is_fasting boolean not null default false,
  is_available boolean not null default true,
  popular boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Product options table
create table product_options (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references products(id) on delete cascade,
  name_am text not null,
  name_en text not null,
  price integer not null default 0,
  is_required boolean not null default false,
  sort_order integer not null default 0
);

-- Orders table
create table orders (
  id uuid primary key default uuid_generate_v4(),
  order_number text not null unique,
  user_id uuid not null references profiles(id),
  business_id uuid not null references businesses(id),
  rider_id uuid references profiles(id),
  status order_status not null default 'pending_payment',
  subtotal integer not null default 0,
  delivery_fee integer not null default 0,
  service_fee integer not null default 0,
  discount integer not null default 0,
  total integer not null default 0,
  delivery_address text not null,
  delivery_notes text,
  payment_method payment_method not null,
  payment_status payment_status not null default 'pending',
  promo_code text,
  idempotency_key text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Order items table
create table order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid not null references products(id),
  quantity integer not null check (quantity > 0),
  price integer not null,
  selected_options jsonb,
  notes text
);

-- Order status history table
create table order_status_history (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references orders(id) on delete cascade,
  status text not null,
  changed_by uuid not null references profiles(id),
  notes text,
  created_at timestamptz not null default now()
);

-- Promo codes table
create table promo_codes (
  id uuid primary key default uuid_generate_v4(),
  code text not null unique,
  title_am text not null,
  title_en text not null,
  description_am text not null,
  description_en text not null,
  discount_percent integer not null default 0,
  max_discount integer,
  min_order integer not null default 0,
  valid_from timestamptz not null,
  valid_until timestamptz not null,
  is_active boolean not null default true,
  usage_limit integer,
  usage_count integer not null default 0,
  created_at timestamptz not null default now()
);

-- Riders table
create table riders (
  id uuid primary key references profiles(id) on delete cascade,
  vehicle_type text not null,
  vehicle_plate text not null,
  is_online boolean not null default false,
  current_latitude double precision,
  current_longitude double precision,
  rating numeric(2,1) not null default 0,
  total_deliveries integer not null default 0,
  created_at timestamptz not null default now()
);

-- Rider locations table
create table rider_locations (
  id uuid primary key default uuid_generate_v4(),
  rider_id uuid not null references riders(id) on delete cascade,
  latitude double precision not null,
  longitude double precision not null,
  heading double precision not null default 0,
  updated_at timestamptz not null default now()
);

-- Payments table
create table payments (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references orders(id) on delete cascade,
  amount integer not null,
  method payment_method not null,
  status payment_status not null default 'pending',
  provider_reference text,
  provider_response jsonb,
  created_at timestamptz not null default now()
);

-- Messages table
create table messages (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references orders(id) on delete cascade,
  sender_id uuid not null references profiles(id),
  content text not null,
  type text not null default 'text' check (type in ('text', 'image', 'location')),
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- Device tokens table (for push notifications)
create table device_tokens (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  token text not null,
  platform text not null check (platform in ('android', 'ios', 'web')),
  created_at timestamptz not null default now(),
  unique(user_id, token)
);

-- Indexes
create index idx_profiles_zone on profiles(zone_id);
create index idx_addresses_user on addresses(user_id);
create index idx_businesses_zone on businesses(zone_id);
create index idx_businesses_category on businesses(category);
create index idx_businesses_featured on businesses(featured) where featured = true;
create index idx_products_business on products(business_id);
create index idx_products_popular on products(popular) where popular = true;
create index idx_product_options_product on product_options(product_id);
create index idx_orders_user on orders(user_id);
create index idx_orders_business on orders(business_id);
create index idx_orders_rider on orders(rider_id);
create index idx_orders_status on orders(status);
create index idx_orders_created on orders(created_at desc);
create index idx_order_items_order on order_items(order_id);
create index idx_order_status_history_order on order_status_history(order_id);
create index idx_payments_order on payments(order_id);
create index idx_messages_order on messages(order_id);
create index idx_device_tokens_user on device_tokens(user_id);

-- Updated_at trigger function
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply updated_at triggers
create trigger profiles_updated_at before update on profiles for each row execute function update_updated_at();
create trigger businesses_updated_at before update on businesses for each row execute function update_updated_at();
create trigger products_updated_at before update on products for each row execute function update_updated_at();
create trigger orders_updated_at before update on orders for each row execute function update_updated_at();