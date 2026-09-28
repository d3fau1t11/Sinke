import React from 'react';
import { useApp } from '../context/AppContext';

export default function BusinessCard({ business, compact = false }) {
  const { lang, navigateTo } = useApp();

  const isAm = lang === 'am';
  const name = isAm ? business.nameAm : business.nameEn;
  const desc = isAm ? business.descriptionAm : business.descriptionEn;
  const location = isAm ? business.locationAm : business.locationEn;

  return (
    <div
      onClick={() => navigateTo('business-detail', { businessId: business.id })}
      className="bg-white rounded-2xl border border-[#e1bfb5]/70 overflow-hidden shadow-sm hover:shadow-md active:scale-[0.985] transition-all cursor-pointer flex flex-col group"
    >
      {/* Cover Image & Badges */}
      <div className="relative w-full h-36 sm:h-40 bg-[#f7ddd0] overflow-hidden">
        <img
          src={business.coverImage}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          {business.isOpen ? (
            <span className="bg-[#1b6d24] text-white text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              {isAm ? 'ክፍት ነው' : 'Open'}
            </span>
          ) : (
            <span className="bg-[#ba1a1a] text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              {isAm ? 'ተዘግቷል' : 'Closed'}
            </span>
          )}

          {business.isFastingFriendly && (
            <span className="bg-[#874e00]/90 backdrop-blur-sm text-[#fffbff] text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              {isAm ? 'የፆም' : 'Tsom'}
            </span>
          )}
        </div>

        {/* Top Right Delivery Speed */}
        <div className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
          <span className="material-symbols-outlined text-[13px] text-[#ffdbcf]">schedule</span>
          {business.deliveryEta}
        </div>

        {/* Bottom Avatar & Name Overlay */}
        <div className="absolute bottom-2 left-3 right-3 flex items-center gap-2">
          <img
            src={business.avatarImage}
            alt={name}
            className="w-10 h-10 rounded-xl object-cover border-2 border-white bg-white shadow-md shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-display font-bold text-[15px] truncate drop-shadow-md">
              {name}
            </h3>
            <p className="text-[#f7ddd0] text-[11px] truncate drop-shadow-sm">
              {location}
            </p>
          </div>
        </div>
      </div>

      {/* Card Info Details */}
      <div className="p-3 flex flex-col gap-2">
        <p className="text-[#594139] text-xs line-clamp-1">
          {desc}
        </p>

        <div className="flex items-center justify-between text-xs pt-1.5 border-t border-[#f7ddd0]">
          {/* Rating */}
          <div className="flex items-center gap-1 bg-[#ffdcbe]/60 px-2 py-0.5 rounded-md text-[#2d1600] font-bold">
            <span className="material-symbols-outlined text-[15px] text-[#aa6400] fill-icon">star</span>
            <span>{business.rating}</span>
            <span className="text-[10px] text-[#693c00] font-normal">({business.reviewsCount})</span>
          </div>

          {/* Delivery fee */}
          <div className="flex items-center gap-1 text-[#594139] font-medium">
            <span className="material-symbols-outlined text-[15px] text-[#1b6d24]">two_wheeler</span>
            <span>{business.deliveryFee} {isAm ? 'ብር' : 'ETB'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
