import { useAndroidRuntime } from '@senik/native/useAndroidRuntime';
import { ConnectionBanner } from '@senik/ui/ConnectionBanner';
import { LanguageSwitcher } from '@senik/ui/LanguageSwitcher';
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './features/auth/store/authStore';
import { SplashScreen } from './features/auth/SplashScreen';
import { PhoneLoginScreen } from './features/auth/PhoneLoginScreen';
import { OtpVerificationScreen } from './features/auth/OtpVerificationScreen';
import { OnboardingScreen } from './features/onboarding/OnboardingScreen';
import { LocationSelectScreen } from './features/onboarding/LocationSelectScreen';
import { MainLayout } from './app/MainLayout';
import { HomeScreen } from './features/home/HomeScreen';
import { SearchScreen } from './features/search/SearchScreen';
import { MerchantDetailScreen } from './features/merchants/MerchantDetailScreen';
import { CartScreen } from './features/cart/CartScreen';
import { CheckoutScreen } from './features/checkout/CheckoutScreen';
import { OrdersScreen } from './features/orders/OrdersScreen';
import { OrderDetailScreen } from './features/orders/OrderDetailScreen';
import { OrderTrackingScreen } from './features/tracking/OrderTrackingScreen';
import { ProfileScreen } from './features/profile/ProfileScreen';
import { ProtectedRoute } from './app/ProtectedRoute';
import { MerchantListScreen } from './features/merchants/MerchantListScreen';
import { NotificationPreferencesScreen } from './features/profile/NotificationPreferencesScreen';
import { ProfileInfoScreen } from './features/profile/ProfileInfoScreen';

export default function App() {
  const { connected } = useAndroidRuntime('/app/home');
  const { isLoading } = useAuthStore();

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <>
      <div className="px-4 py-2 bg-surface">
        <LanguageSwitcher />
      </div>
      <ConnectionBanner connected={connected} />
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/auth/phone" element={<PhoneLoginScreen />} />
        <Route path="/auth/verify" element={<OtpVerificationScreen />} />
        <Route path="/onboarding" element={<OnboardingScreen />} />
        <Route path="/location" element={<LocationSelectScreen />} />
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<HomeScreen />} />
          <Route path="search" element={<SearchScreen />} />
          <Route path="merchant/:id" element={<MerchantDetailScreen />} />
          <Route path="merchants" element={<MerchantListScreen />} />
          <Route path="cart" element={<CartScreen />} />
          <Route path="checkout" element={<CheckoutScreen />} />
          <Route path="orders" element={<OrdersScreen />} />
          <Route path="orders/:id" element={<OrderDetailScreen />} />
          <Route path="tracking/:id" element={<OrderTrackingScreen />} />
          <Route path="profile" element={<ProfileScreen />} />
          <Route path="profile/notifications" element={<NotificationPreferencesScreen />} />
          <Route path="profile/help" element={<ProfileInfoScreen page="help" />} />
          <Route path="profile/about" element={<ProfileInfoScreen page="about" />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
