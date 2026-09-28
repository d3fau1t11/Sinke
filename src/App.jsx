import React from 'react';
import { useApp } from './context/AppContext';
import AndroidFrame from './components/AndroidFrame';
import BottomNavigation from './components/BottomNavigation';
import ProductModal from './components/ProductModal';
import Toast from './components/Toast';

// Screens
import SplashScreen from './screens/SplashScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import LocationSelectScreen from './screens/LocationSelectScreen';
import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import BusinessListScreen from './screens/BusinessListScreen';
import BusinessDetailScreen from './screens/BusinessDetailScreen';
import CartScreen from './screens/CartScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import OrderConfirmationScreen from './screens/OrderConfirmationScreen';
import OrderTrackingScreen from './screens/OrderTrackingScreen';
import OrdersScreen from './screens/OrdersScreen';
import ProfileScreen from './screens/ProfileScreen';

export default function App() {
  const { currentScreen } = useApp();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen />;
      case 'onboarding':
        return <OnboardingScreen />;
      case 'location-select':
        return <LocationSelectScreen />;
      case 'home':
        return <HomeScreen />;
      case 'search':
        return <SearchScreen />;
      case 'business-list':
        return <BusinessListScreen />;
      case 'business-detail':
        return <BusinessDetailScreen />;
      case 'cart':
        return <CartScreen />;
      case 'checkout':
        return <CheckoutScreen />;
      case 'order-confirmation':
        return <OrderConfirmationScreen />;
      case 'order-tracking':
        return <OrderTrackingScreen />;
      case 'orders':
        return <OrdersScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <AndroidFrame>
      <div className="flex-1 flex flex-col relative min-h-0">
        {renderScreen()}
        <BottomNavigation />
        <ProductModal />
        <Toast />
      </div>
    </AndroidFrame>
  );
}
