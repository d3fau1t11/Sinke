import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs: (string | undefined | null | false)[]) => twMerge(clsx(inputs));

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export function Skeleton({ variant = 'text', width, height, lines = 1, className, ...props }: SkeletonProps) {
  const baseStyle = 'bg-surface-variant animate-pulse rounded';

  const variantStyles = {
    text: 'h-4 rounded-full',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
    card: 'rounded-2xl'
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={cn('space-y-2', className)} {...props}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(baseStyle, variantStyles.text, i === lines - 1 && 'w-3/4')}
            style={{ width: i === lines - 1 ? '75%' : width }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(baseStyle, variantStyles[variant], className)}
      style={{ width, height }}
      {...props}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="w-40 flex-shrink-0">
      <Skeleton variant="rectangular" className="aspect-square mb-2" />
      <Skeleton variant="text" width="80%" />
      <Skeleton variant="text" width="60%" className="mt-1" />
      <Skeleton variant="text" width="40%" className="mt-1" />
    </div>
  );
}

export function BusinessCardSkeleton() {
  return (
    <div className="w-full">
      <Skeleton variant="rectangular" className="aspect-[16/9] mb-3" />
      <div className="flex items-center gap-3 mb-2">
        <Skeleton variant="circular" width="12" height="12" />
        <div className="flex-1 space-y-1">
          <Skeleton variant="text" width="70%" />
          <Skeleton variant="text" width="50%" />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <Skeleton variant="text" width="80px" height="20" />
        <Skeleton variant="text" width="70px" height="20" />
      </div>
    </div>
  );
}

export function OrderCardSkeleton() {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Skeleton variant="circular" width="12" height="12" />
          <div className="space-y-1">
            <Skeleton variant="text" width="120px" />
            <Skeleton variant="text" width="80px" />
          </div>
        </div>
        <Skeleton variant="text" width="80px" height="24" />
      </div>
      <div className="space-y-2">
        <Skeleton variant="text" width="90%" />
        <Skeleton variant="text" width="70%" />
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton variant="circular" width="24" height="24" />
        <div className="space-y-2">
          <Skeleton variant="text" width="140px" />
          <Skeleton variant="text" width="100px" />
        </div>
      </div>
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <Skeleton variant="text" width="80px" />
            <Skeleton variant="text" width="100px" />
          </div>
        ))}
      </div>
    </div>
  );
}