import React from 'react';
import { useApp } from '../context/AppContext';

export default function ProductCard({ product, horizontal = false }) {
  const { lang, setActiveProduct, addToCart } = useApp();
  const isAm = lang === 'am';

  const name = isAm ? product.nameAm : product.nameEn;
  const desc = isAm ? product.descriptionAm : product.descriptionEn;

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    if (product.options && product.options.length > 0) {
      setActiveProduct(product);
    } else {
      addToCart(product, 1);
    }
  };

  if (horizontal) {
    return (
      <div
        onClick={() => setActiveProduct(product)}
        className="bg-white rounded-2xl p-3.5 shadow-level-1 hover:shadow-level-2 active:scale-[0.985] transition-all cursor-pointer flex gap-3.5 group items-center"
      >
        <img
          src={product.image}
          alt={name}
          className="w-20 h-20 rounded-xl object-cover shrink-0 bg-[#f7ddd0] group-hover:scale-105 transition-transform"
          loading="lazy"
        />
        <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-display font-bold text-[15px] text-[#261911] line-clamp-1">
                {name}
              </h4>
              {product.isFasting && (
                <span className="text-[10px] font-bold bg-[#e8f5e9] text-[#1b6d24] px-1.5 py-0.5 rounded-full shrink-0">
                  {isAm ? 'የፆም' : 'Tsom'}
                </span>
              )}
            </div>
            <p className="text-[#594139] text-[13px] line-clamp-2 mt-1 leading-snug">
              {desc}
            </p>
          </div>

          <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-[#f3ebe6]">
            <span className="font-display font-extrabold text-[16px] text-[#a73400] tnum">
              {product.price} <span className="text-xs font-semibold text-[#594139]">{isAm ? 'ብር' : 'ETB'}</span>
            </span>

            <button
              onClick={handleQuickAdd}
              className="bg-[#fff1eb] hover:bg-[#ffdbcf] text-[#a73400] font-bold text-[13px] px-3.5 py-1.5 rounded-full active:scale-95 transition-all flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>{isAm ? 'ጨምር' : 'Add'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => setActiveProduct(product)}
      className="bg-white rounded-2xl overflow-hidden shadow-level-1 hover:shadow-level-2 active:scale-[0.985] transition-all cursor-pointer flex flex-col group w-[170px] shrink-0"
    >
      <div className="relative w-full h-28 bg-[#f7ddd0] overflow-hidden">
        <img
          src={product.image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          loading="lazy"
        />
        {product.isFasting && (
          <span className="absolute top-1.5 left-1.5 bg-[#1b6d24] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
            {isAm ? 'የፆም' : 'Tsom'}
          </span>
        )}
      </div>

      <div className="p-3 flex flex-col justify-between flex-1 gap-1.5">
        <div>
          <h4 className="font-display font-bold text-[14px] text-[#261911] line-clamp-1 leading-snug">
            {name}
          </h4>
          <p className="text-[#594139] text-[12px] line-clamp-1 mt-0.5">
            {desc}
          </p>
        </div>

        <div className="flex items-center justify-between mt-1 pt-2 border-t border-[#f3ebe6]">
          <span className="font-display font-bold text-[15px] text-[#a73400] tnum">
            {product.price} <span className="text-[11px] text-[#594139]">{isAm ? 'ብር' : 'ETB'}</span>
          </span>

          <button
            onClick={handleQuickAdd}
            className="w-8 h-8 rounded-full bg-[#a73400] hover:bg-[#963000] text-white flex items-center justify-center active:scale-90 transition-all shadow-sm"
            aria-label="Add to cart"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
