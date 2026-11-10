import { Skeleton } from '@senik/ui';

export function MerchantOrdersSection2() {
  return (
    <div className="space-y-3">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="bg-surface-container-lowest rounded-2xl shadow-level-1 p-4 space-y-3"
        >
          <div className="flex items-center justify-between">
            <Skeleton variant="text" width="120px" />
            <Skeleton variant="text" width="80px" height="22px" />
          </div>
          <Skeleton variant="text" lines={2} />
        </div>
      ))}
    </div>
  );
}
