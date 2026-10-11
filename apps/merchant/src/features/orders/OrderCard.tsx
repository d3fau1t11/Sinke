import React from "react";
import { Card, Button } from "@senik/ui";
import { formatETB } from "@senik/utils";
import type { OrderSummary, OrderStatus } from "@senik/types";

interface OrderCardProps {
  order: OrderSummary;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  updatingId: string | null;
}

export function OrderCard({
  order,
  onUpdateStatus,
  updatingId,
}: OrderCardProps) {
  const isUpdating = updatingId === order.id;

  return (
    <Card
      variant="outlined"
      padding="md"
      className="space-y-3 border-outline/20"
    >
      <div className="flex items-center justify-between border-b border-outline/10 pb-2">
        <div>
          <span className="font-mono font-bold text-sm text-primary">
            #{order.order_number}
          </span>
          <span className="text-xs text-on-surface-variant ml-2">
            {new Date(order.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        <span className="text-xs font-bold uppercase px-2 py-0.5 rounded-md bg-secondary/10 text-secondary">
          {order.status}
        </span>
      </div>

      <div className="space-y-1">
        {order.order_items?.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span className="text-on-surface">
              <span className="font-bold text-primary mr-2">
                {item.quantity}x
              </span>
              {item.product?.name_en || "Item"}
            </span>
            <span className="text-on-surface-variant font-mono">
              {formatETB(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-outline/10 text-sm">
        <span className="text-xs text-on-surface-variant truncate max-w-[200px]">
          📍 {order.delivery_address}
        </span>
        <span className="font-bold text-on-surface">
          {formatETB(order.total)}
        </span>
      </div>

      <div className="flex gap-2 pt-1">
        {order.status === "placed" && (
          <>
            <Button
              size="sm"
              variant="primary"
              className="flex-1"
              disabled={isUpdating}
              onClick={() => onUpdateStatus(order.id, "preparing")}
            >
              {isUpdating ? "Updating..." : "Accept & Prepare"}
            </Button>
            <Button
              size="sm"
              variant="danger"
              disabled={isUpdating}
              onClick={() => onUpdateStatus(order.id, "cancelled")}
            >
              Reject
            </Button>
          </>
        )}
        {(order.status === "preparing" || order.status === "accepted") && (
          <Button
            size="sm"
            variant="primary"
            className="w-full"
            disabled={isUpdating}
            onClick={() => onUpdateStatus(order.id, "ready")}
          >
            {isUpdating ? "Updating..." : "Mark Ready for Pickup"}
          </Button>
        )}
        {(order.status === "ready" || order.status === "picked_up") && (
          <div className="w-full space-y-1.5">
            <p className="text-xs text-center w-full py-1 text-emerald-700 bg-emerald-50 rounded-lg font-medium">
              {order.status === "ready"
                ? "Ready for rider pickup 🚴"
                : "Out for delivery with rider 🛵"}
            </p>
            <Button
              size="sm"
              variant="secondary"
              className="w-full text-xs"
              disabled={isUpdating}
              onClick={() => onUpdateStatus(order.id, "delivered")}
            >
              ✓ Mark Completed (Credit Store Balance)
            </Button>
          </div>
        )}
        {order.status === "delivered" && (
          <p className="text-xs text-center w-full py-1 text-emerald-800 bg-emerald-100 rounded-lg font-bold">
            ✓ Delivered & Balance Credited
          </p>
        )}
      </div>
    </Card>
  );
}
