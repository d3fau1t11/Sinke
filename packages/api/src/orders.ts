import { supabase, asRows, asRow } from "./client";
import type { OrderDetail, OrderSummary, OrderStatus } from "@senik/types";

export const ordersApi = {
  async create(input: {
    businessId: string;
    items: Array<{
      productId: string;
      quantity: number;
      selectedOptions?: Array<{
        id: string;
        name: string;
        nameAm: string;
        price: number;
      }>;
      notes?: string;
    }>;
    deliveryAddress: string;
    deliveryNotes?: string;
    paymentMethod: "cash" | "telebirr" | "cbe_birr";
    idempotencyKey: string;
  }) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    // Try edge function first; fall back to direct DB insert when not deployed
    try {
      const { data, error } = await supabase.functions.invoke("create-order", {
        body: { ...input, userId: user.id },
      });
      if (!error) return data;
    } catch {
      // Edge function unavailable — proceed with direct insert
    }

    return ordersApi._createDirect(user.id, input);
  },

  async _createDirect(
    userId: string,
    input: {
      businessId: string;
      items: Array<{
        productId: string;
        quantity: number;
        selectedOptions?: Array<{
          id: string;
          name: string;
          nameAm: string;
          price: number;
        }>;
        notes?: string;
      }>;
      deliveryAddress: string;
      deliveryNotes?: string;
      paymentMethod: "cash" | "telebirr" | "cbe_birr";
      idempotencyKey: string;
    },
  ) {
    // Fetch product prices from DB to compute totals
    const productIds = input.items.map((i) => i.productId);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: rawProducts, error: prodErr } = await (supabase as any)
      .from("products")
      .select("id, price")
      .in("id", productIds);
    if (prodErr) throw prodErr;

    const products = (rawProducts ?? []) as Array<{
      id: string;
      price: number;
    }>;
    const priceMap = new Map<string, number>(
      products.map((p) => [p.id, p.price]),
    );

    let subtotal = 0;
    const itemRows = input.items.map((item) => {
      const base = priceMap.get(item.productId) ?? 0;
      const optionsExtra = (item.selectedOptions ?? []).reduce(
        (s, o) => s + o.price,
        0,
      );
      const linePrice = (base + optionsExtra) * item.quantity;
      subtotal += linePrice;
      return {
        product_id: item.productId,
        quantity: item.quantity,
        price: base + optionsExtra,
        selected_options: item.selectedOptions ?? null,
        notes: item.notes ?? null,
      };
    });

    const deliveryFee = 40;
    const serviceFee = Math.round(subtotal * 0.05);
    const total = subtotal + deliveryFee + serviceFee;
    const orderNumber = `SN-${Date.now().toString(36).toUpperCase()}`;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: order, error: orderErr } = await (supabase as any)
      .from("orders")
      .insert({
        order_number: orderNumber,
        user_id: userId,
        business_id: input.businessId,
        status: "confirmed",
        subtotal,
        delivery_fee: deliveryFee,
        service_fee: serviceFee,
        discount: 0,
        total,
        delivery_address: input.deliveryAddress,
        delivery_notes: input.deliveryNotes ?? null,
        payment_method: input.paymentMethod,
        payment_status: "pending",
        idempotency_key: input.idempotencyKey,
      })
      .select("id")
      .single();

    if (orderErr) throw orderErr;

    const orderId = (order as { id: string }).id;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: itemsErr } = await (supabase as any)
      .from("order_items")
      .insert(itemRows.map((r) => ({ ...r, order_id: orderId })));

    if (itemsErr) throw itemsErr;

    return { id: orderId, order_number: orderNumber };
  },

  async getMyOrders(): Promise<OrderSummary[]> {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items(
          *,
          product:products(id, name_am, name_en, price, image)
        ),
        business:businesses(id, name_am, name_en, avatar_image)
      `,
      )
      .order("created_at", { ascending: false });

    if (error) throw error;
    return asRows<OrderSummary>(data);
  },

  async getById(id: string): Promise<OrderDetail | null> {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items(
          *,
          product:products(id, name_am, name_en, price, image)
        ),
        business:businesses(id, name_am, name_en, avatar_image),
        rider:profiles!orders_rider_id_fkey(id, full_name, phone, avatar_url)
      `,
      )
      .eq("id", id)
      .single();

    if (error) throw error;
    return asRow<OrderDetail>(data);
  },

  async getByBusiness(businessId: string): Promise<OrderSummary[]> {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items(
          *,
          product:products(id, name_am, name_en, price, image)
        ),
        business:businesses(id, name_am, name_en, avatar_image)
      `,
      )
      .eq("business_id", businessId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return asRows<OrderSummary>(data);
  },

  async updateStatus(id: string, status: OrderStatus): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from("orders")
      .update({ status })
      .eq("id", id);

    if (error) throw error;
  },

  async getAvailableForRiders(): Promise<OrderSummary[]> {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items(
          *,
          product:products(id, name_am, name_en, price, image)
        ),
        business:businesses(id, name_am, name_en, avatar_image)
      `,
      )
      .in("status", ["accepted", "preparing", "ready"])
      .is("rider_id", null)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return asRows<OrderSummary>(data);
  },

  async acceptDelivery(orderId: string, riderId: string): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from("orders")
      .update({ rider_id: riderId, status: "accepted" })
      .eq("id", orderId);

    if (error) throw error;
  },

  async getRiderOrders(riderId: string): Promise<OrderSummary[]> {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items(
          *,
          product:products(id, name_am, name_en, price, image)
        ),
        business:businesses(id, name_am, name_en, avatar_image)
      `,
      )
      .eq("rider_id", riderId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return asRows<OrderSummary>(data);
  },

  async getAll(): Promise<OrderSummary[]> {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items(
          *,
          product:products(id, name_am, name_en, price, image)
        ),
        business:businesses(id, name_am, name_en, avatar_image)
      `,
      )
      .order("created_at", { ascending: false });

    if (error) throw error;
    return asRows<OrderSummary>(data);
  },
};
