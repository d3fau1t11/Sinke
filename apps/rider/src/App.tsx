import { useRiderSession } from './app/hooks/useRiderSession';
import { Skeleton } from '@senik/ui';
import { useAndroidRuntime } from '@senik/native/useAndroidRuntime';
import { ConnectionBanner } from '@senik/ui/ConnectionBanner';
import { LanguageSwitcher } from '@senik/ui/LanguageSwitcher';
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { RiderLayout } from './app/RiderLayout';
import { RiderLoginScreen } from './features/auth/RiderLoginScreen';
import { AvailableDeliveriesScreen } from './features/deliveries/AvailableDeliveriesScreen';
import { ActiveDeliveryScreen } from './features/deliveries/ActiveDeliveryScreen';
import { RiderEarningsScreen } from './features/earnings/RiderEarningsScreen';
import { DeliveryHistoryScreen } from './features/history/DeliveryHistoryScreen';

export default function App() {
  const checking = useRiderSession();
  const { connected } = useAndroidRuntime('/deliveries');
  if (checking) return <Skeleton variant="rectangular" height="120px" />;
  return (
    <>
      <div className="px-4 py-2 bg-surface">
        <LanguageSwitcher />
      </div>
      <ConnectionBanner connected={connected} />
      <Routes>
        <Route path="/login" element={<RiderLoginScreen />} />
        <Route element={<RiderLayout />}>
          <Route path="/deliveries" element={<AvailableDeliveriesScreen />} />
          <Route path="/active" element={<ActiveDeliveryScreen />} />
          <Route path="/earnings" element={<RiderEarningsScreen />} />
          <Route path="/history" element={<DeliveryHistoryScreen />} />
        </Route>
        <Route path="/" element={<Navigate to="/deliveries" replace />} />
        <Route path="*" element={<Navigate to="/deliveries" replace />} />
      </Routes>
    </>
  );
}
