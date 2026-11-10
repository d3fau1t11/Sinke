import { DemoBanner } from '@senik/ui/DemoBanner';
import { useDemoPreview } from '../shared/hooks/useDemoPreview';
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { useAdminAuthStore } from '../features/auth/store/adminAuthStore';

export function AdminLayout() {
  const { isDemo, reset } = useDemoPreview();
  const { isAuthenticated } = useAdminAuthStore();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col lg:flex-row text-slate-100">
      <AdminSidebar />
      <main className="flex-1 min-w-0 overflow-y-auto p-4 lg:p-6">
        <DemoBanner visible={isDemo} onReset={reset} />
        <Outlet />
      </main>
    </div>
  );
}
