import { Skeleton } from '@senik/ui';

export function MerchantMenuSection2() {
  return (
    <div className="space-y-2">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="bg-surface-container-lowest rounded-2xl shadow-level-1 p-3 flex items-center gap-3"
        >
          <Skeleton variant="rectangular" width="56px" height="56px" />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="40%" />
          </div>
          <Skeleton variant="text" width="64px" height="24px" />
        </div>
      ))}
    </div>
  );
}
