import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { MerchantLayout } from "./app/MerchantLayout";
import { MerchantLoginScreen } from "./features/auth/MerchantLoginScreen";
import { MerchantDashboardScreen } from "./features/dashboard/MerchantDashboardScreen";
import { MerchantOrdersScreen } from "./features/orders/MerchantOrdersScreen";
import { MerchantMenuScreen } from "./features/menu/MerchantMenuScreen";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<MerchantLoginScreen />} />
      <Route element={<MerchantLayout />}>
        <Route path="/dashboard" element={<MerchantDashboardScreen />} />
        <Route path="/orders" element={<MerchantOrdersScreen />} />
        <Route path="/menu" element={<MerchantMenuScreen />} />
      </Route>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
