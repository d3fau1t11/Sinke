import React, { useState } from "react";
import { Outlet, useLocation, NavLink } from "react-router-dom";
import { useApp } from "@senik/i18n";
import { useCartStore } from "../features/cart/store/cartStore";
import { useZoneStore } from "../features/zone/store/zoneStore";
import { Button, SenikLogo } from "@senik/ui";

const navItems = [
  { path: "/app/home", labelAm: "መነሻ", labelEn: "Home", icon: "home" },
  { path: "/app/search", labelAm: "ፈልግ", labelEn: "Search", icon: "search" },
  {
    path: "/app/cart",
    labelAm: "ቅርጫት",
    labelEn: "Cart",
    icon: "shopping_cart",
  },
  {
    path: "/app/orders",
    labelAm: "ትዕዛዞች",
    labelEn: "Orders",
    icon: "receipt_long",
  },
  { path: "/app/profile", labelAm: "መለያ", labelEn: "Profile", icon: "person" },
];

export function MainLayout() {
  const { isAm } = useApp();
  const location = useLocation();
  const cartCount = useCartStore((s) => s.getItemCount());
  const { selectedZoneName, selectedZoneNameAm } = useZoneStore();
  const [showZonePicker, setShowZonePicker] = useState(false);

  const currentPath = location.pathname;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-outline-variant shadow-sm">
        <div className="flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center gap-3">
            <SenikLogo size="sm" showText={true} />
            <button
              type="button"
              onClick={() => setShowZonePicker(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-low border border-outline-variant hover:border-primary/40 transition-colors text-left"
            >
              <span className="material-symbols-outlined text-primary text-[16px]">
                location_on
              </span>
              <span className="truncate max-w-[100px] font-medium text-xs text-on-surface">
                {isAm ? selectedZoneNameAm : selectedZoneName}
              </span>
              <span className="material-symbols-outlined text-on-surface-variant text-[14px]">
                expand_more
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowZonePicker(true)}
            >
              <span className="material-symbols-outlined">edit_location</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>

      <nav
        className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-outline-variant shadow-level-2 safe-area-bottom"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const isActive =
              currentPath === item.path ||
              (item.path !== "/app/home" && currentPath.startsWith(item.path));
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center gap-1 flex-1 min-w-0 transition-all ${
                  isActive ? "text-primary" : "text-on-surface-variant"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <span
                  className={`material-symbols-outlined text-[24px] transition-colors ${
                    isActive ? "fill-icon" : ""
                  }`}
                >
                  {item.icon}
                </span>
                <span className="text-label-sm font-semibold truncate max-w-[55px]">
                  {isAm ? item.labelAm : item.labelEn}
                </span>
                {item.path === "/app/cart" && cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-4 rounded-full bg-error text-on-error text-[9px] font-bold flex items-center justify-center px-1">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {showZonePicker && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/50"
            role="button"
            tabIndex={-1}
            aria-label={isAm ? "የሰፈር መምረጫ ዝጋ" : "Close area picker"}
            onClick={() => setShowZonePicker(false)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setShowZonePicker(false);
            }}
          />
          <div
            className="fixed bottom-0 left-0 right-0 z-50 w-full bg-white rounded-t-2xl p-4 max-h-[80vh] overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label={isAm ? "ሰፈር ይምረጡ" : "Select Area"}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-lg text-on-surface">
                {isAm ? "ሰፈር ይምረጡ" : "Select Area"}
              </h2>
              <button
                onClick={() => setShowZonePicker(false)}
                className="p-2 rounded-full hover:bg-surface-container-low"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <p className="text-sm text-on-surface-variant mb-4 px-2">
              {isAm ? "የሚያገለግሉትን ሰፈር ይምረጡ" : "Choose your delivery area"}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
