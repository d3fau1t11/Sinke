import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@senik/i18n';
import { Button, Card, Input, Textarea, EmptyState } from '@senik/ui';
import { useCartStore } from '../cart/store/cartStore';
import { useAuthStore } from '../auth/store/authStore';
import { formatETB } from '@senik/utils';
import { ordersApi } from '@senik/api/orders';

type PaymentMethod = 'cash' | 'telebirr' | 'cbe_birr';

export function CheckoutScreen() {
  const { t, isAm } = useApp();
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCartStore();
  const { deliveryFee } = useZoneStore();
  const { user } = useAuthStore();

  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [phone, setPhone] = useState(user?.phone || '');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const subtotal = getTotal();
  const serviceFee = items.length > 0 ? 15 : 0;
  const total = subtotal + deliveryFee + serviceFee;

  useEffect(() => {
    if (user?.phone) setPhone(user.phone);
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!address.trim()) {
      setError(isAm ? 'እባክዎ አድራሻዎን ያስገቡ' : 'Please enter delivery address');
      return;
    }

    if (!phone.trim()) {
      setError(isAm ? 'እባክዎ ስልክ ቁጥርዎን ያስገቡ' : 'Please enter phone number');
      return;
    }

    if (!/^(\+251|0)[1-9]\d{8}$/.test(phone.replace(/[\s-]/g, ''))) {
      setError(isAm ? 'የተሳሳተ የስልክ ቁጥር' : 'Invalid phone number');
      return;
    }

    setLoading(true);

    try {
      const idempotencyKey = `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const businessId = items[0]?.businessId;
      if (!businessId) {
        setError(isAm ? 'ቅርጫት ባዶ ነው' : 'Cart is empty');
        return;
      }

      const order = await ordersApi.create({
        businessId,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          selectedOptions: item.options,
          notes: item.notes,
        })),
        deliveryAddress: address,
        deliveryNotes: notes,
        paymentMethod,
        idempotencyKey,
      });

      clearCart();
      navigate(`/app/order-confirmation?id=${order.id}`, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : (isAm ? 'ትዕዛዝ ማድረግ አልተሳካም' : 'Failed to place order'));
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center px-4">
        <EmptyState
          t={t}
          isAm={isAm}
          title={isAm ? 'ቅርጫት ባዶ ነው' : 'Cart is Empty'}
          actionLabel={isAm ? 'ወደ ቅርጫት ሂዱ' : 'Go to Cart'}
          onAction={() => navigate('/app/cart')}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 pb-28">
      <div className="px-4 py-4 space-y-6">
        <h1 className="font-display font-bold text-xl text-on-surface">
          {isAm ? 'ክፍያ' : 'Checkout'}
        </h1>

        <Card variant="outlined" padding="lg">
          <h2 className="font-bold text-on-surface mb-4">
            {isAm ? 'የማድረሻ ዝርዝር' : 'Delivery Details'}
          </h2>
          <div className="space-y-4">
            <Textarea
              label={isAm ? 'የማድረሻ አድራሻ' : 'Delivery Address'}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={isAm ? 'ስምምነት: ሳይት 2, ብሎክ 42, 3ኛ ፎቅ' : 'e.g., Site 2, Block 42, 3rd Floor'}
              fullWidth
              rows={3}
            />
            <Input
              label={isAm ? 'ስልክ ቁጥር' : 'Phone Number'}
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+251 9xx xxx xxx"
              fullWidth
            />
            <Input
              label={isAm ? 'የማድረሻ መመሪያ (አማራጭ)' : 'Delivery Notes (Optional)'}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={isAm ? 'ምሳሌ: በር ቁጥር 5, ወይም በ ቶታል ጋ' : 'e.g., Near Gate 5, behind Total station'}
              fullWidth
            />
          </div>
        </Card>

        <Card variant="outlined" padding="lg">
          <h2 className="font-bold text-on-surface mb-4">
            {isAm ? 'የክፍያ ዘዴ' : 'Payment Method'}
          </h2>
          <div className="space-y-3">
            {[
              { id: 'cash' as PaymentMethod, labelAm: 'ሲደርስ በጥሬ ገንዘብ', labelEn: 'Cash on Delivery', icon: 'payments' },
              { id: 'telebirr' as PaymentMethod, labelAm: 'ቴሌብር', labelEn: 'Telebirr', icon: 'phone_android' },
              { id: 'cbe_birr' as PaymentMethod, labelAm: 'CBE ብር / Chapa', labelEn: 'CBE Birr / Chapa', icon: 'account_balance' },
            ].map((method) => (
              <button
                key={method.id}
                type="button"
                onClick={() => setPaymentMethod(method.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                  paymentMethod === method.id
                    ? 'border-primary bg-primary/5'
                    : 'border-outline-variant hover:border-primary/50'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">{method.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-on-surface">{isAm ? method.labelAm : method.labelEn}</p>
                  {method.id !== 'cash' && (
                    <p className="text-xs text-on-surface-variant">
                      {isAm ? 'አሁን የለበት' : 'Coming soon'}
                    </p>
                  )}
                </div>
                {paymentMethod === method.id && (
                  <span className="material-symbols-outlined text-primary">check_circle</span>
                )}
              </button>
            ))}
          </div>
        </Card>

        {error && (
          <Card variant="outlined" padding="md" className="border-error bg-error/5">
            <p className="text-error text-sm">{error}</p>
          </Card>
        )}

        <Card variant="elevated" padding="lg" className="shadow-level-3">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">{isAm ? 'ንዑስ ድምር' : 'Subtotal'}</span>
              <span className="font-bold text-on-surface">{formatETB(subtotal, isAm)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">{isAm ? 'የማድረሻ ክፍያ' : 'Delivery Fee'}</span>
              <span className="font-bold text-on-surface">{formatETB(deliveryFee, isAm)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">{isAm ? 'የአገልግሎት ክፍያ' : 'Service Fee'}</span>
              <span className="font-bold text-on-surface">{formatETB(serviceFee, isAm)}</span>
            </div>
            <div className="border-t border-outline-variant pt-3"></div>
            <div className="flex justify-between text-lg">
              <span className="font-display font-bold text-on-surface">{isAm ? 'ጠቅላላ' : 'Total'}</span>
              <span className="font-display font-bold text-primary">{formatETB(total, isAm)}</span>
            </div>

            <Button
              variant="primary"
              size="xl"
              fullWidth
              onClick={handleSubmit}
              loading={loading}
              disabled={loading}
            >
              {isAm ? 'ትዕዛዙን አረጋግጥ' : 'Place Order'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}