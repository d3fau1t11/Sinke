import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const cn = (...inputs: (string | undefined | null | false)[]) =>
  twMerge(clsx(inputs));

export interface AppNavItem {
  /** Route id — e.g. "dashboard"; the app maps ids to router paths. */
  id: string;
  label: string;
  /** Material Symbols icon name. */
  icon: string;
  /** Optional notification badge count. */
  badge?: number;
}

export interface AppBottomNavProps {
  items: AppNavItem[];
  currentId: string;
  onNavigate: (id: string) => void;
}

/**
 * Bottom tab bar for the worker apps (merchant & rider).
 * Router-agnostic: parents pass the active id and a navigate callback.
 * Quiet Luxury active state: filled terracotta icon on a soft tonal pill.
 */
export function AppBottomNav({
  items,
  currentId,
  onNavigate,
}: AppBottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 bg-surface-container-lowest border-t border-outline-variant shadow-level-2 safe-area-bottom"
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Tibeb accent strip */}
      <div className="h-0.5 tibeb-accent-strip" aria-hidden="true" />
      <div className="flex items-center justify-around h-16 px-2 max-w-4xl mx-auto">
        {items.map((item) => {
          const isActive = currentId === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              aria-current={isActive ? "page" : undefined}
              className="flex flex-col items-center justify-center gap-0.5 flex-1 min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl py-1"
            >
              <span
                className={cn(
                  "relative w-12 h-7 rounded-full flex items-center justify-center transition-colors",
                  isActive ? "bg-primary/10" : "",
                )}
              >
                <span
                  className={cn(
                    "material-symbols-outlined text-[22px] transition-colors",
                    isActive
                      ? "text-primary fill-icon"
                      : "text-on-surface-variant/70",
                  )}
                >
                  {item.icon}
                </span>
                {!!item.badge && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-error text-on-error text-micro font-bold flex items-center justify-center px-1">
                    {item.badge}
                  </span>
                )}
              </span>
              <span
                className={cn(
                  "text-micro font-semibold whitespace-nowrap truncate max-w-full transition-colors",
                  isActive ? "text-primary" : "text-on-surface-variant",
                )}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
