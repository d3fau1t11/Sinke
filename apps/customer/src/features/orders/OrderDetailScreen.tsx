import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@senik/i18n';
import { Button, Card, Skeleton, EmptyState } from '@senik/ui';
import { ordersApi } from '@senik/api/orders';
import type { OrderDetail } from '@senik/types';

export function OrderDetailScreen() {
  const { t, isAm } = useApp();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadOrder = async () => {
    try {
      setLoading(true);
      const data = await ordersApi.getById(id!);
      setOrder(data);
    } catch (_err) {
      setError(isAm ? 'ትዕዛዝ ማግኘት አልተሳካም' : 'Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    void loadOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return (
      <div className="flex-1 px-4 py-4 space-y-4">
        <Skeleton variant="text" lines={3} className="mx-4" />
        <Skeleton variant="rectangular" className="mx-4 h-48" />
        <div className="space-y-3 px-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} variant="rectangular" className="h-20" />)}
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex-1 flex items-center justify-center px-4">
        <EmptyState
          t={t}
          isAm={isAm}
          title={isAm ? 'ትዕዛዝ አልተገኘም' : 'Order Not Found'}
          message={error}
          actionLabel={isAm ? 'ወደ ትዕዛዞች ተመለስ' : 'Back to Orders'}
          onAction={() => navigate('/app/orders')}
        />
      </div>
    );
  }

  const statusSteps = [
    { id: 'placed', labelAm: 'ተሰርዟል', labelEn: 'Placed' },
    { id: 'accepted', labelAm: 'ተቀብሯል', labelEn: 'Accepted' },
    { id: 'preparing', labelAm: 'በመዘጋጀት', labelEn: 'Preparing' },
    { id: 'ready', labelAm: 'ዝግጁ ነው', labelEn: 'Ready' },
    { id: 'picked_up', labelAm: 'ተሰብሯል', labelEn: 'Picked Up' },
    { id: 'on_way', labelAm: 'በመንገድ', labelEn: 'On the Way' },
    { id: 'delivered', labelAm: 'ተላላፊ', labelEn: 'Delivered' },
  ];

  const currentStepIndex = statusSteps.findIndex((s) => s.id === order.status);

  return (
    <div className="flex-1">
      <div className="px-4 py-4 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="font-display font-bold text-xl text-on-surface">
            {isAm ? 'የትዕዛዝ ዝርዝር' : 'Order Details'}
          </h1>
          <span className={`px-2 py-1 text-xs rounded-full font-medium ${
            order.status === 'delivered' ? 'bg-secondary/10 text-secondary' :
            order.status === 'cancelled' ? 'bg-error/10 text-error' :
            'bg-primary/10 text-primary'
          }`}>
            {getStatusLabel(order.status, isAm)}
          </span>
        </div>

        <Card variant="outlined" padding="md">
          <div className="flex items-center gap-3">
            <img
              src={order.business?.avatar_image || '/senik-logo.jpg'}
              alt={isAm ? order.business?.name_am : order.business?.name_en}
              className="w-12 h-12 rounded-xl object-cover"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-on-surface truncate">
                {isAm ? order.business?.name_am : order.business?.name_en}
              </h3>
              <p className="text-sm text-on-surface-variant truncate">
                {order.order_items?.map((item) => item.product?.name_en || item.product?.name_am).join(', ') || ''}
              </p>
            </div>
            <span className="text-primary font-bold">{String(order.total)} ETB</span>
          </div>
        </Card>

        <Card variant="outlined" padding="md">
          <h3 className="font-bold text-on-surface mb-3">
            {isAm ? 'የትዕዛዝ ሂደት' : 'Order Timeline'}
          </h3>
          <div className="space-y-3">
            {statusSteps.map((step, index) => {
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              return (
                <div key={step.id} className="flex items-center gap-3">
                  <div className="relative flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                      isCompleted ? 'bg-primary border-primary text-white' :
                      'bg-white border-outline-variant text-on-surface-variant'
                    }`}>
                      {isCompleted ? (
                        <span className="material-symbols-outlined text-[16px]">check</span>
                      ) : (
                        <span className="material-symbols-outlined text-[16px]">circle</span>
                      )}
                    </div>
                    {index < statusSteps.length - 1 && (
                      <div className="absolute left-3 top-8 bottom-8 w-0.5 bg-outline-variant" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium text-sm ${isCurrent ? 'text-primary' : 'text-on-surface'}`}>
                      {isAm ? step.labelAm : step.labelEn}
                    </p>
                    <p className="text-xs text-on-surface-variant">
                      {order.created_at && index === 0 ? new Date(order.created_at).toLocaleString() : ''}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card variant="outlined" padding="md">
          <h3 className="font-bold text-on-surface mb-3">
            {isAm ? 'የእቃዎች ዝርዝር' : 'Items'}
          </h3>
          <div className="space-y-3">
            {order.order_items?.map((item) => (
              <div key={String(item.id)} className="flex items-center justify-between py-2 border-b border-outline-variant last:border-0">
                <div className="flex items-center gap-3">
                  <img
                    src={item.product?.image || '/senik-logo.jpg'}
                    alt={isAm ? item.product?.name_am : item.product?.name_en}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div>
                    <p className="font-medium text-on-surface truncate max-w-[180px]">
                      {isAm ? item.product?.name_am : item.product?.name_en}
                    </p>
                    <p className="text-sm text-on-surface-variant">
                      x{String(item.quantity)} • {String(item.price)} ETB
                    </p>
                  </div>
                </div>
                <p className="font-bold text-on-surface">{String(Number(item.price) * Number(item.quantity))} ETB</p>
              </div>
            ))}
          </div>
        </Card>

        <Card variant="outlined" padding="md">
          <h3 className="font-bold text-on-surface mb-3">
            {isAm ? 'የክፍያ ዝርዝር' : 'Payment Summary'}
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-on-surface-variant">{isAm ? 'ንዑስ ድምር' : 'Subtotal'}</span>
              <span className="font-medium text-on-surface">{order.subtotal} ETB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">{isAm ? 'የማድረሻ ክፍያ' : 'Delivery Fee'}</span>
              <span className="font-medium text-on-surface">{order.delivery_fee} ETB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">{isAm ? 'የአገልግሎት ክፍያ' : 'Service Fee'}</span>
              <span className="font-medium text-on-surface">{order.service_fee} ETB</span>
            </div>
            {(order.discount || 0) > 0 && (
              <div className="flex justify-between text-secondary">
                <span className="text-on-surface-variant">{isAm ? 'ቅናሽ' : 'Discount'}</span>
                <span className="font-medium text-secondary">-{order.discount} ETB</span>
              </div>
            )}
            <div className="border-t border-outline-variant pt-2"></div>
            <div className="flex justify-between text-lg font-bold">
              <span className="text-on-surface">{isAm ? 'ጠቅላላ' : 'Total'}</span>
              <span className="text-primary">{order.total} ETB</span>
            </div>
          </div>
        </Card>

        {order.status !== 'delivered' && order.status !== 'cancelled' && (
          <Button
            variant="primary"
            size="lg"
            fullWidth
            className="mx-4 mb-4"
            onClick={() => navigate(`/app/tracking/${order.id}`)}
          >
            <span className="material-symbols-outlined mr-2">map</span>
            {isAm ? 'ትዕዛዝ ይከታተሉ' : 'Track Order'}
          </Button>
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