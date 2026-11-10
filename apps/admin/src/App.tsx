import { useAdminSession } from './app/hooks/useAdminSession';
import { Skeleton } from '@senik/ui';
import { LanguageSwitcher } from '@senik/ui/LanguageSwitcher';
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from './app/AdminLayout';
import { AdminLoginScreen } from './features/auth/AdminLoginScreen';
import { AdminOverviewScreen } from './features/overview/AdminOverviewScreen';
import { AdminOrdersScreen } from './features/orders/AdminOrdersScreen';
import { AdminMerchantsScreen } from './features/merchants/AdminMerchantsScreen';
import { AdminZonesScreen } from './features/zones/AdminZonesScreen';
import { AdminUsersScreen } from './features/users/AdminUsersScreen';
import { AdminTransactionsScreen } from './features/transactions/AdminTransactionsScreen';

export default function App() {
  const checking = useAdminSession();
  if (checking) return <Skeleton variant="rectangular" height="120px" />;
  return (
    <>
      <div className="px-4 py-2 bg-slate-900 text-white">
        <LanguageSwitcher />
      </div>
      <Routes>
        <Route path="/login" element={<AdminLoginScreen />} />
        <Route element={<AdminLayout />}>
          <Route path="/overview" element={<AdminOverviewScreen />} />
          <Route path="/orders" element={<AdminOrdersScreen />} />
          <Route path="/transactions" element={<AdminTransactionsScreen />} />
          <Route path="/users" element={<AdminUsersScreen />} />
          <Route path="/merchants" element={<AdminMerchantsScreen />} />
          <Route path="/zones" element={<AdminZonesScreen />} />
        </Route>
        <Route path="/" element={<Navigate to="/overview" replace />} />
        <Route path="*" element={<Navigate to="/overview" replace />} />
      </Routes>
    </>
  );
}
