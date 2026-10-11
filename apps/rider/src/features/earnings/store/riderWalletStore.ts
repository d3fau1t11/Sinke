import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface RiderWithdrawal {
  id: string;
  riderId: string;
  amount: number;
  method: "cbe" | "telebirr";
  accountNumber: string;
  accountName: string;
  status: "pending" | "approved" | "completed";
  requestedAt: string;
  referenceNumber: string;
}

interface RiderWalletState {
  balance: number;
  lifetimeEarnings: number;
  withdrawals: RiderWithdrawal[];
  creditDelivery: (riderId: string, amount: number) => void;
  requestWithdrawal: (input: {
    riderId: string;
    amount: number;
    method: "cbe" | "telebirr";
    accountNumber: string;
    accountName: string;
  }) => RiderWithdrawal;
}

export const useRiderWalletStore = create<RiderWalletState>()(
  persist(
    (set, get) => ({
      balance: 0,
      lifetimeEarnings: 0,
      withdrawals: [],

      creditDelivery: (riderId, amount) => {
        void riderId;
        set((s) => ({
          balance: s.balance + amount,
          lifetimeEarnings: s.lifetimeEarnings + amount,
        }));
      },

      requestWithdrawal: (input) => {
        const { balance } = get();
        const prefix = input.method === "cbe" ? "CBE-RD" : "TB-RD";
        const randomNum = Math.floor(100000 + Math.random() * 900000);
        const newRequest: RiderWithdrawal = {
          id: `rwd-${Date.now()}`,
          riderId: input.riderId,
          amount: input.amount,
          method: input.method,
          accountNumber: input.accountNumber,
          accountName: input.accountName,
          status: "pending",
          requestedAt: new Date().toISOString(),
          referenceNumber: `${prefix}-${randomNum}`,
        };
        set({
          balance: Math.max(0, balance - input.amount),
          withdrawals: [newRequest, ...get().withdrawals],
        });
        return newRequest;
      },
    }),
    { name: "senik-rider-wallet" },
  ),
);
