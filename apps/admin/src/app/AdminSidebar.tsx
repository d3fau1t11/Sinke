import { useText } from '@senik/i18n';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAdminAuthStore } from '../features/auth/store/adminAuthStore';
import { SenikLogo } from '@senik/ui';

interface NavItem {
  to: string;
  label: string;
  icon: string;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/overview', label: 'Overview', icon: 'dashboard' },
  { to: '/orders', label: 'Live Orders', icon: 'receipt_long' },
  {
    to: '/transactions',
    label: 'Transactions',
    icon: 'account_balance_wallet',
  },
  { to: '/users', label: 'Users', icon: 'group' },
  { to: '/merchants', label: 'Merchants', icon: 'storefront' },
  { to: '/zones', label: 'Delivery Zones', icon: 'map' },
];

export function AdminSidebar() {
  const text = useText();
  const { adminName, adminEmail, adminRole, logout } = useAdminAuthStore();

  return (
    <aside className="w-full lg:w-64 min-w-0 bg-slate-900 border-r border-slate-800/80 flex flex-col justify-between flex-shrink-0">
      {/* Logo */}
      <div>
        <div className="px-5 py-5 border-b border-slate-800/60">
          <div className="flex items-center gap-3">
            <SenikLogo size="md" />
            <div>
              <span className="font-bold text-sm text-white block leading-tight">
                {text('Senik Admin')}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {text(adminRole || 'Console')}
              </span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="p-3 flex gap-1 overflow-x-auto lg:block lg:space-y-0.5">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-shrink-0 whitespace-nowrap items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/20'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              <span>{text(item.label ?? '')}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* User + Logout */}
      <div className="border-t border-slate-800/60 p-3 space-y-2">
        <div className="hidden lg:flex px-2 py-2 rounded-xl bg-slate-800/50 items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
            {adminName?.charAt(0)?.toUpperCase() ?? 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">{adminName}</p>
            <p className="text-[10px] text-slate-500 truncate">{adminEmail}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => void logout()}
          className="flex items-center gap-2 text-xs text-slate-400 hover:text-red-400 w-full px-3 py-2 rounded-xl transition-colors hover:bg-red-950/30"
        >
          <span className="material-symbols-outlined text-[16px]">logout</span>
          <span>{text('Sign Out')}</span>
        </button>
      </div>
    </aside>
  );
}
