import React from "react";
import { businessesApi } from "@senik/api";
import { SenikLogo } from "@senik/ui";
import { useMerchantAuthStore } from "../features/auth/store/merchantAuthStore";

export function MerchantHeader() {
  const { merchantId, businessName, isOpen, setIsOpen, logout } =
    useMerchantAuthStore();

  const handleToggleOpen = async () => {
    if (!merchantId) return;
    const nextState = !isOpen;
    setIsOpen(nextState);
    try {
      await businessesApi.setIsOpen(merchantId, nextState);
    } catch (err) {
      console.error("Failed to update store status", err);
    }
  };

  return (
    <header className="bg-surface border-b border-outline/10 sticky top-0 z-20 px-4 py-3 shadow-sm">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SenikLogo size="md" />
          <div>
            <h1 className="font-bold text-base text-on-surface leading-tight">
              {businessName || "Merchant"}
            </h1>
            <button
              type="button"
              onClick={() => void handleToggleOpen()}
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full mt-0.5 transition-colors ${
                isOpen
                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                  : "bg-red-100 text-red-700 hover:bg-red-200"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${isOpen ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
              />
              {isOpen ? "STORE OPEN (Accepting)" : "STORE CLOSED"}
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={logout}
          className="text-xs text-on-surface-variant hover:text-error transition-colors px-2 py-1 rounded-md"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
