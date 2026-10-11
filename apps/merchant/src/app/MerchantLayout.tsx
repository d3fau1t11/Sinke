import React from "react";
import { Outlet, NavLink, Navigate } from "react-router-dom";
import { MerchantHeader } from "./MerchantHeader";
import { useMerchantAuthStore } from "../features/auth/store/merchantAuthStore";

export function MerchantLayout() {
  const { isAuthenticated } = useMerchantAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col pb-20">
      <MerchantHeader />
      <main className="flex-1 max-w-4xl w-full mx-auto p-4">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-outline/10 py-2 px-6 flex justify-around items-center z-30 shadow-lg">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-xs font-medium transition-colors ${
              isActive ? "text-primary" : "text-on-surface-variant"
            }`
          }
        >
          <span className="material-symbols-outlined text-[22px]">
            dashboard
          </span>
          <span>Dashboard</span>
        </NavLink>
        <NavLink
          to="/orders"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-xs font-medium transition-colors ${
              isActive ? "text-primary" : "text-on-surface-variant"
            }`
          }
        >
          <span className="material-symbols-outlined text-[22px]">
            receipt_long
          </span>
          <span>Orders</span>
        </NavLink>
        <NavLink
          to="/menu"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-xs font-medium transition-colors ${
              isActive ? "text-primary" : "text-on-surface-variant"
            }`
          }
        >
          <span className="material-symbols-outlined text-[22px]">
            restaurant_menu
          </span>
          <span>Menu</span>
        </NavLink>
        <NavLink
          to="/finances"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-xs font-medium transition-colors ${
              isActive ? "text-primary" : "text-on-surface-variant"
            }`
          }
        >
          <span className="material-symbols-outlined text-[22px]">
            account_balance_wallet
          </span>
          <span>Finances</span>
        </NavLink>
      </nav>
    </div>
  );
}
