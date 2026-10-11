import React from "react";
import { Outlet, NavLink, Navigate } from "react-router-dom";
import { RiderHeader } from "./RiderHeader";
import { useRiderAuthStore } from "../features/auth/store/riderAuthStore";

interface NavItem {
  to: string;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { to: "/deliveries", icon: "two_wheeler", label: "Jobs" },
  { to: "/active", icon: "navigation", label: "Active" },
  { to: "/earnings", icon: "account_balance_wallet", label: "Earnings" },
];

export function RiderLayout() {
  const { isAuthenticated } = useRiderAuthStore();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-background flex flex-col pb-20">
      <RiderHeader />
      <main className="flex-1 max-w-4xl w-full mx-auto p-4">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-outline/10 py-2 px-4 flex justify-around items-center z-30 shadow-lg">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 text-xs font-medium transition-all px-4 py-1 rounded-xl ${
                isActive
                  ? "text-green-600 bg-green-50"
                  : "text-on-surface-variant hover:text-green-600"
              }`
            }
          >
            <span className="material-symbols-outlined text-[22px]">
              {item.icon}
            </span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
