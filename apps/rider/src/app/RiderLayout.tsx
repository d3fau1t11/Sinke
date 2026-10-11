import React from "react";
import { Outlet, NavLink, Navigate } from "react-router-dom";
import { RiderHeader } from "./RiderHeader";
import { useRiderAuthStore } from "../features/auth/store/riderAuthStore";

export function RiderLayout() {
  const { isAuthenticated } = useRiderAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col pb-20">
      <RiderHeader />
      <main className="flex-1 max-w-4xl w-full mx-auto p-4">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-outline/10 py-2 px-6 flex justify-around items-center z-30 shadow-lg">
        <NavLink
          to="/deliveries"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-xs font-medium transition-colors ${
              isActive ? "text-secondary" : "text-on-surface-variant"
            }`
          }
        >
          <span className="material-symbols-outlined text-[22px]">
            two_wheeler
          </span>
          <span>Available Jobs</span>
        </NavLink>
        <NavLink
          to="/active"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-xs font-medium transition-colors ${
              isActive ? "text-secondary" : "text-on-surface-variant"
            }`
          }
        >
          <span className="material-symbols-outlined text-[22px]">
            navigation
          </span>
          <span>Active Order</span>
        </NavLink>
        <NavLink
          to="/history"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-xs font-medium transition-colors ${
              isActive ? "text-secondary" : "text-on-surface-variant"
            }`
          }
        >
          <span className="material-symbols-outlined text-[22px]">history</span>
          <span>Earnings & History</span>
        </NavLink>
      </nav>
    </div>
  );
}
