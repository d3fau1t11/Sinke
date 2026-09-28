import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

export default function AndroidFrame({ children }) {
  const [timeStr, setTimeStr] = useState('09:41');
  const [isPhoneFrame, setIsPhoneFrame] = useState(true);
  const { lang, toggleLanguage } = useApp();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const mins = now.getMinutes().toString().padStart(2, '0');
      setTimeStr(`${hours}:${mins}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#221814] flex flex-col items-center justify-start sm:py-6 sm:px-4 antialiased">
      {/* Desktop Helper Toolbar */}
      <div className="hidden sm:flex items-center justify-between w-full max-w-[430px] mb-3 px-2 text-xs text-[#efd5c8]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
          <span className="font-semibold tracking-wide">ስንቅ • SENIK ANDROID PROTOTYPE</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 bg-[#3c2d25] hover:bg-[#594139] text-[#ffdbcf] px-2.5 py-1 rounded-full text-xs font-semibold transition-colors border border-[#8d7168]/40"
          >
            <span className="material-symbols-outlined text-[14px]">translate</span>
            {lang === 'am' ? 'English' : 'አማርኛ'}
          </button>
          <button
            onClick={() => setIsPhoneFrame(!isPhoneFrame)}
            className="flex items-center gap-1 bg-[#3c2d25] hover:bg-[#594139] text-[#ffdbcf] px-2.5 py-1 rounded-full text-xs transition-colors border border-[#8d7168]/40"
            title="Toggle Device Frame"
          >
            <span className="material-symbols-outlined text-[14px]">
              {isPhoneFrame ? 'fullscreen' : 'smartphone'}
            </span>
            {isPhoneFrame ? 'Expand' : 'Frame'}
          </button>
        </div>
      </div>

      {/* Android Device Shell Container */}
      <div
        className={`w-full ${
          isPhoneFrame
            ? 'max-w-[430px] sm:rounded-[36px] sm:border-[8px] sm:border-[#33241c] sm:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)]'
            : 'max-w-[600px] sm:rounded-2xl'
        } bg-[#fff8f5] text-[#261911] flex flex-col relative min-h-screen overflow-hidden`}
        style={{
          boxShadow: isPhoneFrame ? '0 0 0 1px rgba(255,255,255,0.08), 0 30px 70px rgba(0,0,0,0.6)' : 'none'
        }}
      >
        {/* Status Bar */}
        <div className="w-full px-5 pt-2 pb-1 flex justify-between items-center bg-[#fff8f5] text-[#261911] select-none z-30 shrink-0">
          <span className="font-sans text-[13px] font-bold tracking-tight text-[#261911]">
            {timeStr}
          </span>

          {/* Android Center Camera Punchhole */}
          <div className="w-3.5 h-3.5 rounded-full bg-[#18100b] border border-[#33241c] hidden sm:block"></div>

          <div className="flex items-center space-x-1.5 text-[#261911]">
            <span className="material-symbols-outlined text-[15px] font-semibold">network_wifi</span>
            <span className="material-symbols-outlined text-[15px] font-semibold">signal_cellular_4_bar</span>
            <span className="material-symbols-outlined text-[15px] font-semibold">battery_5_bar</span>
          </div>
        </div>

        {/* Screen Dynamic Content */}
        <div className="flex-1 flex flex-col relative overflow-y-auto no-scrollbar">
          {children}
        </div>

        {/* Android Gesture Navigation Bar Pill */}
        <div className="w-full flex justify-center items-center py-1.5 bg-[#fff8f5] z-30 shrink-0">
          <div className="w-32 h-1 bg-[#594139]/40 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
