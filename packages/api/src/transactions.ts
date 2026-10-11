import { supabase } from "./client";

export type TransactionType =
  "order_payment" | "merchant_payout" | "rider_payout";
export type TransactionStatus =
  "completed" | "pending" | "processing" | "failed";
export type PaymentMethod = "telebirr" | "cbe_birr" | "cash";

export interface TransactionRecord {
  id: string;
  reference: string;
  orderId?: string;
  orderNumber?: string;
  type: TransactionType;
  amount: number;
  fee: number;
  net: number;
  method: PaymentMethod;
  status: TransactionStatus;
  partyName: string;
  partyRole: "Customer" | "Merchant" | "Rider";
  notes?: string;
  createdAt: string;
}

export const transactionsApi = {
  async getAll(): Promise<TransactionRecord[]> {
    const records: TransactionRecord[] = [];

    try {
      // 1. Fetch Orders to derive order payment transactions
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: rawOrders, error: ordersErr } = await (supabase as any)
        .from("orders")
        .select(
          `
          id,
          order_number,
          total,
          delivery_fee,
          payment_method,
          payment_status,
          status,
          created_at,
          business:businesses(id, name_en, name_am),
          profile:profiles(id, full_name, phone)
        `,
        )
        .order("created_at", { ascending: false });

      if (!ordersErr && rawOrders) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        rawOrders.forEach((o: any) => {
          const total = o.total || 0;
          const fee = Math.round(total * 0.05); // 5% platform fee
          const net = total - fee;
          const status: TransactionStatus =
            o.status === "delivered" || o.payment_status === "completed"
              ? "completed"
              : o.status === "cancelled"
                ? "failed"
                : "pending";

          const party =
            o.profile?.full_name ||
            (o.profile?.phone ? `Customer (${o.profile.phone})` : "Customer");

          records.push({
            id: `tx-ord-${o.id}`,
            reference: `ORD-${o.order_number}`,
            orderId: o.id,
            orderNumber: o.order_number,
            type: "order_payment",
            amount: total,
            fee,
            net,
            method: (o.payment_method as PaymentMethod) || "telebirr",
            status,
            partyName: party,
            partyRole: "Customer",
            notes: `Delivery fee included. Merchant: ${o.business?.name_en || "Store"}`,
            createdAt: o.created_at || new Date().toISOString(),
          });
        });
      }
    } catch (err) {
      console.warn("Failed to load orders for transactions:", err);
    }

    // 2. Fetch recorded merchant withdrawals from localStorage if available
    try {
      const storage = (globalThis as unknown as { localStorage?: Storage })
        .localStorage;
      if (storage) {
        const rawM = storage.getItem("senik-merchant-wallet");
        if (rawM) {
          const parsed = JSON.parse(rawM);
          const withdrawals = parsed?.state?.withdrawals ?? [];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          withdrawals.forEach((w: any) => {
            records.push({
              id: w.id,
              reference: w.referenceNumber || `WD-${w.id}`,
              type: "merchant_payout",
              amount: w.amount,
              fee: 0,
              net: w.amount,
              method: w.method === "cbe" ? "cbe_birr" : "telebirr",
              status: (w.status as TransactionStatus) || "pending",
              partyName: w.accountName || "Merchant Partner",
              partyRole: "Merchant",
              notes: `Payout to ${w.method?.toUpperCase()} Acc: ${w.accountNumber}`,
              createdAt: w.requestedAt || new Date().toISOString(),
            });
          });
        }

        const rawR = storage.getItem("senik-rider-wallet");
        if (rawR) {
          const parsed = JSON.parse(rawR);
          const withdrawals = parsed?.state?.withdrawals ?? [];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          withdrawals.forEach((w: any) => {
            records.push({
              id: w.id,
              reference: w.referenceNumber || `RWD-${w.id}`,
              type: "rider_payout",
              amount: w.amount,
              fee: 0,
              net: w.amount,
              method: w.method === "cbe" ? "cbe_birr" : "telebirr",
              status: (w.status as TransactionStatus) || "pending",
              partyName: w.accountName || "Rider Partner",
              partyRole: "Rider",
              notes: `Rider payout to ${w.method?.toUpperCase()} Acc: ${w.accountNumber}`,
              createdAt: w.requestedAt || new Date().toISOString(),
            });
          });
        }
      }
    } catch (e) {
      console.warn("Failed to parse local wallet withdrawals:", e);
    }

    // Sort descending by date
    return records.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  },
};
