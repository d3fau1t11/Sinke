import React from "react";
import { Outlet, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AppBottomNav } from "@senik/ui";
import type { AppNavItem } from "@senik/ui";
import { MerchantHeader } from "./MerchantHeader";
import { useMerchantAuthStore } from "../features/auth/store/merchantAuthStore";

const NAV_ITEMS: AppNavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard" },
  { id: "orders", label: "Orders", icon: "receipt_long" },
  { id: "menu", label: "Menu", icon: "restaurant_menu" },
  { id: "finances", label: "Finances", icon: "account_balance_wallet" },
];

export function MerchantLayout() {
  const { isAuthenticated } = useMerchantAuthStore();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const currentId = pathname.split("/")[1] || "dashboard";

  return (
    <div className="min-h-screen bg-background flex flex-col pb-20">
      <MerchantHeader />
      <main className="flex-1 max-w-4xl w-full mx-auto p-4">
        <Outlet />
      </main>

      <AppBottomNav
        items={NAV_ITEMS}
        currentId={currentId}
        onNavigate={(id) => navigate(`/${id}`)}
      />
    </div>
  );
}
