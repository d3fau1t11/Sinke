import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AdminLayout } from "./app/AdminLayout";
import { AdminLoginScreen } from "./features/auth/AdminLoginScreen";
import { AdminOverviewScreen } from "./features/overview/AdminOverviewScreen";
import { AdminOrdersScreen } from "./features/orders/AdminOrdersScreen";
import { AdminMerchantsScreen } from "./features/merchants/AdminMerchantsScreen";
import { AdminZonesScreen } from "./features/zones/AdminZonesScreen";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<AdminLoginScreen />} />
      <Route element={<AdminLayout />}>
        <Route path="/overview" element={<AdminOverviewScreen />} />
        <Route path="/orders" element={<AdminOrdersScreen />} />
        <Route path="/merchants" element={<AdminMerchantsScreen />} />
        <Route path="/zones" element={<AdminZonesScreen />} />
      </Route>
      <Route path="/" element={<Navigate to="/overview" replace />} />
      <Route path="*" element={<Navigate to="/overview" replace />} />
    </Routes>
  );
}
