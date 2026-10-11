import React from "react";
import { Card, StatusBadge } from "@senik/ui";
import { formatETB } from "@senik/utils";
import type { ProductWithOptions } from "@senik/types";

interface ProductItemRowProps {
  product: ProductWithOptions;
  onToggleAvailability: (productId: string, current: boolean) => void;
  onEditPrice: (product: ProductWithOptions) => void;
  onDelete: (productId: string, name: string) => void;
  updatingId: string | null;
}

export function ProductItemRow({
  product,
  onToggleAvailability,
  onEditPrice,
  onDelete,
  updatingId,
}: ProductItemRowProps) {
  const isUpdating = updatingId === product.id;

  return (
    <Card padding="sm" className="flex items-center gap-3">
      <img
        src={product.image}
        alt={product.name_en}
        className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-body-sm text-on-surface truncate">
          {product.name_en}
        </h4>
        <p className="text-body-sm text-on-surface-variant truncate">
          {product.name_am}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="font-mono font-bold text-body-sm text-on-surface tabular-nums">
            {formatETB(product.price)}
          </span>
          <button
            type="button"
            onClick={() => onEditPrice(product)}
            className="text-label-sm text-primary hover:underline font-semibold inline-flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[14px]">edit</span>
            Edit Price
          </button>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <button
          type="button"
          disabled={isUpdating}
          onClick={() => onToggleAvailability(product.id, product.is_available)}
          aria-pressed={product.is_available}
          className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <StatusBadge tone={product.is_available ? "success" : "neutral"} dot={product.is_available}>
            {isUpdating ? "..." : product.is_available ? "Available" : "Sold Out"}
          </StatusBadge>
        </button>

        <button
          type="button"
          onClick={() => onDelete(product.id, product.name_en)}
          className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant/70 hover:text-error hover:bg-error/10 transition-colors"
          aria-label={`Remove ${product.name_en}`}
        >
          <span className="material-symbols-outlined text-[17px]">delete</span>
        </button>
      </div>
    </Card>
  );
}
