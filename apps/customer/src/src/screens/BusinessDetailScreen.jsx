import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BUSINESSES, PRODUCTS } from '../data/mockData';
import TibebStripe from '../components/TibebStripe';
import ProductCard from '../components/ProductCard';

export default function BusinessDetailScreen() {
  const { lang, activeBusinessId, navigateTo, cart, totalAmount, cartItemsCount } = useApp();
  const [selectedMenuTab, setSelectedMenuTab] = useState('all');
  const isAm = lang === 'am';

  const business = BUSINESSES.find((b) => b.id === activeBusinessId) || BUSINESSES[0];
  const businessProducts = PRODUCTS.filter((p) => p.businessId === business.id);

  const name = isAm ? business.nameAm : business.nameEn;
  const desc = isAm ? business.descriptionAm : business.descriptionEn;
  const location = isAm ? business.locationAm : business.locationEn;

  // Filter products by tab
  const filteredProducts = businessProducts.filter((p) => {
    if (selectedMenuTab === 'all') return true;
    if (selectedMenuTab === 'popular') return p.popular;
    if (selectedMenuTab === 'tsom') return p.isFasting;
    return true;
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#fff8f5] pb-28">
      {/* Hero Cover Banner */}
      <div className="relative h-52 sm:h-56 bg-[#f7ddd0] overflow-hidden">
        <img
          src={business.coverImage}
          alt={name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20"></div>

        <TibebStripe className="absolute top-0 left-0 right-0 h-1" />

        {/* Top Floating Back and Share buttons */}
        <div className="absolute top-3 left-4 right-4 flex items-center justify-between z-20">
          <button
            onClick={() => navigateTo('home')}
            className="w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 active:scale-90 transition-all backdrop-blur-sm border border-white/20"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {}}
              className="w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 active:scale-90 transition-all backdrop-blur-sm border border-white/20"
            >
              <span className="material-symbols-outlined text-[18px]">favorite_border</span>
            </button>
            <button
              onClick={() => {}}
              className="w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 active:scale-90 transition-all backdrop-blur-sm border border-white/20"
            >
              <span className="material-symbols-outlined text-[18px]">share</span>
            </button>
          </div>
        </div>

        {/* Store Title & Badges on Cover */}
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between z-20">
          <div className="flex items-center gap-3">
            <img
              src={business.avatarImage}
              alt={name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-white bg-white shadow-lg shrink-0"
            />
            <div className="text-white">
              <h1 className="font-display font-black text-xl leading-tight drop-shadow-md">
                {name}
              </h1>
              <p className="text-[#f7ddd0] text-xs flex items-center gap-1 drop-shadow-xs mt-0.5">
                <span className="material-symbols-outlined text-[14px] text-[#ffdbcf]">location_on</span>
                <span className="truncate max-w-[200px]">{location}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-3 space-y-4">
        {/* Key Metrics Bar */}
        <div className="bg-white rounded-2xl p-3 border border-[#e1bfb5] shadow-2xs flex items-center justify-around text-center text-xs">
          <div>
            <div className="flex items-center justify-center gap-1 text-[#aa6400] font-bold">
              <span className="material-symbols-outlined text-[16px] fill-icon">star</span>
              <span>{business.rating}</span>
            </div>
            <span className="text-[10px] text-[#594139]">{business.reviewsCount} {isAm ? 'ግምገማዎች' : 'reviews'}</span>
          </div>

          <div className="h-6 w-px bg-[#f7ddd0]"></div>

          <div>
            <div className="flex items-center justify-center gap-1 text-[#261911] font-bold">
              <span className="material-symbols-outlined text-[16px] text-[#a73400]">schedule</span>
              <span>{business.deliveryEta}</span>
            </div>
            <span className="text-[10px] text-[#594139]">{isAm ? 'የማድረሻ ጊዜ' : 'Delivery ETA'}</span>
          </div>

          <div className="h-6 w-px bg-[#f7ddd0]"></div>

          <div>
            <div className="flex items-center justify-center gap-1 text-[#261911] font-bold">
              <span className="material-symbols-outlined text-[16px] text-[#1b6d24]">two_wheeler</span>
              <span>{business.deliveryFee} {isAm ? 'ብር' : 'ETB'}</span>
            </div>
            <span className="text-[10px] text-[#594139]">{isAm ? 'የማድረሻ ክፍያ' : 'Delivery fee'}</span>
          </div>
        </div>

        {/* Business Description */}
        <p className="text-xs text-[#594139] leading-relaxed px-1">
          {desc}
        </p>

        {/* Menu Tabs */}
        <div className="flex gap-2 border-b border-[#e1bfb5] pb-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', labelAm: 'ሙሉ ሜኑ', labelEn: 'Full Menu' },
            { id: 'popular', labelAm: '⭐ ተወዳጅ', labelEn: '⭐ Popular' },
            { id: 'tsom', labelAm: '🌿 የፆም', labelEn: '🌿 Fasting (Tsom)' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedMenuTab(tab.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedMenuTab === tab.id
                  ? 'bg-[#a73400] text-white shadow-xs'
                  : 'bg-white text-[#594139] border border-[#e1bfb5]'
              }`}
            >
              {isAm ? tab.labelAm : tab.labelEn}
            </button>
          ))}
        </div>

        {/* Products List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-[#594139] px-1">
            <span className="font-bold text-[#261911]">
              {isAm ? 'የሚገኙ ምግቦችና እቃዎች' : 'Available Menu Items'}
            </span>
            <span>{filteredProducts.length} {isAm ? 'ዕቃዎች' : 'items'}</span>
          </div>

          <div className="space-y-2.5">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} horizontal={true} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="py-8 text-center text-[#594139] text-xs">
              {isAm ? 'በዚህ ምድብ ምንም እቃ አልተገኘም' : 'No items found in this section'}
            </div>
          )}
        </div>
      </div>

      {/* Floating View Cart Pill if cart is non-empty */}
      {cart.length > 0 && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-[400px]">
          <button
            onClick={() => navigateTo('cart')}
            className="w-full bg-[#a73400] hover:bg-[#cb4914] text-white py-3.5 px-4 rounded-2xl shadow-xl flex items-center justify-between active:scale-[0.98] transition-transform border border-white/20"
          >
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-white text-[#a73400] text-xs font-black flex items-center justify-center">
                {cartItemsCount}
              </span>
              <span className="font-bold text-sm">
                {isAm ? 'ቅርጫት ይመልከቱ' : 'View Cart'}
              </span>
            </div>
            <div className="flex items-center gap-1 font-display font-extrabold text-sm">
              <span>{totalAmount} {isAm ? 'ብር' : 'ETB'}</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
