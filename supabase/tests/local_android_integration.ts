// Run from the repository root with Deno. This only creates an in-memory test database.
// Supabase Auth is stubbed and unused extensions are omitted; hosted pgTAP remains required.
import { PGlite } from 'npm:@electric-sql/pglite@0.5.16';

const db = new PGlite();
await db.exec(`
  create role anon; create role authenticated; create role service_role bypassrls;
  create schema auth;
  create table auth.users (id uuid primary key);
  create function auth.uid() returns uuid language sql stable as
    $$select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid$$;
  create function uuid_generate_v4() returns uuid language sql as $$select gen_random_uuid()$$;
  grant usage on schema public, auth to anon, authenticated, service_role;
  grant execute on function auth.uid() to anon, authenticated, service_role;
  alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
`);
for (const filename of [
  '001_initial_schema.sql', '002_rls_policies.sql', '003_fix_rls_recursion.sql',
  '004_missing_rls_policies.sql', '005_android_order_integration.sql', '006_atomic_cash_orders.sql',
  '007_message_participant_security.sql',
]) {
  const source = await Deno.readTextFile('supabase/migrations/' + filename);
  // Extensions are not used by these policy operations. Local auth is a test stub.
  await db.exec(source.replace(/^create extension.*;\r?\n/gm, ''));
  console.log('Applied in local PostgreSQL:', filename);
}
const customer = '00000000-0000-0000-0000-000000000101';
const merchant = '00000000-0000-0000-0000-000000000102';
const rider = '00000000-0000-0000-0000-000000000103';
const rival = '00000000-0000-0000-0000-000000000104';
const outsider = '00000000-0000-0000-0000-000000000105';
const admin = '00000000-0000-0000-0000-000000000106';
const zone = '00000000-0000-0000-0000-000000000201';
const category = '00000000-0000-0000-0000-000000000202';
const business = '00000000-0000-0000-0000-000000000203';
const order = '00000000-0000-0000-0000-000000000301';
const second = '00000000-0000-0000-0000-000000000302';
const product = '00000000-0000-0000-0000-000000000401';
const option = '00000000-0000-0000-0000-000000000402';
for (const [id, role] of [[customer, 'customer'], [merchant, 'merchant_staff'],
  [rider, 'rider'], [rival, 'rider'], [outsider, 'customer'], [admin, 'admin']]) {
  await db.query('insert into auth.users (id) values ($1)', [id]);
  await db.query('insert into profiles (id, full_name, phone, role) values ($1::uuid,$2,$1::text,$3)', [id, role, role]);
}
await db.query(`insert into zones (id,name_am,name_en,subcity_am,subcity_en,delivery_eta)
  values ($1,'test','test','test','test','30')`, [zone]);
await db.query(`insert into categories (id,name_am,name_en,icon,color)
  values ($1,'test','test','test','test')`, [category]);
await db.query(`insert into businesses (id,name_am,name_en,description_am,description_en,
  category,zone_id,cover_image,avatar_image,delivery_eta,latitude,longitude)
  values ($1,'test','test','test','test',$2,$3,'test','test','30',9,38)`, [business, category, zone]);
await db.query('insert into business_staff (business_id,user_id) values ($1,$2)', [business, merchant]);
await db.query(`insert into products (id,business_id,name_am,name_en,description_am,
  description_en,category,price,image) values ($1,$2,'test','test','test','test','test',100,'test')`,
  [product, business]);
await db.query(`insert into product_options (id,product_id,name_am,name_en,price,is_required)
  values ($1,$2,'test','test',20,true)`, [option, product]);
for (const id of [rider, rival]) await db.query(`insert into riders
  (id, vehicle_type,vehicle_plate) values ($1,'test','test')`, [id]);
