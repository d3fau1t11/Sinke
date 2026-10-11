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

      <div className="flex-1 px-4 py-4 space-y-3">
        {/* Category Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedCategoryFilter('all')}
            className={`px-3.5 py-1.5 rounded-full text-[13px] font-semibold whitespace-nowrap transition-all ${
              selectedCategoryFilter === 'all'
                ? 'bg-[#a73400] text-white shadow-[0_6px_16px_-8px_rgba(167,52,0,0.55)]'
                : 'bg-[#f6ede8] text-[#594139] hover:bg-[#ffeadf]'
            }`}
          >
            {isAm ? 'ሁሉም ምድብ' : 'All Categories'}
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryFilter(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-[13px] font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCategoryFilter === cat.id
                  ? 'bg-[#a73400] text-white shadow-[0_6px_16px_-8px_rgba(167,52,0,0.55)]'
                  : 'bg-[#f6ede8] text-[#594139] hover:bg-[#ffeadf]'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">{cat.icon}</span>
              <span>{isAm ? cat.nameAm : cat.nameEn}</span>
            </button>
          ))}
        </div>

        {/* Zone Filter Chips (secondary filter — dark selection) */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setActiveZone('all')}
            className={`px-3.5 py-1.5 rounded-full text-[12px] font-bold transition-all ${
              activeZone === 'all'
                ? 'bg-[#261911] text-white shadow-sm'
                : 'bg-[#f6ede8] text-[#594139] hover:bg-[#ffeadf]'
            }`}
          >
            {isAm ? 'ሁሉም ሰፈሮች' : 'All Zones'}
          </button>
          {NEIGHBORHOODS.map((n) => (
            <button
              key={n.id}
              onClick={() => setActiveZone(n.id)}
              className={`px-3.5 py-1.5 rounded-full text-[12px] font-bold transition-all ${
                activeZone === n.id
                  ? 'bg-[#261911] text-white shadow-sm'
                  : 'bg-[#f6ede8] text-[#594139] hover:bg-[#ffeadf]'
              }`}
            >
              {isAm ? n.nameAm : n.nameEn}
            </button>
          ))}
        </div>

        {/* Business Cards Feed */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between text-[13px] text-[#594139] px-1">
            <span className="tnum">{filteredBusinesses.length} {isAm ? 'ሱቆች ተገኝተዋል' : 'merchants found'}</span>
            <span className="flex items-center gap-1.5 text-[#1b6d24] font-semibold">
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
