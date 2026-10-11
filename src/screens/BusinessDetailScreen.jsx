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
              <p className="text-[#f7ddd0] text-xs flex items-center gap-1 drop-shadow-sm mt-0.5">
                <span className="material-symbols-outlined text-[14px] text-[#ffdbcf]">location_on</span>
                <span className="truncate max-w-[200px]">{location}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-4 space-y-4">
        {/* Key Metrics Bar */}
        <div className="bg-white rounded-2xl p-3.5 shadow-level-1 flex items-center justify-around text-center">
          <div>
            <div className="flex items-center justify-center gap-1 text-[#aa6400] font-bold text-[14px]">
              <span className="material-symbols-outlined text-[17px] fill-icon">star</span>
              <span className="tnum">{business.rating}</span>
            </div>
            <span className="text-[11px] text-[#594139]">{business.reviewsCount} {isAm ? 'ግምገማዎች' : 'reviews'}</span>
          </div>

          <div className="h-6 w-px bg-[#f3ebe6]"></div>

          <div>
            <div className="flex items-center justify-center gap-1 text-[#261911] font-bold text-[14px]">
              <span className="material-symbols-outlined text-[17px] text-[#a73400]">schedule</span>
              <span className="tnum">{business.deliveryEta}</span>
            </div>
            <span className="text-[11px] text-[#594139]">{isAm ? 'የማድረሻ ጊዜ' : 'Delivery ETA'}</span>
          </div>

          <div className="h-6 w-px bg-[#f3ebe6]"></div>

          <div>
            <div className="flex items-center justify-center gap-1 text-[#261911] font-bold text-[14px]">
              <span className="material-symbols-outlined text-[17px] text-[#1b6d24]">two_wheeler</span>
              <span className="tnum">{business.deliveryFee} {isAm ? 'ብር' : 'ETB'}</span>
            </div>
            <span className="text-[11px] text-[#594139]">{isAm ? 'የማድረሻ ክፍያ' : 'Delivery fee'}</span>
          </div>
        </div>

        {/* Business Description */}
        <p className="text-[13px] text-[#594139] leading-relaxed px-1">
          {desc}
        </p>

        {/* Menu Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', labelAm: 'ሙሉ ሜኑ', labelEn: 'Full Menu' },
            { id: 'popular', labelAm: 'ተወዳጅ', labelEn: 'Popular' },
            { id: 'tsom', labelAm: 'የፆም (Tsom)', labelEn: 'Fasting (Tsom)' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedMenuTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-full text-[13px] font-semibold whitespace-nowrap transition-all ${
                selectedMenuTab === tab.id
                  ? 'bg-[#a73400] text-white shadow-[0_6px_16px_-8px_rgba(167,52,0,0.55)]'
                  : 'bg-[#f6ede8] text-[#594139] hover:bg-[#ffeadf]'
              }`}
            >
              {isAm ? tab.labelAm : tab.labelEn}
            </button>
          ))}
        </div>

        {/* Products List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-[13px] text-[#594139] px-1">
            <span className="font-bold text-[#261911]">
              {isAm ? 'የሚገኙ ምግቦችና እቃዎች' : 'Available Menu Items'}
            </span>
            <span className="tnum">{filteredProducts.length} {isAm ? 'ዕቃዎች' : 'items'}</span>
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
            className="w-full bg-[#a73400] hover:bg-[#963000] text-white py-4 px-4 rounded-2xl shadow-[0_16px_36px_-10px_rgba(167,52,0,0.55)] flex items-center justify-between active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-white text-[#a73400] text-[13px] font-black flex items-center justify-center tnum">
                {cartItemsCount}
              </span>
              <span className="font-bold text-[15px]">
                {isAm ? 'ቅርጫት ይመልከቱ' : 'View Cart'}
              </span>
            </div>
            <div className="flex items-center gap-1 font-display font-extrabold text-[15px] tnum">
              <span>{totalAmount} {isAm ? 'ብር' : 'ETB'}</span>
              <span className="material-symbols-outlined text-[19px]">arrow_forward</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
