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
    <header className="bg-surface sticky top-0 z-20 border-b border-outline-variant">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SenikLogo size="md" />
          <div>
            <h1 className="font-display font-bold text-title-sm text-on-surface leading-tight">
              {businessName || "Merchant"}
            </h1>
            <button
              type="button"
              onClick={() => void handleToggleOpen()}
              aria-pressed={isOpen}
              className={`inline-flex items-center gap-1.5 text-micro font-bold uppercase tracking-[0.05em] px-2.5 py-1 rounded-full mt-1 transition-colors ${
                isOpen
                  ? "bg-secondary/10 text-secondary hover:bg-secondary/15"
                  : "bg-error-container text-on-error-container hover:bg-error-container/80"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${isOpen ? "bg-secondary animate-pulse" : "bg-error"}`}
              />
              {isOpen ? "Open · Accepting orders" : "Closed"}
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={logout}
          className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors"
          aria-label="Log out"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
        </button>
      </div>
      {/* Tibeb accent strip */}
      <div className="h-0.5 tibeb-accent-strip" aria-hidden="true" />
    </header>
  );
}
