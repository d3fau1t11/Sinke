import React from "react";
import { Card, Button } from "@senik/ui";
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
    <Card
      variant="outlined"
      padding="md"
      className="space-y-3 border-outline/20"
    >
      <div className="flex items-center justify-between border-b border-outline/10 pb-2">
        <div>
          <span className="font-mono font-bold text-sm text-secondary">
            #{order.order_number}
          </span>
          <span className="text-xs text-on-surface-variant ml-2">
            Status:{" "}
            <span className="uppercase font-semibold">{order.status}</span>
          </span>
        </div>
        <span className="font-bold text-sm text-green-700 bg-green-50 px-2 py-0.5 rounded-lg border border-green-200">
          Earn +{formatETB(order.delivery_fee)}
        </span>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-start gap-2">
          <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">
            store
          </span>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-on-surface truncate">
              {order.business?.name_en || "Merchant Store"}
            </p>
            <p className="text-xs text-on-surface-variant">Pickup point</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <span className="material-symbols-outlined text-secondary text-[18px] mt-0.5">
            home_pin
          </span>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-on-surface truncate">
              {order.delivery_address}
            </p>
            <p className="text-xs text-on-surface-variant">Customer Dropoff</p>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-outline/10 flex items-center justify-between">
        <span className="text-xs text-on-surface-variant">
          Payment:{" "}
          <span className="uppercase font-medium">{order.payment_method}</span>{" "}
          ({formatETB(order.total)})
        </span>
        <Button
          size="sm"
          variant="secondary"
          disabled={isAccepting}
          onClick={() => onAccept(order.id)}
        >
          {isAccepting ? "Accepting..." : "Accept Job"}
        </Button>
      </div>
    </Card>
  );
}
