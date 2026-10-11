import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { RiderLayout } from "./app/RiderLayout";
import { RiderLoginScreen } from "./features/auth/RiderLoginScreen";
import { AvailableDeliveriesScreen } from "./features/deliveries/AvailableDeliveriesScreen";
import { ActiveDeliveryScreen } from "./features/deliveries/ActiveDeliveryScreen";
import { DeliveryHistoryScreen } from "./features/history/DeliveryHistoryScreen";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<RiderLoginScreen />} />
      <Route element={<RiderLayout />}>
        <Route path="/deliveries" element={<AvailableDeliveriesScreen />} />
        <Route path="/active" element={<ActiveDeliveryScreen />} />
        <Route path="/history" element={<DeliveryHistoryScreen />} />
      </Route>
      <Route path="/" element={<Navigate to="/deliveries" replace />} />
      <Route path="*" element={<Navigate to="/deliveries" replace />} />
    </Routes>
  );
}
