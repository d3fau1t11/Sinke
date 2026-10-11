import React from "react";
import { Button, StatusBadge } from "@senik/ui";
import { formatETB } from "@senik/utils";
import type { OrderSummary } from "@senik/types";

interface DeliveryCardProps {
  order: OrderSummary;
  onAccept: (orderId: string) => void;
  acceptingId: string | null;
}

export function DeliveryCard({
  order,
  onAccept,
  acceptingId,
}: DeliveryCardProps) {
  const isAccepting = acceptingId === order.id;

  return (
    <div className="relative overflow-hidden bg-surface-container-lowest rounded-2xl shadow-level-1 hover:shadow-level-2 transition-all">
      {/* Delivery fee badge — money is always green */}
      <div className="absolute top-3 right-3 bg-secondary text-white text-label-sm font-black px-2.5 py-1 rounded-full shadow-level-1 tabular-nums">
        +{formatETB(order.delivery_fee)}
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2 pr-20">
          <span className="font-mono font-bold text-body-sm text-on-surface">
            #{order.order_number}
          </span>
          <StatusBadge tone="progress" dot>
            Ready for Pickup
          </StatusBadge>
        </div>

        <div className="space-y-2">
          {/* Pickup */}
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-primary text-[15px]">
                store
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-micro font-bold text-on-surface-variant uppercase tracking-wide">
                Pickup
              </p>
              <p className="font-bold text-body-sm text-on-surface truncate">
                {order.business?.name_en ?? "Merchant"}
              </p>
            </div>
          </div>

          {/* Route connector */}
          <div className="ml-3.5 w-px h-4 bg-outline-variant" />

          {/* Dropoff */}
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-full bg-tertiary-fixed/50 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-tertiary text-[15px]">
                home_pin
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-micro font-bold text-on-surface-variant uppercase tracking-wide">
                Deliver to
              </p>
              <p className="font-bold text-body-sm text-on-surface truncate">
                {order.delivery_address}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-2.5 border-t border-outline-variant/60 flex items-center justify-between gap-3">
          <span className="text-label-sm text-on-surface-variant">
            Payment:{" "}
            <span className="font-bold text-on-surface capitalize">
              {order.payment_method}
            </span>{" "}
            <span className="tabular-nums">({formatETB(order.total)})</span>
          </span>
          <Button
            size="md"
            variant="primary"
            className="shrink-0"
            disabled={isAccepting}
            onClick={() => onAccept(order.id)}
          >
            <span className="material-symbols-outlined text-[17px]">
              check
            </span>
            {isAccepting ? "Accepting..." : "Accept Job"}
          </Button>
        </div>
      </div>
    </div>
  );
}
