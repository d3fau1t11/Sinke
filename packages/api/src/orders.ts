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

    const { data, error } = await supabase.functions.invoke("create-order", {
      body: {
        ...input,
        userId: user.id,
      },
    });

    if (error) throw error;
    return data;
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
      .update({ rider_id: riderId, status: "picked_up" })
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