for (const [id, status] of [[order, 'placed'], [second, 'ready']]) {
  await db.query(`insert into orders (id,order_number,user_id,business_id,status,
    delivery_address,payment_method,idempotency_key) values ($1::uuid,$1::text,$2,$3,$4,'test','cash',$1::text)`,
    [id, customer, business, status]);
}
await db.exec('set role authenticated');
async function actor(id: string) {
  await db.query("select set_config('request.jwt.claim.sub',$1,false)", [id]);
}
async function fails(sql: string, code: string) {
  try { await db.exec(sql); throw new Error('Expected rejection: ' + sql); }
  catch (error) { if ((error as {code?: string}).code !== code) throw error; }
}
async function count(table: string, expected: number) {
  const result = await db.query<{total: number}>(`select count(*)::integer as total from ${table}`);
  if (result.rows[0]?.total !== expected) throw new Error('Unexpected visibility for ' + table);
}
await actor(customer);
await fails(`select transition_order('${order}','preparing')`, '42501');
await fails("update profiles set role='admin'", '42501');
await actor(merchant);
await db.exec(`select transition_order('${order}','preparing'); select transition_order('${order}','ready')`);
await fails(`select transition_order('${order}','delivered')`, '42501');
await actor(rider);
await fails(`select claim_delivery('${order}')`, '42501');
await db.exec('update riders set is_online=true where id=auth.uid()');
await db.exec(`select claim_delivery('${order}'); select upsert_rider_location(9.01,38.75,0)`);
await fails(`select claim_delivery('${second}')`, '23505');
await fails(`select upsert_rider_location(100,38,0)`, '22023');
await actor(rival);
await db.exec('update riders set is_online=true where id=auth.uid()');
await fails(`select claim_delivery('${order}')`, '40001');
await count('rider_locations', 0);
await actor(customer);
await count('rider_locations', 1);
await count('riders', 1);
await actor(outsider);
await fails(`insert into messages (order_id, sender_id, content)
  values ('${order}', '${outsider}', 'unauthorized message')`, '42501');
await count('rider_locations', 0);
await count('riders', 0);
await count('profiles', 1);
await actor(rider);
await db.exec(`insert into messages (order_id, sender_id, content)
  values ('${order}', '${rider}', 'Arriving soon')`);
await db.exec(`select transition_order('${order}','picked_up'); select transition_order('${order}','delivered')`);
await actor(customer);
await count('rider_locations', 0);
await count('riders', 0);
await actor(admin);
await count('profiles', 6);
await count('orders', 2);
await count('order_status_history', 5);
console.log('PASS: role isolation, claims, status flow, GPS visibility and profile protection');
console.log('PASS: unrelated accounts cannot inject messages into another customer order');
await actor(customer);
const input = { businessId: business, paymentMethod: 'cash', deliveryAddress: 'Test address',
  idempotencyKey: 'atomic-local-test-key', userId: outsider, total: 1,
  items: [{ productId: product, quantity: 2, selectedOptions: [{ id: option, price: 1 }] }] };
const created = await db.query<{ result: { id: string } }>(
  'select create_cash_order($1::jsonb) as result', [JSON.stringify(input)]);
const createdId = created.rows[0]!.result.id;
const retry = await db.query<{ result: { id: string } }>(
  'select create_cash_order($1::jsonb) as result', [JSON.stringify(input)]);
if (retry.rows[0]!.result.id !== createdId) throw new Error('Order retry was not idempotent');
const stored = await db.query<{total: number; user_id: string}>('select total,user_id from orders where id=$1', [createdId]);
if (stored.rows[0]!.total !== 255 || stored.rows[0]!.user_id !== customer) {
  throw new Error('The server trusted customer prices or identity');
}
const invalid = { ...input, idempotencyKey: 'atomic-invalid-key', items: [
  input.items[0], { productId: outsider, quantity: 1 },
] };
try { await db.query('select create_cash_order($1::jsonb)', [JSON.stringify(invalid)]);
  throw new Error('Expected invalid product rejection');
} catch (error) { if ((error as {code?: string}).code !== '22023') throw error; }
await count('orders', 3);
await count('order_items', 1);
await actor(admin);
await count('order_status_history', 6);
console.log('PASS: atomic cash order, database pricing, retry idempotency and failed-item rollback');
await db.close();
