import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs: (string | undefined | null | false)[]) => twMerge(clsx(inputs));

interface NavItem {
  id: string;
  label: string;
  labelAm: string;
  icon: React.ReactNode;
  activeIcon?: React.ReactNode;
  badge?: number;
}

const defaultItems: NavItem[] = [
  {
    id: 'home',
    label: 'Home',
    labelAm: 'መነሻ',
    icon: <span className="material-symbols-outlined">home</span>,
    activeIcon: <span className="material-symbols-outlined fill-icon">home</span>
  },
  {
    id: 'search',
    label: 'Search',
    labelAm: 'ፈልግ',
    icon: <span className="material-symbols-outlined">search</span>,
    activeIcon: <span className="material-symbols-outlined fill-icon">search</span>
  },
  {
    id: 'orders',
    label: 'Orders',
    labelAm: 'ትዕዛዞች',
    icon: <span className="material-symbols-outlined">receipt_long</span>,
    activeIcon: <span className="material-symbols-outlined fill-icon">receipt_long</span>
  },
  {
    id: 'profile',
    label: 'Profile',
    labelAm: 'መለያ',
    icon: <span className="material-symbols-outlined">person</span>,
    activeIcon: <span className="material-symbols-outlined fill-icon">person</span>
  }
];

export interface BottomNavProps {
  items?: NavItem[];
  currentScreen: string;
  onNavigate: (screen: string) => void;
  cartCount?: number;
  /** Translation function */
  t: (key: string) => string;
  /** Whether the current language is Amharic */
  isAm: boolean;
}

export function BottomNav({ items = defaultItems, currentScreen, onNavigate, cartCount = 0, t: _t, isAm }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-surface-container-lowest border-t border-outline-variant shadow-level-2 safe-area-bottom"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {items.map((item) => {
          const isActive = currentScreen === item.id;
          const label = isAm ? item.labelAm : item.label;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 flex-1 min-w-0',
                'transition-all active:scale-95',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface'
              )}
              aria-current={isActive ? 'page' : undefined}
              aria-label={label}
            >
              <div className="relative">
                <span
                  className={cn(
                    'text-[24px] transition-all',
                    isActive ? 'text-primary' : 'text-on-surface-variant/60'
                  )}
                >
                  {isActive && item.activeIcon ? item.activeIcon : item.icon}
                </span>
                {(item.badge || (item.id === 'orders' && cartCount > 0)) && (
                  <span
                    className="absolute -top-1 -right-1 min-w-[18px] h-5 rounded-full bg-error text-on-error text-[10px] font-bold flex items-center justify-center px-1.5"
                    aria-label={`${item.badge || cartCount} items`}
                  >
                    {item.badge || cartCount}
                  </span>
                )}
              </div>
              <span
                className={cn(
                  'text-label-sm font-semibold whitespace-nowrap truncate max-w-[60px] transition-colors',
                  isActive ? 'text-primary' : 'text-on-surface-variant'
                )}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
      {/* Tibeb accent strip */}
      <div className="h-0.5 tibeb-accent-strip" aria-hidden="true" />
    </nav>
  );
}