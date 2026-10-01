import React from 'react';
import { useApp } from '../context/AppContext';
import TibebStripe from './TibebStripe';

export default function HeaderBar({ showBack = false, title = null, onBack = null }) {
  const { lang, toggleLanguage, activeZoneObj, navigateTo, cartItemsCount } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-[#fff8f5]/95 backdrop-blur-md border-b border-[#e1bfb5]/40 shadow-sm">
      <TibebStripe className="h-[3px] w-full" />
      
      <div className="flex items-center justify-between px-4 py-2.5">
        {showBack ? (
          <button
            onClick={onBack || (() => navigateTo('home'))}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#ffeadf] active:scale-95 transition-all text-[#261911]"
            aria-label="Back"
          >
            <span className="material-symbols-outlined text-[22px]">arrow_back</span>
          </button>
        ) : (
          <button 
            onClick={() => navigateTo('home')}
            className="flex items-center gap-2 text-left group focus:outline-none"
          >
            <img
              src="/senik-logo.jpg"
              alt="ስንቅ Senik Logo"
              className="w-9 h-9 rounded-xl object-contain bg-white shadow-sm border border-[#e1bfb5] p-0.5"
            />
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1">
                <span className="font-display font-extrabold text-[19px] text-[#a73400] leading-none tracking-tight">
                  ስንቅ
                </span>
                <span className="font-bold text-[11px] text-[#aa6400] tracking-wider">
                  SENIK
                </span>
              </div>
              <span className="text-[10px] text-[#594139] leading-none font-medium">
                {lang === 'am' ? 'የሰፈር ፈጣን ማድረሻ' : 'Hyperlocal Delivery'}
              </span>
            </div>
          </button>
        )}

        {/* Center Title if specified */}
        {title && (
          <h1 className="font-display font-bold text-[16px] text-[#261911] truncate px-2 text-center flex-1">
            {title}
          </h1>
        )}

        {/* Right Action Bar */}
        <div className="flex items-center gap-1.5">
          {!showBack && (
            <button
              onClick={() => navigateTo('location-select')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#ffeadf] border border-[#e1bfb5] text-[#a73400] hover:bg-[#fde3d6] transition-colors text-xs font-semibold"
              title="Change Delivery Zone"
            >
              <span className="material-symbols-outlined text-[15px] text-[#a73400]">near_me</span>
              <span className="truncate max-w-[85px]">
                {lang === 'am' ? activeZoneObj.nameAm : activeZoneObj.nameEn}
              </span>
            </button>
          )}

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-2 py-1 rounded-full bg-white border border-[#e1bfb5] text-[#261911] hover:bg-[#fff1eb] active:scale-95 transition-all text-xs font-bold shadow-2xs"
            aria-label="Toggle language"
          >
            <span className="material-symbols-outlined text-[14px] text-[#a73400]">translate</span>
            <span className="text-[11px] text-[#a73400] font-bold">
              {lang === 'am' ? 'EN' : 'አማ'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
