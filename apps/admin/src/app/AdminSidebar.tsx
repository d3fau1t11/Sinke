import React from "react";
import { NavLink } from "react-router-dom";
import { useAdminAuthStore } from "../features/auth/store/adminAuthStore";

export function AdminSidebar() {
  const { adminName, logout } = useAdminAuthStore();

  const navItems = [
    { to: "/overview", label: "Overview", icon: "dashboard" },
    { to: "/orders", label: "Live Orders", icon: "receipt_long" },
    { to: "/merchants", label: "Merchants", icon: "storefront" },
    { to: "/zones", label: "Delivery Zones", icon: "map" },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-4 flex-shrink-0">
      <div>
        <div className="flex items-center gap-3 px-2 py-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-lg">
            ስ
          </div>
          <div>
            <span className="font-bold text-base text-white block">
              Senik Admin
            </span>
            <span className="text-[11px] text-slate-400 block">
              {adminName}
            </span>
          </div>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-white font-bold"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <span className="material-symbols-outlined text-[20px]">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="border-t border-slate-800 pt-3">
        <button
          type="button"
          onClick={logout}
          className="flex items-center gap-2 text-xs text-slate-400 hover:text-red-400 w-full px-3 py-2 rounded-lg transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
