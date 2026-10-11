import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, PROMOTIONS, BUSINESSES, PRODUCTS } from '../data/mockData';
import HeaderBar from '../components/HeaderBar';
import PromoCarousel from '../components/PromoCarousel';
import CategoryCard from '../components/CategoryCard';
import BusinessCard from '../components/BusinessCard';
import ProductCard from '../components/ProductCard';

export default function HomeScreen() {
  const {
    lang,
    activeZoneObj,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    navigateTo,
    applyPromoCode
  } = useApp();

  const [activePromoIndex, setActivePromoIndex] = useState(0);
  const isAm = lang === 'am';

  // Filter businesses by active zone and category if any
  const filteredBusinesses = BUSINESSES.filter(
    (b) => selectedCategoryFilter === 'all' || b.category === selectedCategoryFilter
  );

  // Popular products
  const popularProducts = PRODUCTS.filter((p) => p.popular);

  return (
    <div className="flex flex-col min-h-screen bg-[#fff8f5] pb-24">
      <HeaderBar />

      <div className="flex-1 px-4 py-4 space-y-6">
        {/* Greeting + Search — one calm block */}
        <section className="space-y-3.5">
          <div className="flex items-center gap-1.5 text-[#594139] text-[13px] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#1b6d24] animate-pulse" />
            <span>{isAm ? 'ሰላም ዳዊት ታደሰ' : 'Hello, Dawit Tadesse'}</span>
          </div>

          <h2 className="font-display font-extrabold text-[26px] text-[#261911] leading-[1.15] tracking-tight">
            {isAm ? 'ምን እናቅርብልዎ?' : 'What can we bring you?'}
          </h2>

          <button
            onClick={() => navigateTo('search')}
            className="w-full bg-white rounded-2xl px-4 py-3.5 flex items-center gap-3 text-[14px] text-[#8d7168] shadow-level-1 hover:shadow-level-2 transition-shadow cursor-pointer"
            aria-label={isAm ? 'ይፈልጉ' : 'Search'}
          >
            <span className="material-symbols-outlined text-[22px] text-[#a73400]">search</span>
            <span className="flex-1 text-left truncate">
              {isAm ? 'ምግብ፣ ሸቀጥ፣ ምግብ ቤቶችን ይፈልጉ...' : 'Search dishes, groceries, pharmacies...'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#fff1eb] flex items-center justify-center text-[#a73400]">
              <span className="material-symbols-outlined text-[18px]">tune</span>
            </div>
          </button>
        </section>

        {/* Promotional Hero */}
        <PromoCarousel
          promos={PROMOTIONS}
          activeIndex={activePromoIndex}
          onActiveChange={setActivePromoIndex}
          onApply={applyPromoCode}
          isAm={isAm}
        />

        {/* Categories */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-extrabold text-[17px] text-[#261911]">
              {isAm ? 'የአገልግሎት ምድቦች' : 'Categories'}
            </h3>
            {selectedCategoryFilter !== 'all' && (
              <button
                onClick={() => setSelectedCategoryFilter('all')}
                className="text-[13px] text-[#a73400] font-bold"
              >
                {isAm ? 'ሁሉንም አሳይ' : 'Show All'}
              </button>
            )}
          </div>

          <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <CategoryCard
                key={cat.id}
                category={cat}
                isSelected={selectedCategoryFilter === cat.id}
                onClick={() =>
                  setSelectedCategoryFilter(selectedCategoryFilter === cat.id ? 'all' : cat.id)
                }
              />
            ))}
          </div>
        </section>

        {/* Popular Dishes */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-extrabold text-[17px] text-[#261911]">
              {isAm ? 'ተወዳጅ ምግቦች' : 'Popular Dishes'}
            </h3>
            <span className="text-[13px] text-[#594139] font-medium">
              {isAm ? 'በአካባቢዎ የተመረጡ' : 'Trending in Zone'}
            </span>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {popularProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>

        {/* Nearby Businesses */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-extrabold text-[17px] text-[#261911]">
                {isAm ? 'በአቅራቢያ ያሉ ሱቆችና ምግብ ቤቶች' : 'Nearby Businesses'}
              </h3>
              <p className="text-[12px] text-[#594139] mt-0.5">
                {isAm
                  ? `${activeZoneObj.nameAm} እና አካባቢው`
                  : `In and around ${activeZoneObj.nameEn}`}
              </p>
            </div>
            <button
              onClick={() => navigateTo('business-list')}
              className="text-[13px] text-[#a73400] font-bold shrink-0"
            >
              {isAm ? 'ዝርዝር እይ' : 'View All'}
            </button>
          </div>

          <div className="space-y-4">
            {filteredBusinesses.map((biz) => (
              <BusinessCard key={biz.id} business={biz} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
