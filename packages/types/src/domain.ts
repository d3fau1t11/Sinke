import type { Database } from './database';

/**
 * Hand-written read models for Senik.
 *
 * Row aliases are derived from the generated `Database` type so they stay in sync with the
 * schema. The composed models (`OrderSummary`, `OrderDetail`, `SearchResult`, …) describe the
 * shapes returned by the embedded/joined selects in `@senik/api` — PostgREST infers those at
 * runtime, not from `Database`, so they are declared explicitly here.
 */

type Tables = Database['public']['Tables'];

/** The `Row` shape of a table, derived from the generated database types. */
export type TableRow<T extends keyof Tables> = Tables[T]['Row'];
/** The `Insert` shape of a table. */
export type TableInsert<T extends keyof Tables> = Tables[T]['Insert'];
/** The `Update` shape of a table. */
export type TableUpdate<T extends keyof Tables> = Tables[T]['Update'];

export type Profile = TableRow<'profiles'>;
export type Address = TableRow<'addresses'>;
export type Zone = TableRow<'zones'>;
export type Business = TableRow<'businesses'>;
export type Category = TableRow<'categories'>;
export type Product = TableRow<'products'>;
export type ProductOption = TableRow<'product_options'>;
export type Order = TableRow<'orders'>;
export type OrderItem = TableRow<'order_items'>;
export type OrderStatusHistory = TableRow<'order_status_history'>;
export type PromoCode = TableRow<'promo_codes'>;
export type Rider = TableRow<'riders'>;
export type Message = TableRow<'messages'>;

/** Order status values, as defined by the `order_status` enum in the schema. */
export type OrderStatus = Order['status'];

// ---------------------------------------------------------------------------
// Composed read models — one per embedded select in @senik/api
// ---------------------------------------------------------------------------

/** `business:businesses(id, name_am, name_en, avatar_image)` */
export type OrderBusinessSummary = Pick<Business, 'id' | 'name_am' | 'name_en' | 'avatar_image'>;

/** `product:products(id, name_am, name_en, price, image)` */
export type OrderProductSummary = Pick<Product, 'id' | 'name_am' | 'name_en' | 'price' | 'image'>;

/** `order_items(*, product:products(...))` */
export type OrderItemWithProduct = OrderItem & { product: OrderProductSummary | null };

/**
 * `rider:profiles(id, full_name, phone, avatar_url)`.
 *
 * `vehicle_info` and `rating` are optional because they are not selectable from `profiles`
 * (see the note in `@senik/api/orders.ts`) — the UI renders them only when present.
 */
export type RiderSummary = Pick<Profile, 'id' | 'full_name' | 'phone' | 'avatar_url'> & {
  vehicle_info?: string | null;
  rating?: string | null;
};

/** Result of `ordersApi.getMyOrders()` */
export type OrderSummary = Order & {
  business: OrderBusinessSummary | null;
  order_items: OrderItemWithProduct[];
};

/** Result of `ordersApi.getById()` */
export type OrderDetail = OrderSummary & { rider: RiderSummary | null };

/** Result of `zonesApi.getZones()` */
export type ZoneListItem = Pick<
  Zone,
  'id' | 'name_am' | 'name_en' | 'subcity_am' | 'subcity_en' | 'delivery_fee' | 'delivery_eta'
>;

/** Result of `businessesApi.getByZone()` */
export type BusinessListItem = Pick<
  Business,
  | 'id'
  | 'name_am'
  | 'name_en'
  | 'description_am'
  | 'description_en'
  | 'avatar_image'
  | 'delivery_eta'
  | 'delivery_fee'
  | 'rating'
  | 'is_open'
  | 'is_fasting_friendly'
  | 'is_halal'
>;

/** Result of `productsApi.getPopular()` */
export type ProductListItem = Pick<
  Product,
  | 'id'
  | 'business_id'
  | 'name_am'
  | 'name_en'
  | 'price'
  | 'image'
  | 'is_fasting'
  | 'is_available'
  | 'popular'
>;

/** Result of `productsApi.getByBusiness()` / `getById()` — a product with its option groups. */
export type ProductWithOptions = Product & { product_options: ProductOption[] };

/** Product half of `productsApi.search()` */
export type ProductSearchResult = Pick<
  Product,
  | 'id'
  | 'business_id'
  | 'name_am'
  | 'name_en'
  | 'description_am'
  | 'description_en'
  | 'image'
  | 'price'
  | 'category'
  | 'is_fasting'
  | 'is_available'
  | 'popular'
>;

/** Merchant half of `businessesApi.search()` */
export type BusinessSearchResult = Pick<
  Business,
  | 'id'
  | 'name_am'
  | 'name_en'
  | 'description_am'
  | 'description_en'
  | 'avatar_image'
  | 'delivery_eta'
  | 'delivery_fee'
  | 'rating'
  | 'is_open'
>;

/** Discriminated union the search screen renders; narrow on `type`. */
export type SearchResult =
  | (ProductSearchResult & { type: 'product' })
  | (BusinessSearchResult & { type: 'merchant' });
