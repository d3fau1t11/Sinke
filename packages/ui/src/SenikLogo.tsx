import React from "react";

export interface SenikLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  subtitle?: string;
  className?: string;
  textClassName?: string;
}

const SIZE_MAP = {
  sm: "w-7 h-7 rounded-lg",
  md: "w-9 h-9 rounded-xl",
  lg: "w-14 h-14 rounded-2xl",
  xl: "w-20 h-20 rounded-3xl",
};

const TEXT_SIZE_MAP = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-xl",
  xl: "text-2xl",
};

export function SenikLogo({
  size = "md",
  showText = false,
  subtitle,
  className = "",
  textClassName = "",
}: SenikLogoProps) {
  const sizeClasses = SIZE_MAP[size];
  const textSize = TEXT_SIZE_MAP[size];

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <img
        src="/senik-logo.jpg"
        alt="Senik"
        className={`${sizeClasses} object-cover shadow-sm flex-shrink-0 border border-black/5`}
        onError={(e) => {
          // Fallback if image fails to load
          e.currentTarget.style.display = "none";
        }}
      />
      {showText && (
        <div className="flex flex-col leading-none">
          <span
            className={`font-black tracking-tight text-primary ${textSize} ${textClassName}`}
          >
            ስንቅ <span className="font-extrabold text-amber-500">SENIK</span>
          </span>
          {subtitle && (
            <span className="text-[10px] text-slate-500 font-medium tracking-wide mt-0.5">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
