import { useText } from '@senik/i18n';
import { ActiveDeliverySection1 } from './components/ActiveDeliverySection1';
import { Button, Skeleton, EmptyState } from '@senik/ui';
import { formatETB } from '@senik/utils';
import { StepIndicator } from './StepIndicator';
import { useActiveDelivery } from './hooks/useActiveDelivery';

export function ActiveDeliveryScreen() {
  const text = useText();
  const {
    navigate,
    activeOrder,
    loading,
    updating,
    step,
    error,
    handlePickedUp,
    handleMarkDelivered,
  } = useActiveDelivery();
  if (loading) return <Skeleton variant="rectangular" height="220px" />;
  if (!activeOrder)
    return (
      <EmptyState
        t={(key) => key}
        isAm={false}
        title={text('No Active Delivery')}
        message={error || 'Accept a ready job to start delivering.'}
        actionLabel={text('Browse Available Jobs')}
        onAction={() => navigate('/deliveries')}
      />
    );
  if (step === 2)
    return (
      <div className="text-center py-12 space-y-4">
        <h1 className="font-display font-bold text-2xl text-secondary">{text('Delivered!')}</h1>
        <p className="text-secondary font-bold">
          +{formatETB(activeOrder.delivery_fee)} {text('added to your balance')}
        </p>
        <Button onClick={() => navigate('/earnings')}>{text('View Earnings')}</Button>
      </div>
    );
  return (
    <div className="space-y-5">
      <h1 className="font-display font-bold text-title-lg text-on-surface">
        {text('Order #')}
        {activeOrder.order_number}
      </h1>
      <StepIndicator step={step} />
      {error && (
        <p role="alert" className="text-error">
          {text(error ?? '')}
        </p>
      )}
      <ActiveDeliverySection1 {...{ activeOrder }} />
      <Button
        fullWidth
        size="lg"
        loading={updating}
        onClick={() => void (step === 0 ? handlePickedUp() : handleMarkDelivered())}
      >
        {step === 0 ? text('Mark as Picked Up') : text('Mark as Delivered')}
      </Button>
    </div>
  );
}
