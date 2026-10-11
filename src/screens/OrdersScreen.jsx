import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import HeaderBar from '../components/HeaderBar';

export default function OrdersScreen() {
  const { lang, orders, handleReorder, navigateTo } = useApp();
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'active', 'past'
  const isAm = lang === 'am';

  const filteredOrders = orders.filter((o) => {
    if (activeFilter === 'active') return o.status !== 'delivered';
    if (activeFilter === 'past') return o.status === 'delivered';
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'delivered':
        return {
          bg: 'bg-[#e8f5e9]',
          text: 'text-[#1b6d24]',
          labelAm: 'ደርሷል (Delivered)',
          labelEn: 'Delivered',
          icon: 'task_alt'
        };
      case 'on_way':
        return {
          bg: 'bg-[#ffeadf]',
          text: 'text-[#a73400]',
          labelAm: 'በመንገድ ላይ (On the way)',
          labelEn: 'On the Way',
          icon: 'navigation'
        };
      case 'preparing':
      case 'confirmed':
      default:
        return {
          bg: 'bg-[#ffdcbe]/70',
          text: 'text-[#874e00]',
          labelAm: 'በመዘጋጀት ላይ',
          labelEn: 'Preparing',
          icon: 'hourglass_top'
        };
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fff8f5] pb-24">
      <HeaderBar
        title={isAm ? 'የእርስዎ ትዕዛዞች' : 'Your Orders'}
        showBack={false}
      />

      <div className="flex-1 px-4 py-4 space-y-4">
        {/* Tabs: All / Active / Past */}
        <div className="flex bg-[#f6ede8] p-1 rounded-xl text-[13px]">
          <button
            onClick={() => setActiveFilter('all')}
            className={`flex-1 py-2 rounded-lg font-bold transition-all ${
              activeFilter === 'all' ? 'bg-white text-[#a73400] shadow-level-1' : 'text-[#594139]'
            }`}
          >
            {isAm ? 'ሁሉም' : 'All'} ({orders.length})
          </button>
          <button
            onClick={() => setActiveFilter('active')}
            className={`flex-1 py-2 rounded-lg font-bold transition-all ${
              activeFilter === 'active' ? 'bg-white text-[#a73400] shadow-level-1' : 'text-[#594139]'
            }`}
          >
            {isAm ? 'ወቅታዊ' : 'Active'} ({orders.filter((o) => o.status !== 'delivered').length})
          </button>
          <button
            onClick={() => setActiveFilter('past')}
            className={`flex-1 py-2 rounded-lg font-bold transition-all ${
              activeFilter === 'past' ? 'bg-white text-[#a73400] shadow-level-1' : 'text-[#594139]'
            }`}
          >
            {isAm ? 'ያለፉ' : 'Past'} ({orders.filter((o) => o.status === 'delivered').length})
          </button>
        </div>

        {/* Orders List */}
        <div className="space-y-3">
          {filteredOrders.map((order) => {
            const badge = getStatusBadge(order.status);
            const isDelivered = order.status === 'delivered';

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl p-4 shadow-level-1 space-y-3"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={order.businessImage}
                      alt={order.businessNameAm}
                      className="w-11 h-11 rounded-xl object-cover"
                    />
                    <div>
                      <h4 className="font-display font-bold text-[14px] text-[#261911]">
                        {isAm ? order.businessNameAm : order.businessNameEn}
                      </h4>
                      <p className="text-[11px] text-[#594139]">{order.dateStr}</p>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0 ${badge.bg} ${badge.text}`}
                  >
                    <span className="material-symbols-outlined text-[14px]">{badge.icon}</span>
                    <span>{isAm ? badge.labelAm : badge.labelEn}</span>
                  </span>
                </div>

                {/* Items Summary */}
                <div className="text-[13px] text-[#594139] space-y-1.5 py-2 border-y border-[#f3ebe6]">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between gap-3">
                      <span className="truncate">
                        {item.quantity}x {isAm ? item.nameAm : item.nameEn}
                      </span>
                      <span className="font-semibold text-[#261911] tnum">
                        {item.price * item.quantity} {isAm ? 'ብር' : 'ETB'}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer and Actions */}
                <div className="flex items-center justify-between pt-0.5">
                  <div>
                    <span className="text-[11px] text-[#594139] block">{isAm ? 'ጠቅላላ ዋጋ' : 'Total'}</span>
                    <span className="font-display font-extrabold text-[16px] text-[#a73400] tnum">
                      {order.total} {isAm ? 'ብር' : 'ETB'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {!isDelivered && (
                      <button
                        onClick={() => navigateTo('order-tracking', { orderId: order.id })}
                        className="bg-[#a73400] hover:bg-[#963000] text-white text-[13px] font-bold px-3.5 py-2 rounded-full shadow-sm active:scale-95 transition-all flex items-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-[15px]">navigation</span>
                        <span>{isAm ? 'ተከታተል' : 'Track'}</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleReorder(order)}
                      className="bg-[#fff1eb] hover:bg-[#ffdbcf] text-[#a73400] text-[13px] font-bold px-3.5 py-2 rounded-full active:scale-95 transition-all flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[15px]">replay</span>
                      <span>{isAm ? 'እንደገና እዘዝ' : 'Reorder'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredOrders.length === 0 && (
            <div className="py-12 text-center text-[#594139] space-y-2">
              <span className="material-symbols-outlined text-[36px] text-[#aa6400]">receipt_long</span>
              <p className="text-sm font-semibold">{isAm ? 'ምንም ትዕዛዝ አልተገኘም' : 'No orders found'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
