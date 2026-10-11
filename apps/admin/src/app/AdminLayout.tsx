import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { useAdminAuthStore } from "../features/auth/store/adminAuthStore";

export function AdminLayout() {
  const { isAuthenticated } = useAdminAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-950 flex text-slate-100">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-6 max-w-6xl">
        <Outlet />
      </main>
    </div>
  );
}
