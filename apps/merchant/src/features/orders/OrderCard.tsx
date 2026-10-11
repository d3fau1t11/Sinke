import React from "react";
import { Card, Button, StatusBadge } from "@senik/ui";
import type { StatusTone } from "@senik/ui";
import { formatETB } from "@senik/utils";
import type { OrderSummary, OrderStatus } from "@senik/types";

interface OrderCardProps {
  order: OrderSummary;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  updatingId: string | null;
}

const STATUS_PRESENTATION: Record<
  string,
  { tone: StatusTone; label: string; dot?: boolean }
> = {
  placed: { tone: "primary", label: "Incoming", dot: true },
  accepted: { tone: "progress", label: "Accepted" },
  preparing: { tone: "progress", label: "Preparing", dot: true },
  ready: { tone: "success", label: "Ready for pickup" },
  picked_up: { tone: "primary", label: "With rider" },
  delivered: { tone: "success", label: "Delivered" },
  cancelled: { tone: "neutral", label: "Cancelled" },
};

export function OrderCard({
  order,
  onUpdateStatus,
  updatingId,
}: OrderCardProps) {
  const isUpdating = updatingId === order.id;
  const presentation = STATUS_PRESENTATION[order.status] ?? {
    tone: "neutral" as StatusTone,
    label: order.status,
  };

  return (
    <Card padding="md" className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="font-mono font-bold text-body-sm text-primary">
            #{order.order_number}
          </span>
          <span className="text-label-sm text-on-surface-variant tabular-nums">
            {new Date(order.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        <StatusBadge tone={presentation.tone} dot={presentation.dot}>
          {presentation.label}
        </StatusBadge>
      </div>

      <div className="space-y-1.5 py-1 border-y border-outline-variant/60">
        {order.order_items?.map((item) => (
          <div key={item.id} className="flex justify-between text-body-sm gap-3">
            <span className="text-on-surface truncate">
              <span className="font-bold text-primary mr-2 tabular-nums">{item.quantity}x</span>
              {item.product?.name_en || "Item"}
            </span>
            <span className="text-on-surface-variant tabular-nums shrink-0">
              {formatETB(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-1.5 text-body-sm text-on-surface-variant min-w-0">
          <span className="material-symbols-outlined text-[16px] text-primary shrink-0">
            location_on
          </span>
          <span className="truncate">{order.delivery_address}</span>
        </span>
        <span className="font-display font-extrabold text-title-sm text-on-surface tabular-nums shrink-0">
          {formatETB(order.total)}
        </span>
      </div>

      <div className="flex gap-2">
        {order.status === "placed" && (
          <>
            <Button
              size="md"
              variant="primary"
              className="flex-1"
              disabled={isUpdating}
              onClick={() => onUpdateStatus(order.id, "preparing")}
            >
              {isUpdating ? "Updating..." : "Accept & Prepare"}
            </Button>
            <Button
              size="md"
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
            size="md"
            variant="primary"
            className="w-full"
            disabled={isUpdating}
            onClick={() => onUpdateStatus(order.id, "ready")}
          >
            {isUpdating ? "Updating..." : "Mark Ready for Pickup"}
          </Button>
        )}
        {(order.status === "ready" || order.status === "picked_up") && (
          <div className="w-full space-y-2">
            <p className="w-full py-1.5 px-3 rounded-xl bg-secondary/10 text-secondary text-body-sm font-semibold text-center flex items-center justify-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">
                {order.status === "ready" ? "package_2" : "two_wheeler"}
              </span>
              {order.status === "ready"
                ? "Waiting for rider pickup"
                : "Out for delivery with rider"}
            </p>
            <Button
              size="md"
              variant="primary"
              className="w-full"
              disabled={isUpdating}
              onClick={() => onUpdateStatus(order.id, "delivered")}
            >
              {isUpdating
                ? "Updating..."
                : "Mark Completed (Credit Store Balance)"}
            </Button>
          </div>
        )}
        {order.status === "delivered" && (
          <p className="w-full py-1.5 rounded-xl bg-secondary/10 text-secondary text-body-sm font-bold text-center flex items-center justify-center gap-1.5">
            <span className="material-symbols-outlined text-[17px]">
              task_alt
            </span>
            Delivered &amp; balance credited
          </p>
        )}
      </div>
    </Card>
  );
}
