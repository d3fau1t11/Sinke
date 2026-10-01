import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@senik/i18n';
import { Button, Card, Skeleton, EmptyState } from '@senik/ui';
import { ordersApi } from '@senik/api/orders';
import { supabase } from '@senik/api/client';

const statusSteps = [
  { id: 'placed', labelAm: 'ተሰርዟል', labelEn: 'Placed', icon: 'check_circle' },
  { id: 'accepted', labelAm: 'ተቀብሯል', labelEn: 'Accepted', icon: 'store' },
  { id: 'preparing', labelAm: 'በመዘጋጀት', labelEn: 'Preparing', icon: 'restaurant' },
  { id: 'ready', labelAm: 'ዝግጁ ነው', labelEn: 'Ready', icon: 'inventory_2' },
  { id: 'picked_up', labelAm: 'ተሰብሯል', labelEn: 'Picked Up', icon: 'local_shipping' },
  { id: 'on_way', labelAm: 'በመንገድ', labelEn: 'On the Way', icon: 'directions_bike' },
  { id: 'delivered', labelAm: 'ተላላፊ', labelEn: 'Delivered', icon: 'task_alt' },
];

type OrderTrack = Record<string, unknown> & { id: string; status: string; rider?: Record<string, unknown> & { full_name: string; phone: string; vehicle_info?: string; avatar_url?: string; rating?: string }; delivery_address?: string; delivery_notes?: string };

export function OrderTrackingScreen() {
  const { t, isAm } = useApp();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderTrack | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadOrder = async () => {
    try {
      setLoading(true);
      const data = await ordersApi.getById(id!);
      setOrder(data as unknown as OrderTrack);
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

  useEffect(() => {
    if (!order || order.status === 'delivered' || order.status === 'cancelled') return;

    const channel = supabase
      .channel(`order-tracking-${id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${id}`,
        },
        (payload) => {
          setOrder(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, order]);

  if (loading) {
    return (
      <div className="flex-1 px-4 py-4 space-y-4">
        <Skeleton variant="text" lines={2} className="mx-4" />
        <Skeleton variant="rectangular" className="mx-4 h-64" />
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

  const currentStepIndex = statusSteps.findIndex((s) => s.id === order.status);

  return (
    <div className="flex-1">
      <div className="px-4 py-4 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="font-display font-bold text-xl text-on-surface">
            {isAm ? 'የትዕዛዝ ከተማመን' : 'Track Order'}
          </h1>
        </div>

        <Card variant="elevated" padding="lg" className="shadow-level-2">
          <div className="text-center mb-6">
            <div className={`w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center ${
              order.status === 'delivered' ? 'bg-secondary/10' :
              order.status === 'cancelled' ? 'bg-error/10' :
              'bg-primary/10'
            }`}>
              <span className="material-symbols-outlined text-4xl text-primary">
                {statusSteps[currentStepIndex]?.icon || 'local_shipping'}
              </span>
            </div>
            <h2 className="font-display font-bold text-xl text-on-surface">
              {isAm ? statusSteps[currentStepIndex]?.labelAm : statusSteps[currentStepIndex]?.labelEn}
            </h2>
            <p className="text-on-surface-variant mt-1">
              {isAm ? 'የትዕዛዝ ሁኔታ' : 'Order Status'}
            </p>
          </div>

          <div className="space-y-3">
            {statusSteps.map((step, index) => {
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              return (
                <div key={step.id} className="flex items-center gap-3">
                  <div className="relative flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                      isCompleted ? 'bg-primary border-primary text-white' :
                      'bg-white border-outline-variant text-on-surface-variant'
                    }`}>
                      {isCompleted ? (
                        <span className="material-symbols-outlined text-[20px]">check</span>
                      ) : (
                        <span className="material-symbols-outlined text-[20px]">{step.icon}</span>
                      )}
                    </div>
                    {index < statusSteps.length - 1 && (
                      <div className="absolute left-4 top-10 bottom-10 w-0.5 bg-outline-variant" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium text-sm ${isCurrent ? 'text-primary' : 'text-on-surface'}`}>
                      {isAm ? step.labelAm : step.labelEn}
                    </p>
                  </div>
                  {isCurrent && (
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium animate-pulse">
                      {isAm ? 'አሁን' : 'Now'}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {order.rider && (
          <Card variant="outlined" padding="md">
            <h3 className="font-bold text-on-surface mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">person</span>
              {isAm ? 'የአድራሽ መረጃ' : 'Rider Info'}
            </h3>
            <div className="flex items-center gap-3">
              <img
                src={order.rider.avatar_url || '/senik-logo.jpg'}
                alt={order.rider.full_name}
                className="w-14 h-14 rounded-full object-cover"
              />
              <div className="flex-1">
                <h4 className="font-bold text-on-surface">{order.rider.full_name}</h4>
                <p className="text-sm text-on-surface-variant">{order.rider.vehicle_info || ''}</p>
                <div className="flex items-center gap-1 text-xs text-secondary mt-1">
                  <span className="material-symbols-outlined text-[14px] fill-icon">star</span>
                  <span>{order.rider.rating || '4.9'}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => window.open(`tel:${order.rider.phone}`)}>
                  <span className="material-symbols-outlined">call</span>
                </Button>
                <Button variant="secondary" size="sm" onClick={() => window.open(`sms:${order.rider.phone}`)}>
                  <span className="material-symbols-outlined">message</span>
                </Button>
              </div>
            </div>
          </Card>
        )}

        <Card variant="outlined" padding="md">
          <h3 className="font-bold text-on-surface mb-3">
            {isAm ? 'የማድረሻ አድራሻ' : 'Delivery Address'}
          </h3>
          <p className="text-on-surface-variant">{order.delivery_address}</p>
          {order.delivery_notes && (
            <p className="text-sm text-on-surface-variant mt-2 italic">
              {order.delivery_notes}
            </p>
          )}
        </Card>

        {order.status !== 'delivered' && order.status !== 'cancelled' && (
          <div className="space-y-2">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              className="mx-4"
              onClick={() => window.open(`tel:${order.rider?.phone || '8820'}`)}
            >
              <span className="material-symbols-outlined mr-2">call</span>
              {isAm ? 'ደውል' : 'Call Support'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}