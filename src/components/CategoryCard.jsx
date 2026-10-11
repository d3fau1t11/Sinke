import React from 'react';
import { useApp } from '../context/AppContext';

export default function CategoryCard({ category, isSelected = false, onClick = null }) {
  const { lang } = useApp();
  const isAm = lang === 'am';
  const name = isAm ? category.nameAm : category.nameEn;

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-2.5 rounded-2xl transition-all active:scale-95 shrink-0 ${
        isSelected
          ? 'bg-[#a73400] text-white shadow-[0_8px_20px_-8px_rgba(167,52,0,0.5)]'
          : 'bg-white text-[#261911] shadow-level-1 hover:bg-[#fff8f5]'
      } min-w-[76px]`}
    >
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center mb-1.5 transition-colors ${
          isSelected ? 'bg-white/20 text-white' : 'bg-[#fff1eb] text-[#a73400]'
        }`}
      >
        <span className="material-symbols-outlined text-[24px]">
          {category.icon}
        </span>
      </div>
      <span className={`text-[12px] font-bold tracking-tight truncate max-w-[68px] ${isSelected ? 'text-white' : 'text-[#261911]'}`}>
        {name}
      </span>
    </button>
  );
}
