import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, PROMOTIONS, BUSINESSES, PRODUCTS, INITIAL_ORDERS } from '../data/mockData';
import HeaderBar from '../components/HeaderBar';
import CategoryCard from '../components/CategoryCard';
import BusinessCard from '../components/BusinessCard';
import ProductCard from '../components/ProductCard';

export default function HomeScreen() {
  const {
    lang,
    activeZoneObj,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    dietaryFilter,
    setDietaryFilter,
    deliveryMode,
    setDeliveryMode,
    navigateTo,
    applyPromoCode,
    handleReorder
  } = useApp();

  const [activePromoIndex, setActivePromoIndex] = useState(0);
  const isAm = lang === 'am';

  // Filter businesses by active zone and category if any
  const filteredBusinesses = BUSINESSES.filter((b) => {
    const matchesCategory = selectedCategoryFilter === 'all' || b.category === selectedCategoryFilter;
    const matchesDietary =
      dietaryFilter === 'all' ||
      (dietaryFilter === 'fasting' && b.isFastingFriendly) ||
      (dietaryFilter === 'halal' && b.isHalal) ||
      (dietaryFilter === 'top' && b.rating >= 4.8);
    return matchesCategory && matchesDietary;
  });

  // Popular products
  const popularProducts = PRODUCTS.filter((p) => p.popular);

  return (
    <div className="flex flex-col min-h-screen bg-[#fff8f5] pb-24">
      <HeaderBar />

      <div className="flex-1 px-4 py-3 space-y-5">
        {/* User Greeting & Delivery Subtitle */}
        <section className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1 text-[#594139] text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#1b6d24] animate-pulse"></span>
              <span>{isAm ? 'ሰላም ዳዊት ታደሰ' : 'Hello, Dawit Tadesse'}</span>
            </div>
            <h2 className="font-display font-extrabold text-xl text-[#261911] leading-tight">
              {isAm ? 'ምን እናቅርብልዎ?' : 'What can we bring you?'}
            </h2>
          </div>

          <button
            onClick={() => navigateTo('location-select')}
            className="flex items-center gap-1.5 bg-white border border-[#e1bfb5] px-3 py-1.5 rounded-full text-xs font-bold text-[#a73400] shadow-2xs hover:bg-[#fff1eb] active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">location_on</span>
            <span className="truncate max-w-[110px]">
              {isAm ? activeZoneObj.nameAm : activeZoneObj.nameEn}
            </span>
            <span className="material-symbols-outlined text-[14px] text-[#594139]">expand_more</span>
          </button>
        </section>

        {/* Search Bar Input */}
        <section>
          <div
            onClick={() => navigateTo('search')}
            className="w-full bg-white rounded-2xl border border-[#e1bfb5] px-3.5 py-2.5 flex items-center gap-2.5 text-xs text-[#594139] shadow-sm hover:border-[#a73400] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px] text-[#a73400]">search</span>
            <span className="flex-1 text-[#8d7168] truncate">
              {isAm ? 'ምግብ፣ ሸቀጥ፣ ምግብ ቤቶችን ይፈልጉ...' : 'Search dishes, groceries, pharmacies...'}
            </span>
            <div className="w-7 h-7 rounded-xl bg-[#fff1eb] flex items-center justify-center text-[#a73400]">
              <span className="material-symbols-outlined text-[16px]">tune</span>
            </div>
          </div>
        </section>

        {/* Delivery Vehicle / Mode Switcher */}
        <section className="bg-white rounded-2xl p-1.5 border border-[#e1bfb5] shadow-2xs flex items-center justify-between text-xs">
          <button
            onClick={() => setDeliveryMode('bajaj')}
            className={`flex-1 py-2 px-1.5 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              deliveryMode === 'bajaj'
                ? 'bg-[#a73400] text-white font-bold shadow-xs'
                : 'text-[#594139] hover:bg-[#fff1eb]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">two_wheeler</span>
            <span>{isAm ? 'ባጃጅ 15-25ደ' : 'Bajaj 15-25m'}</span>
          </button>

          <button
            onClick={() => setDeliveryMode('motor')}
            className={`flex-1 py-2 px-1.5 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              deliveryMode === 'motor'
                ? 'bg-[#a73400] text-white font-bold shadow-xs'
                : 'text-[#594139] hover:bg-[#fff1eb]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">moped</span>
            <span>{isAm ? 'ሞተር 10-20ደ' : 'Motor 10-20m'}</span>
          </button>

          <button
            onClick={() => setDeliveryMode('carry')}
            className={`flex-1 py-2 px-1.5 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              deliveryMode === 'carry'
                ? 'bg-[#a73400] text-white font-bold shadow-xs'
                : 'text-[#594139] hover:bg-[#fff1eb]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">local_shipping</span>
            <span>{isAm ? 'ካሪ ቫን' : 'Carry Van'}</span>
          </button>
        </section>

        {/* Promotional Carousel Banner */}
        <section className="relative overflow-hidden rounded-2xl shadow-md border border-[#e1bfb5]/40">
          {PROMOTIONS.map((promo, idx) => {
            if (idx !== activePromoIndex) return null;
            const title = isAm ? promo.titleAm : promo.titleEn;
            const desc = isAm ? promo.descAm : promo.descEn;
            const tag = isAm ? promo.tagAm : promo.tagEn;

            return (
              <div
                key={promo.id}
                className={`bg-gradient-to-r ${promo.bgGradient} p-4 text-white flex justify-between items-center relative overflow-hidden`}
              >
                {/* Traditional geometric pattern backdrop */}
                <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/10 pointer-events-none"></div>

                <div className="space-y-1 relative z-10 max-w-[70%]">
                  <span className="inline-block bg-black/30 backdrop-blur-xs text-white text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                    {tag}
                  </span>
                  <h3 className="font-display font-extrabold text-base leading-tight drop-shadow-xs">
                    {title}
                  </h3>
                  <p className="text-[11px] text-white/90 leading-snug">
                    {desc}
                  </p>
                  <button
                    onClick={() => applyPromoCode(promo.code)}
                    className="mt-2 inline-flex items-center gap-1 bg-white text-[#a73400] text-xs font-bold px-3 py-1 rounded-full shadow-sm active:scale-95 transition-transform"
                  >
                    <span>{isAm ? 'ኮዱን ተግብር' : 'Apply'}</span>
                    <span className="font-mono font-extrabold underline">{promo.code}</span>
                  </button>
                </div>

                <div className="flex flex-col items-center gap-2 relative z-10 shrink-0">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white shadow-inner">
                    <span className="material-symbols-outlined text-[26px]">celebration</span>
                  </div>
                  {/* Indicators */}
                  <div className="flex gap-1">
                    {PROMOTIONS.map((_, dotIdx) => (
                      <button
                        key={dotIdx}
                        onClick={() => setActivePromoIndex(dotIdx)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          dotIdx === activePromoIndex ? 'bg-white w-4' : 'bg-white/40'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* Categories Horizontal Scroller */}
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-base text-[#261911]">
              {isAm ? 'የአገልግሎት ምድቦች' : 'Categories'}
            </h3>
            <button
              onClick={() => setSelectedCategoryFilter('all')}
              className="text-xs text-[#a73400] font-semibold hover:underline"
            >
              {isAm ? 'ሁሉንም አሳይ' : 'Show All'}
            </button>
          </div>

          <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <CategoryCard
                key={cat.id}
                category={cat}
                isSelected={selectedCategoryFilter === cat.id}
                onClick={() => {
                  setSelectedCategoryFilter(selectedCategoryFilter === cat.id ? 'all' : cat.id);
                }}
              />
            ))}
          </div>
        </section>

        {/* Dietary / Quick Filter Chips */}
        <section className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'all', labelAm: 'ሁሉም', labelEn: 'All' },
            { id: 'fasting', labelAm: '🌿 የፆም (Tsom)', labelEn: '🌿 Fasting (Tsom)' },
            { id: 'halal', labelAm: '🥩 ሃላል (Halal)', labelEn: '🥩 Halal' },
            { id: 'top', labelAm: '⭐ ምርጥ ደረጃ', labelEn: '⭐ Top Rated' }
          ].map((chip) => (
            <button
              key={chip.id}
              onClick={() => setDietaryFilter(chip.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                dietaryFilter === chip.id
                  ? 'bg-[#261911] text-white border-[#261911] shadow-xs'
                  : 'bg-white text-[#594139] border-[#e1bfb5] hover:border-[#8d7168]'
              }`}
            >
              {isAm ? chip.labelAm : chip.labelEn}
            </button>
          ))}
        </section>

        {/* Popular Dishes Carousel */}
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-base text-[#261911]">
              {isAm ? 'ተወዳጅ ምግቦች' : 'Popular Dishes'}
            </h3>
            <span className="text-xs text-[#594139] font-medium">
              {isAm ? 'በአካባቢዎ የተመረጡ' : 'Trending in Zone'}
            </span>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {popularProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>

        {/* Nearby Local Businesses List */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-base text-[#261911]">
                {isAm ? 'በአቅራቢያ ያሉ ሱቆችና ምግብ ቤቶች' : 'Nearby Businesses'}
              </h3>
              <p className="text-[11px] text-[#594139]">
                {isAm ? `${activeZoneObj.nameAm} እና አካባቢው` : `In and around ${activeZoneObj.nameEn}`}
              </p>
            </div>
            <button
              onClick={() => navigateTo('business-list')}
              className="text-xs text-[#a73400] font-bold hover:underline"
            >
              {isAm ? 'ዝርዝር እይ' : 'View All'}
            </button>
          </div>

          <div className="space-y-3">
            {filteredBusinesses.map((biz) => (
              <BusinessCard key={biz.id} business={biz} />
            ))}
          </div>
        </section>

        {/* Recently Ordered Fast Reorder Card */}
        {INITIAL_ORDERS.length > 0 && (
          <section className="bg-[#fff1eb] rounded-2xl p-3.5 border border-[#e1bfb5] space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-display font-bold text-xs text-[#a73400] uppercase tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">history</span>
                <span>{isAm ? 'የቅርብ ጊዜ ትዕዛዝዎን ይድገሙ' : 'Fast Reorder'}</span>
              </h4>
              <button
                onClick={() => navigateTo('orders')}
                className="text-[11px] text-[#594139] hover:underline font-semibold"
              >
                {isAm ? 'ሁሉንም እይ' : 'History'}
              </button>
            </div>

            <div className="bg-white rounded-xl p-3 border border-[#e1bfb5] flex items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <img
                  src={INITIAL_ORDERS[0].businessImage}
                  alt={INITIAL_ORDERS[0].businessNameAm}
                  className="w-10 h-10 rounded-xl object-cover"
                />
                <div>
                  <h5 className="font-bold text-xs text-[#261911]">
                    {isAm ? INITIAL_ORDERS[0].businessNameAm : INITIAL_ORDERS[0].businessNameEn}
                  </h5>
                  <p className="text-[11px] text-[#594139]">
                    {INITIAL_ORDERS[0].items.length} {isAm ? 'ዕቃዎች' : 'items'} • {INITIAL_ORDERS[0].total} {isAm ? 'ብር' : 'ETB'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleReorder(INITIAL_ORDERS[0])}
                className="bg-[#a73400] hover:bg-[#cb4914] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-2xs active:scale-95 transition-all flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">replay</span>
                <span>{isAm ? 'እንደገና እዘዝ' : 'Reorder'}</span>
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
