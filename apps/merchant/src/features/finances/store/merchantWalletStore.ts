import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WithdrawalRequest {
  id: string;
  businessId: string;
  amount: number;
  method: "cbe" | "telebirr";
  accountNumber: string;
  accountName: string;
  status: "pending" | "approved" | "completed";
  requestedAt: string;
  referenceNumber: string;
}

interface MerchantWalletState {
  withdrawals: WithdrawalRequest[];
  requestWithdrawal: (input: {
    businessId: string;
    amount: number;
    method: "cbe" | "telebirr";
    accountNumber: string;
    accountName: string;
  }) => WithdrawalRequest;
}

export const useMerchantWalletStore = create<MerchantWalletState>()(
  persist(
    (set, get) => ({
      withdrawals: [],

      requestWithdrawal: (input) => {
        const prefix = input.method === "cbe" ? "CBE-WD" : "TB-WD";
        const randomNum = Math.floor(100000 + Math.random() * 900000);
        const newRequest: WithdrawalRequest = {
          id: `wd-${Date.now()}`,
          businessId: input.businessId,
          amount: input.amount,
          method: input.method,
          accountNumber: input.accountNumber,
          accountName: input.accountName,
          status: "pending",
          requestedAt: new Date().toISOString(),
          referenceNumber: `${prefix}-${randomNum}`,
        };

        set({ withdrawals: [newRequest, ...get().withdrawals] });
        return newRequest;
      },
    }),
    {
      name: "senik-merchant-wallet",
    },
  ),
);
