import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, BUSINESSES, PRODUCTS } from '../data/mockData';
import HeaderBar from '../components/HeaderBar';
import ProductCard from '../components/ProductCard';
import BusinessCard from '../components/BusinessCard';

export default function SearchScreen() {
  const { lang, searchQuery, setSearchQuery, navigateTo } = useApp();
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'dishes', 'businesses'
  const [selectedCat, setSelectedCat] = useState('all');
  const isAm = lang === 'am';

  const query = (searchQuery || '').trim().toLowerCase();

  // Matching dishes
  const matchingProducts = PRODUCTS.filter((p) => {
    const matchesText =
      !query ||
      p.nameAm.toLowerCase().includes(query) ||
      p.nameEn.toLowerCase().includes(query) ||
      p.descriptionAm.toLowerCase().includes(query) ||
      p.descriptionEn.toLowerCase().includes(query) ||
      (p.tagsAm && p.tagsAm.some((t) => t.toLowerCase().includes(query))) ||
      (p.tagsEn && p.tagsEn.some((t) => t.toLowerCase().includes(query)));

    const matchesCat = selectedCat === 'all' || p.category === selectedCat;
    return matchesText && matchesCat;
  });

  // Matching businesses
  const matchingBusinesses = BUSINESSES.filter((b) => {
    const matchesText =
      !query ||
      b.nameAm.toLowerCase().includes(query) ||
      b.nameEn.toLowerCase().includes(query) ||
      b.descriptionAm.toLowerCase().includes(query) ||
      b.descriptionEn.toLowerCase().includes(query) ||
      (b.tagsAm && b.tagsAm.some((t) => t.toLowerCase().includes(query))) ||
      (b.tagsEn && b.tagsEn.some((t) => t.toLowerCase().includes(query)));

    const matchesCat = selectedCat === 'all' || b.category === selectedCat;
    return matchesText && matchesCat;
  });

  const popularKeywords = [
    { am: 'ጥብስ', en: 'Tibs' },
    { am: 'ሽሮ', en: 'Shiro' },
    { am: 'ክትፎ', en: 'Kitfo' },
    { am: 'ቡና / ማኪያቶ', en: 'Buna / Coffee' },
    { am: 'ጤፍ ዱቄት', en: 'Teff Flour' },
    { am: 'አምባሻ', en: 'Ambasha' },
    { am: 'ፓናዶል', en: 'Panadol' },
    { am: 'በያይነቱ', en: 'Beyaynetu' }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#fff8f5] pb-24">
      <HeaderBar showBack={true} onBack={() => navigateTo('home')} title={isAm ? 'ፍለጋ' : 'Search'} />

      <div className="flex-1 px-4 py-3 space-y-4">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAm ? "ምግብ፣ ሸቀጥ፣ ምግብ ቤቶችን ይፈልጉ..." : "Search dishes, groceries, restaurants..."}
            autoFocus
            className="w-full bg-white rounded-2xl border-2 border-[#e1bfb5] focus:border-[#a73400] pl-10 pr-10 py-3 text-sm text-[#261911] shadow-sm outline-none transition-colors"
          />
          <span className="material-symbols-outlined absolute left-3 top-3.5 text-[#a73400] text-[20px]">
            search
          </span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-[#594139] hover:text-[#261911] p-1"
            >
              <span className="material-symbols-outlined text-[18px]">cancel</span>
            </button>
          )}
        </div>

        {/* Quick Suggestion Chips when empty */}
        {!query && (
          <div className="space-y-2">
            <h4 className="font-display font-bold text-xs text-[#594139] uppercase tracking-wider">
              {isAm ? 'ተወዳጅ ፍለጋዎች' : 'Trending Searches'}
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {popularKeywords.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setSearchQuery(isAm ? item.am : item.en)}
                  className="bg-white hover:bg-[#fff1eb] text-[#261911] text-xs font-semibold px-3 py-1.5 rounded-full border border-[#e1bfb5] shadow-2xs active:scale-95 transition-all flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px] text-[#a73400]">trending_up</span>
                  <span>{isAm ? item.am : item.en}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Category Filters */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedCat('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
              selectedCat === 'all'
                ? 'bg-[#a73400] text-white border-[#a73400]'
                : 'bg-white text-[#594139] border-[#e1bfb5]'
            }`}
          >
            {isAm ? 'ሁሉም ምድብ' : 'All Categories'}
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border flex items-center gap-1 ${
                selectedCat === cat.id
                  ? 'bg-[#a73400] text-white border-[#a73400]'
                  : 'bg-white text-[#594139] border-[#e1bfb5]'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">{cat.icon}</span>
              <span>{isAm ? cat.nameAm : cat.nameEn}</span>
            </button>
          ))}
        </div>

        {/* Segment Tabs: All / Dishes / Businesses */}
        <div className="flex bg-[#ffeadf] p-1 rounded-xl border border-[#e1bfb5] text-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'all' ? 'bg-white text-[#a73400] shadow-xs' : 'text-[#594139]'
            }`}
          >
            {isAm ? 'ሁሉም' : 'All'} ({matchingProducts.length + matchingBusinesses.length})
          </button>
          <button
            onClick={() => setActiveTab('dishes')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'dishes' ? 'bg-white text-[#a73400] shadow-xs' : 'text-[#594139]'
            }`}
          >
            {isAm ? 'ምግቦችና እቃዎች' : 'Items'} ({matchingProducts.length})
          </button>
          <button
            onClick={() => setActiveTab('businesses')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'businesses' ? 'bg-white text-[#a73400] shadow-xs' : 'text-[#594139]'
            }`}
          >
            {isAm ? 'ሱቆች' : 'Businesses'} ({matchingBusinesses.length})
          </button>
        </div>

        {/* Results List */}
        <div className="space-y-4 pt-1">
          {(activeTab === 'all' || activeTab === 'dishes') && matchingProducts.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-display font-bold text-sm text-[#261911] flex items-center justify-between">
                <span>{isAm ? 'ምግቦችና ምርቶች' : 'Dishes & Products'}</span>
                <span className="text-xs text-[#594139]">{matchingProducts.length} {isAm ? 'ተገኝተዋል' : 'found'}</span>
              </h3>
              <div className="space-y-2">
                {matchingProducts.map((prod) => (
                  <ProductCard key={prod.id} product={prod} horizontal={true} />
                ))}
              </div>
            </div>
          )}

          {(activeTab === 'all' || activeTab === 'businesses') && matchingBusinesses.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-display font-bold text-sm text-[#261911] flex items-center justify-between">
                <span>{isAm ? 'ሱቆችና ምግብ ቤቶች' : 'Businesses & Stores'}</span>
                <span className="text-xs text-[#594139]">{matchingBusinesses.length} {isAm ? 'ተገኝተዋል' : 'found'}</span>
              </h3>
              <div className="space-y-3">
                {matchingBusinesses.map((biz) => (
                  <BusinessCard key={biz.id} business={biz} />
                ))}
              </div>
            </div>
          )}

          {matchingProducts.length === 0 && matchingBusinesses.length === 0 && (
            <div className="py-12 text-center flex flex-col items-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#ffeadf] flex items-center justify-center text-[#a73400]">
                <span className="material-symbols-outlined text-[32px]">search_off</span>
              </div>
              <h3 className="font-display font-bold text-base text-[#261911]">
                {isAm ? 'ምንም ውጤት አልተገኘም' : 'No matches found'}
              </h3>
              <p className="text-xs text-[#594139] max-w-[240px]">
                {isAm 
                  ? 'እባክዎን ሌላ ቃል ወይም የፊደል አጻጻፍ ሞክረው ይፈልጉ።'
                  : 'Try searching for different terms like Tibs, Shiro, Buna, or Teff.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
