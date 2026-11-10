import { useStaffSignIn } from '@senik/api';
import { useNavigate } from 'react-router-dom';
import { ordersApi, startDemoSession } from '@senik/api';
import { useRiderAuthStore } from '../store/riderAuthStore';
import { useRiderWalletStore } from '../../earnings/store/riderWalletStore';

export function useRiderLogin() {
  const navigate = useNavigate();
  const live = useStaffSignIn('rider', ({ profile, riderOnline }) => {
    useRiderAuthStore.getState().setRider(profile.id, profile.full_name, profile.phone);
    useRiderAuthStore.getState().setIsOnline(riderOnline ?? false);
    navigate('/deliveries', { replace: true });
  });
  const loginDemo = async () => {
    const profile = startDemoSession('rider');
    const orders = await ordersApi.getRiderOrders(profile.id);
    const lifetimeEarnings = orders
      .filter((order) => order.status === 'delivered')
      .reduce((sum, order) => sum + order.delivery_fee, 0);
    const withdrawals = useRiderWalletStore
      .getState()
      .withdrawals.filter((withdrawal) => withdrawal.riderId === profile.id);
    const withdrawn = withdrawals.reduce((sum, withdrawal) => sum + withdrawal.amount, 0);
    useRiderWalletStore.setState({
      lifetimeEarnings,
      balance: Math.max(0, lifetimeEarnings - withdrawn),
      withdrawals,
    });
    useRiderAuthStore.getState().setRider(profile.id, profile.full_name, profile.phone);
    navigate('/deliveries', { replace: true });
  };
  return { loginDemo, live };
}
