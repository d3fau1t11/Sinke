import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@senik/i18n';
import { Button, Card, Skeleton, EmptyState, useSegmentedControl } from '@senik/ui';
import { ordersApi } from '@senik/api/orders';
import type { OrderSummary } from '@senik/types';

const tabs = [
  { id: 'active', labelAm: 'ወቅታዊ', labelEn: 'Active' },
  { id: 'past', labelAm: 'ያለፉ', labelEn: 'Past' },
];

export function OrdersScreen() {
  const { t, isAm } = useApp();
  const navigate = useNavigate();
  const { selectedValue: activeTab, setSelectedValue } = useSegmentedControl('active');
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await ordersApi.getMyOrders();
      setOrders(data);
    } catch (_err) {
      setError(isAm ? 'ትዕዛዞችን ማግኘት አልተሳካም' : 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredOrders = orders.filter((order) => {
    if (activeTab === 'active') {
      return ['pending_payment', 'placed', 'accepted', 'preparing', 'ready', 'picked_up', 'on_way'].includes(order.status);
    }
    return ['delivered', 'cancelled'].includes(order.status);
  });

  if (loading) {
    return (
      <div className="flex-1 px-4 py-4 space-y-4">
        <div className="flex gap-2 px-4">
          {tabs.map((tab) => (
            <Button key={tab.id} variant="secondary" size="sm">
              {isAm ? tab.labelAm : tab.labelEn}
            </Button>
          ))}
        </div>
        {[1, 2, 3].map((i) => <Skeleton key={i} variant="rectangular" className="mx-4 h-24" />)}
      </div>
    );
  }

  return (
    <div className="flex-1">
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-display font-bold text-xl text-on-surface">
            {isAm ? 'የእርስዎ ትዕዛዞች' : 'Your Orders'}
          </h1>
        </div>

        <div className="flex gap-2 mb-4">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setSelectedValue(tab.id)}
            >
              {isAm ? tab.labelAm : tab.labelEn}
            </Button>
          ))}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-error/10 border border-error rounded-xl text-error text-sm">
            {error}
          </div>
        )}

        {filteredOrders.length === 0 ? (
          <EmptyState
            t={t}
            isAm={isAm}
            title={activeTab === 'active'
              ? (isAm ? 'ወቅታዊ ትዕዛዝ የለም' : 'No Active Orders')
              : (isAm ? 'የተጠናቀቀ ትዕዛዝ የለም' : 'No Past Orders')}
            message={(activeTab === 'active'
              ? (isAm ? 'አሁን የሚከተልዎ ትዕዛዝ የለም' : 'You have no active orders at the moment')
              : (isAm ? 'ያለፈ ትዕዛዞች አልተገኙም' : 'Your order history will appear here'))}
          />
        ) : (
          <div className="space-y-3">
            {filteredOrders.map((order) => (
              <Card key={order.id} variant="outlined" padding="md" hoverable onClick={() => navigate(`/app/orders/${order.id}`)}>
                <div className="flex items-start gap-3">
                  <img
                    src={order.business?.avatar_image || '/senik-logo.jpg'}
                    alt={isAm ? order.business?.name_am : order.business?.name_en}
                    className="w-14 h-14 rounded-xl object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-on-surface truncate">
                        {isAm ? order.business?.name_am : order.business?.name_en}
                      </h3>
                      <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                        order.status === 'delivered' ? 'bg-secondary/10 text-secondary' :
                        order.status === 'cancelled' ? 'bg-error/10 text-error' :
                        'bg-primary/10 text-primary'
                      }`}>
                        {getStatusLabel(order.status, isAm)}
                      </span>
                    </div>
                    <p className="text-sm text-on-surface-variant truncate mt-1">
                      {order.order_items?.map((item) => item.product?.name_en || item.product?.name_am).join(', ') || ''}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-on-surface-variant">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">receipt_long</span>
                        {order.order_number}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">attach_money</span>
                        {order.total} ETB
                      </span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-primary">chevron_right</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function getStatusLabel(status: string, isAm: boolean): string {
  const labels: Record<string, { am: string; en: string }> = {
    pending_payment: { am: 'ክፍያ በመጠበቅ', en: 'Pending Payment' },
    placed: { am: 'ተሰርዟል', en: 'Placed' },
    accepted: { am: 'ተቀብሯል', en: 'Accepted' },
    preparing: { am: 'በመዘጋጀት', en: 'Preparing' },
    ready: { am: 'ዝግጁ ነው', en: 'Ready' },
    picked_up: { am: 'ተሰብሯል', en: 'Picked Up' },
    on_way: { am: 'በመንገድ', en: 'On the Way' },
    delivered: { am: 'ተላላፊ', en: 'Delivered' },
    cancelled: { am: 'ተሰርዟል', en: 'Cancelled' },
  };
  return labels[status]?.[isAm ? 'am' : 'en'] || status;
}