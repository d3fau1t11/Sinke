import React from 'react';
import { useApp } from '../context/AppContext';
import TibebStripe from './TibebStripe';

export default function HeaderBar({ showBack = false, title = null, onBack = null }) {
  const { lang, toggleLanguage, activeZoneObj, navigateTo, cartItemsCount } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-[#fff8f5]/95 backdrop-blur-md border-b border-[#f1e7e1] shadow-[0_2px_10px_rgba(45,31,23,0.04)]">
      <TibebStripe className="h-[3px] w-full" />
      
      <div className="flex items-center justify-between px-4 py-3">
        {showBack ? (
          <button
            onClick={onBack || (() => navigateTo('home'))}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#ffeadf] active:scale-95 transition-all text-[#261911]"
            aria-label="Back"
          >
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>
        ) : (
          <button 
            onClick={() => navigateTo('home')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <img
              src="/senik-logo.jpg"
              alt="ስንቅ Senik Logo"
              className="w-10 h-10 rounded-xl object-contain bg-white shadow-level-1 p-0.5"
            />
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1.5">
                <span className="font-display font-extrabold text-[20px] text-[#a73400] leading-none tracking-tight">
                  ስንቅ
                </span>
                <span className="font-bold text-[11px] text-[#aa6400] tracking-[0.12em]">
                  SENIK
                </span>
              </div>
              <span className="text-[11px] text-[#594139] leading-tight font-medium mt-0.5">
                {lang === 'am' ? 'የሰፈር ፈጣን ማድረሻ' : 'Hyperlocal Delivery'}
              </span>
            </div>
          </button>
        )}

        {/* Center Title if specified */}
        {title && (
          <h1 className="font-display font-bold text-[17px] text-[#261911] truncate px-2 text-center flex-1">
            {title}
          </h1>
        )}

        {/* Right Action Bar */}
        <div className="flex items-center gap-2">
          {!showBack && (
            <button
              onClick={() => navigateTo('location-select')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ffeadf] text-[#a73400] hover:bg-[#fde3d6] transition-colors text-[13px] font-bold"
              title="Change Delivery Zone"
            >
              <span className="material-symbols-outlined text-[16px]">near_me</span>
              <span className="truncate max-w-[85px]">
                {lang === 'am' ? activeZoneObj.nameAm : activeZoneObj.nameEn}
              </span>
            </button>
          )}

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white shadow-level-1 text-[#261911] hover:bg-[#fff1eb] active:scale-95 transition-all font-bold"
            aria-label="Toggle language"
          >
            <span className="material-symbols-outlined text-[16px] text-[#a73400]">translate</span>
            <span className="text-[13px] text-[#a73400] font-bold">
              {lang === 'am' ? 'EN' : 'አማ'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
