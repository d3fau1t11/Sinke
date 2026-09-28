import React from 'react';
import { useApp } from '../context/AppContext';

export default function CategoryCard({ category, isSelected = false, onClick = null }) {
  const { lang } = useApp();
  const isAm = lang === 'am';
  const name = isAm ? category.nameAm : category.nameEn;

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-2 rounded-2xl border transition-all active:scale-95 shrink-0 ${
        isSelected
          ? 'bg-[#a73400] text-white border-[#a73400] shadow-md shadow-[#a73400]/20'
          : 'bg-white text-[#261911] border-[#e1bfb5]/70 hover:border-[#a73400] shadow-2xs'
      } min-w-[72px]`}
    >
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center mb-1 transition-colors ${
          isSelected ? 'bg-white/20 text-white' : 'bg-[#fff1eb] text-[#a73400]'
        }`}
      >
        <span className="material-symbols-outlined text-[24px]">
          {category.icon}
        </span>
      </div>
      <span className={`text-[11px] font-semibold tracking-tight truncate max-w-[65px] ${isSelected ? 'text-white' : 'text-[#261911]'}`}>
        {name}
      </span>
    </button>
  );
}
