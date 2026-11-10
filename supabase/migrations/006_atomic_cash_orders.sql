-- Save a complete cash order atomically, using database prices and the signed-in customer.
begin;
create or replace function public.create_cash_order(p_input jsonb) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  actor uuid := auth.uid(); store public.businesses; dish public.products;
  option_row public.product_options; item jsonb; choice jsonb;
  choices jsonb; prepared jsonb := '[]'::jsonb; quantity integer; unit_price bigint;
  subtotal bigint := 0; total bigint; order_id uuid; existing public.orders; number text;
  address text := btrim(p_input->>'deliveryAddress'); key text := p_input->>'idempotencyKey';
begin
  if actor is null or not exists (select 1 from public.profiles where id = actor and role = 'customer') then
    raise exception 'A customer account is required' using errcode = '42501';
  end if;
  if p_input->>'paymentMethod' is distinct from 'cash' then
    raise exception 'Online payment is not available yet. Choose cash on delivery.' using errcode = '22023';
  end if;
  if address is null or length(address) not between 1 and 2000
    or key is null or length(key) not between 8 and 128
    or jsonb_typeof(p_input->'items') is distinct from 'array' then
    raise exception 'Invalid order input' using errcode = '22023';
  end if;
  if jsonb_array_length(p_input->'items') not between 1 and 100 then
    raise exception 'Invalid order items' using errcode = '22023';
  end if;
  -- Serialize a customer's retries; return the same complete order for the same request key.
  perform 1 from public.profiles where id = actor for update;
  select * into existing from public.orders where user_id = actor and idempotency_key = key;
  if found then return jsonb_build_object('id', existing.id, 'order_number', existing.order_number); end if;
  select * into store from public.businesses where id = (p_input->>'businessId')::uuid for share;
  if not found or not store.is_open or store.delivery_fee < 0 then
    raise exception 'This restaurant is closed.' using errcode = '22023';
  end if;
  for item in select value from jsonb_array_elements(p_input->'items') loop
    quantity := (item->>'quantity')::integer;
    if quantity is null or quantity not between 1 and 99 then
      raise exception 'Quantity must be a positive whole number.' using errcode = '22023';
    end if;
    select * into dish from public.products where id = (item->>'productId')::uuid for share;
    if not found or not dish.is_available or dish.business_id <> store.id or dish.price < 0 then
      raise exception 'A dish is unavailable.' using errcode = '22023';
    end if;
    choices := '[]'::jsonb; unit_price := dish.price;
    if item ? 'selectedOptions' and jsonb_typeof(item->'selectedOptions') <> 'array' then
      raise exception 'Invalid selected options' using errcode = '22023';
    end if;
    for choice in select value from jsonb_array_elements(coalesce(item->'selectedOptions', '[]')) loop
      select * into option_row from public.product_options
        where id = (choice->>'id')::uuid and product_id = dish.id for share;
      if not found or option_row.price < 0 or exists (
        select 1 from jsonb_array_elements(choices) c where c->>'id' = option_row.id::text
      ) then raise exception 'A selected option is unavailable.' using errcode = '22023'; end if;
      unit_price := unit_price + option_row.price;
      choices := choices || jsonb_build_array(jsonb_build_object('id', option_row.id,
        'name', option_row.name_en, 'nameAm', option_row.name_am, 'price', option_row.price));
    end loop;
    if exists (select 1 from public.product_options o where o.product_id = dish.id and o.is_required
      and not exists (select 1 from jsonb_array_elements(choices) c where c->>'id' = o.id::text)) then
      raise exception 'A required option is missing' using errcode = '22023';
    end if;
    subtotal := subtotal + unit_price * quantity;
    if unit_price > 2147483647 or subtotal > 2147483647 then
      raise exception 'Order total is too large' using errcode = '22023';
    end if;
    prepared := prepared || jsonb_build_array(jsonb_build_object('product_id', dish.id,
      'quantity', quantity, 'price', unit_price, 'selected_options', choices, 'notes', item->>'notes'));
  end loop;
  total := subtotal + store.delivery_fee + 15;
  if total > 2147483647 then raise exception 'Order total is too large' using errcode = '22023'; end if;
  order_id := gen_random_uuid(); number := 'SN-' || upper(left(replace(order_id::text, '-', ''), 16));
  insert into public.orders (id, order_number, user_id, business_id, status, subtotal,
    delivery_fee, service_fee, total, delivery_address, delivery_notes,
    payment_method, payment_status, idempotency_key)
  values (order_id, number, actor, store.id, 'placed', subtotal::integer,
    store.delivery_fee, 15, total::integer, address, p_input->>'deliveryNotes', 'cash', 'pending', key);
  insert into public.order_items (order_id, product_id, quantity, price, selected_options, notes)
  select order_id, x.product_id, x.quantity, x.price, x.selected_options, x.notes
  from jsonb_to_recordset(prepared) as x(product_id uuid, quantity integer, price integer,
    selected_options jsonb, notes text);
  insert into public.order_status_history (order_id, status, changed_by)
    values (order_id, 'placed', actor);
  return jsonb_build_object('id', order_id, 'order_number', number);
end;
$$;
revoke all on function public.create_cash_order(jsonb) from public, anon;
grant execute on function public.create_cash_order(jsonb) to authenticated;
-- All app order inserts now go through the same validated, atomic operation.
revoke insert on public.orders, public.order_items from authenticated, anon;
commit;
