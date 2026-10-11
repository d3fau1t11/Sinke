import React from 'react';
import { useApp } from '../context/AppContext';

export default function Toast() {
  const { toast } = useApp();

  if (!toast) return null;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[380px] bg-[#261911]/95 text-white px-4 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 backdrop-blur-md animate-bounce-short">
      <span className="material-symbols-outlined text-[#a0f399] text-[22px] shrink-0">
        {toast.icon || 'check_circle'}
      </span>
      <p className="text-[13px] font-semibold leading-snug flex-1">
        {toast.message}
      </p>
    </div>
  );
}
