import React from 'react';

/**
 * Promotional hero carousel — presentational only.
 * Receives data + callbacks via props (AGENTS.md §3).
 */
export default function PromoCarousel({ promos, activeIndex, onActiveChange, onApply, isAm }) {
  const promo = promos[activeIndex];
  if (!promo) return null;

  const title = isAm ? promo.titleAm : promo.titleEn;
  const desc = isAm ? promo.descAm : promo.descEn;
  const tag = isAm ? promo.tagAm : promo.tagEn;

  return (
    <section className="relative overflow-hidden rounded-2xl shadow-level-2">
      <div className={`bg-gradient-to-r ${promo.bgGradient} p-4 pr-16 text-white relative`}>
        {/* Quiet geometric backdrop */}
        <div className="absolute -right-8 -bottom-10 w-36 h-36 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute -right-2 -top-8 w-20 h-20 rounded-full bg-white/10 pointer-events-none" />

        <div className="space-y-1 relative z-10 max-w-[78%]">
          <span className="inline-block bg-black/25 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-[0.08em]">
            {tag}
          </span>
          <h3 className="font-display font-extrabold text-[17px] leading-tight drop-shadow-sm">
            {title}
          </h3>
          <p className="text-[13px] text-white/90 leading-snug">{desc}</p>
          <button
            onClick={() => onApply(promo.code)}
            className="mt-2 inline-flex items-center gap-1.5 bg-white/95 text-[#a73400] text-[13px] font-extrabold px-3.5 py-1.5 rounded-full active:scale-95 transition-transform"
          >
            <span>{isAm ? 'ኮዱን ተግብር' : 'Apply'}</span>
            <span className="font-mono underline underline-offset-2">{promo.code}</span>
          </button>
        </div>

        {/* Indicators */}
        <div className="absolute bottom-4 right-4 z-10 flex gap-1.5">
          {promos.map((p, dotIdx) => (
            <button
              key={p.id}
              onClick={() => onActiveChange(dotIdx)}
              aria-label={`Promotion ${dotIdx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                dotIdx === activeIndex ? 'bg-white w-5' : 'bg-white/40 w-1.5 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
