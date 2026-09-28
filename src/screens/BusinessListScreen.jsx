import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, BUSINESSES, NEIGHBORHOODS } from '../data/mockData';
import HeaderBar from '../components/HeaderBar';
import BusinessCard from '../components/BusinessCard';

export default function BusinessListScreen() {
  const { lang, selectedLocation, selectedCategoryFilter, setSelectedCategoryFilter, navigateTo } = useApp();
  const [activeZone, setActiveZone] = useState('all');
  const isAm = lang === 'am';

  const filteredBusinesses = BUSINESSES.filter((b) => {
    const matchesCategory = selectedCategoryFilter === 'all' || b.category === selectedCategoryFilter;
    const matchesZone = activeZone === 'all' || b.zoneId === activeZone;
    return matchesCategory && matchesZone;
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#fff8f5] pb-24">
      <HeaderBar
        showBack={true}
        onBack={() => navigateTo('home')}
        title={isAm ? 'የሰፈር ሱቆችና ምግብ ቤቶች' : 'Local Businesses'}
      />

      <div className="flex-1 px-4 py-3 space-y-4">
        {/* Category Filter Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
              selectedCategoryFilter === 'all'
                ? 'bg-[#a73400] text-white border-[#a73400]'
                : 'bg-white text-[#594139] border-[#e1bfb5]'
            }`}
          >
            {isAm ? 'ሁሉም ምድብ' : 'All Categories'}
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border flex items-center gap-1 ${
                selectedCategoryFilter === cat.id
                  ? 'bg-[#a73400] text-white border-[#a73400]'
                  : 'bg-white text-[#594139] border-[#e1bfb5]'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">{cat.icon}</span>
              <span>{isAm ? cat.nameAm : cat.nameEn}</span>
            </button>
          ))}
        </div>

        {/* Zone Filter Chips */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setActiveZone('all')}
            className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all border ${
              activeZone === 'all'
                ? 'bg-[#261911] text-white border-[#261911]'
                : 'bg-[#fff1eb] text-[#594139] border-[#e1bfb5]'
            }`}
          >
            {isAm ? 'ሁሉም ሰፈሮች' : 'All Zones'}
          </button>
          {NEIGHBORHOODS.map((n) => (
            <button
              key={n.id}
              onClick={() => setActiveZone(n.id)}
              className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all border ${
                activeZone === n.id
                  ? 'bg-[#261911] text-white border-[#261911]'
                  : 'bg-[#fff1eb] text-[#594139] border-[#e1bfb5]'
              }`}
            >
              {isAm ? n.nameAm : n.nameEn}
            </button>
          ))}
        </div>

        {/* Business Cards Feed */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between text-xs text-[#594139] px-1">
            <span>{filteredBusinesses.length} {isAm ? 'ሱቆች ተገኝተዋል' : 'merchants found'}</span>
            <span className="flex items-center gap-1 text-[#1b6d24] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1b6d24] animate-pulse"></span>
              {isAm ? 'ፈጣን ማድረሻ ክፍት' : 'Fast Delivery Open'}
            </span>
          </div>

          {filteredBusinesses.map((biz) => (
            <BusinessCard key={biz.id} business={biz} />
          ))}

          {filteredBusinesses.length === 0 && (
            <div className="py-12 text-center text-[#594139] space-y-2">
              <span className="material-symbols-outlined text-[36px] text-[#aa6400]">storefront</span>
              <p className="text-sm font-semibold">{isAm ? 'በዚህ ምድብ ምንም ሱቅ አልተገኘም' : 'No merchants found in this zone'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
