import React from "react";
import { Outlet, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AppBottomNav } from "@senik/ui";
import type { AppNavItem } from "@senik/ui";
import { RiderHeader } from "./RiderHeader";
import { useRiderAuthStore } from "../features/auth/store/riderAuthStore";

const NAV_ITEMS: AppNavItem[] = [
  { id: "deliveries", label: "Jobs", icon: "two_wheeler" },
  { id: "active", label: "Active", icon: "navigation" },
  { id: "earnings", label: "Earnings", icon: "account_balance_wallet" },
];

export function RiderLayout() {
  const { isAuthenticated } = useRiderAuthStore();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const currentId = pathname.split("/")[1] || "deliveries";

  return (
    <div className="min-h-screen bg-background flex flex-col pb-20">
      <RiderHeader />
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
