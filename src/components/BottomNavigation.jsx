import React from 'react';
import { useApp } from '../context/AppContext';

export default function BottomNavigation() {
  const { currentScreen, navigateTo, cartItemsCount, lang } = useApp();

  const navItems = [
    {
      id: 'home',
      labelAm: 'ዋና ገጽ',
      labelEn: 'Home',
      icon: 'home',
      activeIcon: 'home'
    },
    {
      id: 'search',
      labelAm: 'ፍለጋ',
      labelEn: 'Search',
      icon: 'search',
      activeIcon: 'search'
    },
    {
      id: 'orders',
      labelAm: 'ትዕዛዞች',
      labelEn: 'Orders',
      icon: 'receipt_long',
      activeIcon: 'receipt_long'
    },
    {
      id: 'cart',
      labelAm: 'ቅርጫት',
      labelEn: 'Cart',
      icon: 'shopping_bag',
      activeIcon: 'shopping_bag',
      badge: cartItemsCount
    },
    {
      id: 'profile',
      labelAm: 'መለያ',
      labelEn: 'Profile',
      icon: 'person',
      activeIcon: 'person'
    }
  ];

  // Hide bottom nav during full-screen splash or onboarding or specific checkout steps if desired
  if (currentScreen === 'splash' || currentScreen === 'onboarding') {
    return null;
  }

  return (
    <nav className="sticky bottom-0 left-0 right-0 z-40 bg-[#fff8f5]/95 backdrop-blur-md border-t border-[#e1bfb5]/50 px-2 py-1.5 shadow-[0_-4px_12px_rgba(45,31,23,0.04)]">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id || 
            (item.id === 'home' && (currentScreen === 'location-select' || currentScreen === 'business-list')) ||
            (item.id === 'orders' && (currentScreen === 'order-tracking' || currentScreen === 'order-confirmation'));

          return (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all relative ${
                isActive
                  ? 'text-[#a73400] font-bold'
                  : 'text-[#594139] hover:text-[#a73400] font-normal'
              }`}
            >
              {/* Active Indicator Pill */}
              <div
                className={`w-12 h-7 rounded-full flex items-center justify-center relative transition-all duration-200 ${
                  isActive ? 'bg-[#ffdbcf] text-[#a73400]' : 'bg-transparent text-[#594139]'
                }`}
              >
                <span
                  className="material-symbols-outlined text-[21px]"
                  style={isActive ? { fontVariationSettings: "'FILL' 1, 'wght' 600" } : { fontVariationSettings: "'FILL' 0, 'wght' 400" }}
                >
                  {item.icon}
                </span>

                {/* Badge Count */}
                {Boolean(item.badge && item.badge > 0) && (
                  <span className="absolute -top-1 -right-1 bg-[#a73400] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#fff8f5] shadow-sm animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>

              <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'font-bold text-[#a73400]' : 'text-[#594139]'}`}>
                {lang === 'am' ? item.labelAm : item.labelEn}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
