import React from "react";
import { Button } from "@senik/ui";
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
    <div className="relative overflow-hidden bg-surface border border-outline/15 rounded-2xl shadow-sm hover:shadow-md hover:border-green-500/30 transition-all">
      {/* Delivery fee badge */}
      <div className="absolute top-3 right-3 bg-green-600 text-white text-xs font-black px-2.5 py-1 rounded-full shadow">
        +{formatETB(order.delivery_fee)}
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-sm text-on-surface">
            #{order.order_number}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
            Ready for Pickup
          </span>
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
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wide">
                Pickup
              </p>
              <p className="font-bold text-sm text-on-surface truncate">
                {order.business?.name_en ?? "Merchant"}
              </p>
            </div>
          </div>

          {/* Drop arrow */}
          <div className="ml-3.5 w-px h-4 bg-outline/20" />

          {/* Dropoff */}
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-orange-500 text-[15px]">
                home_pin
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wide">
                Deliver to
              </p>
              <p className="font-bold text-sm text-on-surface truncate">
                {order.delivery_address}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-outline/10 flex items-center justify-between">
          <span className="text-xs text-on-surface-variant">
            Payment:{" "}
            <span className="font-bold text-on-surface capitalize">
              {order.payment_method}
            </span>{" "}
            <span className="text-on-surface-variant">
              ({formatETB(order.total)})
            </span>
          </span>
          <Button
            size="sm"
            variant="primary"
            className="bg-green-600 hover:bg-green-700 shadow-md shadow-green-500/20"
            disabled={isAccepting}
            onClick={() => onAccept(order.id)}
          >
            {isAccepting ? "Accepting..." : "✓ Accept Job"}
          </Button>
        </div>
      </div>
    </div>
  );
}
