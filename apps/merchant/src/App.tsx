import { useMerchantSession } from './app/hooks/useMerchantSession';
import { Skeleton } from '@senik/ui';
import { useAndroidRuntime } from '@senik/native/useAndroidRuntime';
import { ConnectionBanner } from '@senik/ui/ConnectionBanner';
import { LanguageSwitcher } from '@senik/ui/LanguageSwitcher';
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MerchantLayout } from './app/MerchantLayout';
import { MerchantLoginScreen } from './features/auth/MerchantLoginScreen';
import { MerchantDashboardScreen } from './features/dashboard/MerchantDashboardScreen';
import { MerchantOrdersScreen } from './features/orders/MerchantOrdersScreen';
import { MerchantMenuScreen } from './features/menu/MerchantMenuScreen';
import { MerchantFinancesScreen } from './features/finances/MerchantFinancesScreen';

export default function App() {
  const checking = useMerchantSession();
  const { connected } = useAndroidRuntime('/dashboard');
  if (checking) return <Skeleton variant="rectangular" height="120px" />;
  return (
    <>
      <div className="px-4 py-2 bg-surface">
        <LanguageSwitcher />
      </div>
      <ConnectionBanner connected={connected} />
      <Routes>
        <Route path="/login" element={<MerchantLoginScreen />} />
        <Route element={<MerchantLayout />}>
          <Route path="/dashboard" element={<MerchantDashboardScreen />} />
          <Route path="/orders" element={<MerchantOrdersScreen />} />
          <Route path="/menu" element={<MerchantMenuScreen />} />
          <Route path="/finances" element={<MerchantFinancesScreen />} />
        </Route>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  );
}
