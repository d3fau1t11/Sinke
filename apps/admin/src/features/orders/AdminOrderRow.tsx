import { useLocalizedName } from '@senik/i18n';
import { useText } from '@senik/i18n';
import React from 'react';
import { formatETB } from '@senik/utils';
import type { OrderSummary, OrderStatus } from '@senik/types';

interface AdminOrderRowProps {
  order: OrderSummary;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  updatingId: string | null;
}

export function AdminOrderRow({ order, onUpdateStatus, updatingId }: AdminOrderRowProps) {
  const localizedName = useLocalizedName();
  const text = useText();
  const isUpdating = updatingId === order.id;

  return (
    <tr className="border-b border-slate-800 text-xs text-slate-300 hover:bg-slate-800/40 transition-colors">
      <td className="py-3 px-3 font-mono font-bold text-amber-400">#{order.order_number}</td>
      <td className="py-3 px-3 font-medium text-white">
        {localizedName(order.business) || text('Store')}
      </td>
      <td className="py-3 px-3 truncate max-w-[180px]">{order.delivery_address}</td>
      <td className="py-3 px-3 font-mono font-bold text-emerald-400">{formatETB(order.total)}</td>
      <td className="py-3 px-3 uppercase text-[10px] text-slate-400">{order.payment_method}</td>
      <td className="py-3 px-3">
        <span
          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
            order.status === 'delivered'
              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
              : order.status === 'cancelled'
                ? 'bg-rose-950 text-rose-400 border border-rose-800'
                : 'bg-amber-950 text-amber-400 border border-amber-800'
          }`}
        >
          {text(order.status ?? '')}
        </span>
      </td>
      <td className="py-3 px-3 text-right">
        {order.status !== 'delivered' && order.status !== 'cancelled' ? (
          <select
            disabled={isUpdating}
            value={order.status}
            onChange={(e) => onUpdateStatus(order.id, e.target.value as OrderStatus)}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2 py-1 outline-none"
          >
            <option value="placed">{text('Placed')}</option>
            <option value="preparing">{text('Preparing')}</option>
            <option value="ready">{text('Ready')}</option>
            <option value="picked_up">{text('Picked Up')}</option>
            <option value="delivered">{text('Delivered')}</option>
            <option value="cancelled">{text('Cancelled')}</option>
          </select>
        ) : (
          <span className="text-slate-500 text-[11px]">—</span>
        )}
      </td>
    </tr>
  );
}
