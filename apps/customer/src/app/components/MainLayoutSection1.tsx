import { useText } from '@senik/i18n';
import type { useMainLayout } from '../hooks/useMainLayout';

import { NavLink } from 'react-router-dom';

const navItems = [
  { path: '/app/home', labelAm: 'መነሻ', labelEn: 'Home', icon: 'home' },
  { path: '/app/search', labelAm: 'ፈልግ', labelEn: 'Search', icon: 'search' },
  {
    path: '/app/cart',
    labelAm: 'ቅርጫት',
    labelEn: 'Cart',
    icon: 'shopping_cart',
  },
  {
    path: '/app/orders',
    labelAm: 'ትዕዛዞች',
    labelEn: 'Orders',
    icon: 'receipt_long',
  },
  { path: '/app/profile', labelAm: 'መለያ', labelEn: 'Profile', icon: 'person' },
];
type Props = {
  isAm: ReturnType<typeof useMainLayout>['isAm'];
  currentPath: ReturnType<typeof useMainLayout>['currentPath'];
  cartCount: ReturnType<typeof useMainLayout>['cartCount'];
};
export function MainLayoutSection1({ isAm, currentPath, cartCount }: Props) {
  const text = useText();
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-outline-variant shadow-level-2 safe-area-bottom"
      role="navigation"
      aria-label={text('Main navigation')}
    >
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive =
            currentPath === item.path ||
            (item.path !== '/app/home' && currentPath.startsWith(item.path));
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`relative flex flex-col items-center justify-center gap-1 flex-1 min-w-0 transition-all ${
                isActive ? 'text-primary' : 'text-on-surface-variant'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <span
                className={`material-symbols-outlined text-[24px] transition-colors ${
                  isActive ? 'fill-icon' : ''
                }`}
              >
                {item.icon}
              </span>
              <span className="text-label-sm font-semibold truncate max-w-[55px]">
                {isAm ? item.labelAm : item.labelEn}
              </span>
              {item.path === '/app/cart' && cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 rounded-full bg-error text-on-error text-[9px] font-bold flex items-center justify-center px-1">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
