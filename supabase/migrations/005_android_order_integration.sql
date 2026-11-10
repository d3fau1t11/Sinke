-- Authenticated Android delivery operations. All identities come from auth.uid().
begin;

create or replace function public.is_admin(u_id uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profiles where id = u_id and role = 'admin');
$$;
revoke all on function public.is_admin(uuid) from public, anon;
grant execute on function public.is_admin(uuid) to authenticated;

-- A helper avoids policy recursion while limiting access to personal contact details.
create or replace function public.can_view_profile(target uuid, viewer uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select viewer = target or public.is_admin(viewer) or exists (
    select 1 from public.orders o where
      (o.user_id = target and (o.rider_id = viewer or public.is_business_staff(o.business_id, viewer)))
      or (o.rider_id = target and (o.user_id = viewer or public.is_business_staff(o.business_id, viewer)))
  ) or exists (
    select 1 from public.business_staff a join public.business_staff b
      on a.business_id = b.business_id where a.user_id = viewer and b.user_id = target
  );
$$;
revoke all on function public.can_view_profile(uuid, uuid) from public, anon;
grant execute on function public.can_view_profile(uuid, uuid) to authenticated;
drop policy if exists "Profiles are viewable by everyone" on public.profiles;
create policy "Participants can view relevant profiles" on public.profiles for select to authenticated
  using (public.can_view_profile(id, auth.uid()));

create policy "Admins can manage businesses" on public.businesses for all to authenticated
  using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
create policy "Admins can manage zones" on public.zones for all to authenticated
  using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
create policy "Admins can view orders" on public.orders for select to authenticated
  using (public.is_admin(auth.uid()));
create policy "Admins can view order items" on public.order_items for select to authenticated
  using (public.is_admin(auth.uid()));
create policy "Admins can view payments" on public.payments for select to authenticated
  using (public.is_admin(auth.uid()));
create policy "Participants can view order history" on public.order_status_history for select to authenticated
  using (public.is_admin(auth.uid()) or exists (
    select 1 from public.orders o where o.id = order_id
      and (o.user_id = auth.uid() or o.rider_id = auth.uid()
        or public.is_business_staff(o.business_id, auth.uid()))
  ));

-- New phone-verified customers cannot provision themselves as staff or administrators.
drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile" on public.profiles for insert to authenticated
  with check (auth.uid() = id and role = 'customer');
revoke update on public.profiles from authenticated, anon;
grant update (full_name, avatar_url, zone_id) on public.profiles to authenticated;
revoke update on public.riders from authenticated, anon;
grant update (is_online) on public.riders to authenticated;
-- Coordinates also exist in riders; do not leave that alternate source publicly readable.
drop policy if exists "Riders are viewable by everyone" on public.riders;
create policy "Participants can read relevant riders" on public.riders for select to authenticated
  using (id = auth.uid() or public.is_admin(auth.uid()) or exists (
    select 1 from public.orders o where o.rider_id = riders.id
      and o.status in ('accepted', 'picked_up')
      and (o.user_id = auth.uid() or public.is_business_staff(o.business_id, auth.uid()))
  ));
revoke insert, update on public.rider_locations from authenticated, anon;

alter table public.device_tokens add column if not exists language text not null default 'am'
  check (language in ('am', 'en'));
create policy "Users can update own device token language" on public.device_tokens for update
  to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Key the current coordinate by the rider's ID. Preserve legacy location rows.
create index if not exists rider_locations_recent
  on public.rider_locations(rider_id, updated_at desc);

create or replace function public.upsert_rider_location(
  p_latitude double precision, p_longitude double precision, p_heading double precision default 0
) returns void language plpgsql security definer set search_path = '' as $$
declare actor uuid := auth.uid();
begin
  if actor is null or not exists (
    select 1 from public.profiles p join public.riders r on r.id = p.id
    where p.id = actor and p.role = 'rider' and r.is_online
  ) then raise exception 'Only online riders may share location' using errcode = '42501'; end if;
  if p_latitude not between -90 and 90 or p_longitude not between -180 and 180
    or p_latitude is null or p_longitude is null then
    raise exception 'Invalid coordinates' using errcode = '22023';
  end if;
  insert into public.rider_locations (id, rider_id, latitude, longitude, heading, updated_at)
  values (actor, actor, p_latitude, p_longitude, coalesce(p_heading, 0), now())
  on conflict (id) do update set latitude = excluded.latitude,
    longitude = excluded.longitude, heading = excluded.heading, updated_at = excluded.updated_at
    where rider_locations.rider_id = actor;
  update public.riders set current_latitude = p_latitude, current_longitude = p_longitude
    where id = actor;
end;
$$;

create or replace function public.claim_delivery(p_order_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare actor uuid := auth.uid();
begin
  if actor is null or not exists (
    select 1 from public.profiles p join public.riders r on r.id = p.id
    where p.id = actor and p.role = 'rider' and r.is_online
  ) then raise exception 'Only online riders may claim jobs' using errcode = '42501'; end if;
  -- Serialize claims by this rider, including claims of different orders.
  perform 1 from public.riders where id = actor for update;
  if exists (select 1 from public.orders where rider_id = actor
    and status in ('accepted', 'picked_up')) then
    raise exception 'Finish your active delivery first' using errcode = '23505';
  end if;
  update public.orders set rider_id = actor, status = 'accepted', updated_at = now()
  where id = p_order_id and rider_id is null and status = 'ready';
  if not found then raise exception 'This job is no longer available' using errcode = '40001'; end if;
  insert into public.order_status_history (order_id, status, changed_by)
    values (p_order_id, 'accepted', actor);
end;
$$;

create or replace function public.transition_order(p_order_id uuid, p_status public.order_status)
returns void language plpgsql security definer set search_path = '' as $$
declare actor uuid := auth.uid(); actor_role public.user_role; current_order public.orders;
begin
  select role into actor_role from public.profiles where id = actor;
  if actor_role is null then raise exception 'Sign in to continue' using errcode = '42501'; end if;
  select * into current_order from public.orders where id = p_order_id for update;
  if not found then raise exception 'Order not found' using errcode = '22023'; end if;
  if actor_role = 'admin' then
    if current_order.status in ('delivered', 'cancelled') or p_status = 'pending_payment' then
      raise exception 'Invalid transition' using errcode = '22023';
    end if;
  elsif actor_role = 'merchant_staff' and public.is_business_staff(current_order.business_id, actor) then
    if not ((current_order.status = 'placed' and p_status in ('preparing', 'cancelled'))
      or (current_order.status = 'preparing' and p_status = 'ready')) then
      raise exception 'Invalid merchant transition' using errcode = '42501';
    end if;
  elsif actor_role = 'rider' and current_order.rider_id = actor then
    if not ((current_order.status = 'accepted' and p_status = 'picked_up')
      or (current_order.status = 'picked_up' and p_status = 'delivered')) then
      raise exception 'Invalid rider transition' using errcode = '42501';
    end if;
  else raise exception 'This account cannot update this order' using errcode = '42501'; end if;
  update public.orders set status = p_status, updated_at = now() where id = p_order_id;
  insert into public.order_status_history (order_id, status, changed_by)
    values (p_order_id, p_status::text, actor);
end;
$$;

-- Avoid direct order updates bypassing transition checks.
drop policy if exists "Merchants can update business orders" on public.orders;
drop policy if exists "Riders can update assigned orders" on public.orders;
drop policy if exists "Riders can claim available orders" on public.orders;

create policy "Riders can discover ready jobs" on public.orders for select to authenticated using (
  status = 'ready' and rider_id is null and exists (
    select 1 from public.profiles where id = auth.uid() and role = 'rider'
  )
);
create policy "Riders can read visible order items" on public.order_items for select to authenticated using (
  exists (select 1 from public.orders o where o.id = order_id and (
    o.rider_id = auth.uid() or (o.status = 'ready' and o.rider_id is null and exists (
      select 1 from public.profiles where id = auth.uid() and role = 'rider'
    ))
  ))
);
drop policy if exists "Rider locations are viewable by everyone" on public.rider_locations;
create policy "Order participants can track rider" on public.rider_locations for select to authenticated using (
  rider_id = auth.uid() or public.is_admin(auth.uid()) or exists (
    select 1 from public.orders o where o.rider_id = rider_locations.rider_id
      and o.status in ('accepted', 'picked_up')
      and (o.user_id = auth.uid() or public.is_business_staff(o.business_id, auth.uid()))
  )
);

revoke all on function public.upsert_rider_location(double precision, double precision, double precision) from public, anon;
revoke all on function public.claim_delivery(uuid) from public, anon;
revoke all on function public.transition_order(uuid, public.order_status) from public, anon;
grant execute on function public.upsert_rider_location(double precision, double precision, double precision) to authenticated;
grant execute on function public.claim_delivery(uuid) to authenticated;
grant execute on function public.transition_order(uuid, public.order_status) to authenticated;
commit;
