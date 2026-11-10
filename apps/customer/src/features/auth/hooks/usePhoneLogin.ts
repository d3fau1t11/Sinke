import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@senik/i18n';
import { startDemoSession, DEMO_ZONE_ID } from '@senik/api';
import { useAuthStore } from '../store/authStore';
import { useZoneStore } from '../../zone/store/zoneStore';
import { useCartStore } from '../../cart/store/cartStore';
import { sendOtp } from '../authService';

export function usePhoneLogin() {
  const { isAm } = useApp();
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const loginDemo = () => {
    const user = startDemoSession('customer');
    useCartStore.getState().clearCart();
    useZoneStore.getState().setZone(DEMO_ZONE_ID, 'Koye Feche', 'ኮዬ ፈጬ', 40);
    useAuthStore.setState({
      user,
      session: null,
      isAuthenticated: true,
      isLoading: false,
    });
    navigate('/app/home', { replace: true });
  };
  const submit = async () => {
    const cleanPhone = phone.replace(/[\s-]/g, '');
    if (!/^(\+251|0)[1-9]\d{8}$/.test(cleanPhone)) {
      setError(isAm ? 'የተሳሳተ የስልክ ቁጥር' : 'Enter a valid Ethiopian phone number.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const result = await sendOtp(cleanPhone);
      if (result.success) navigate('/auth/verify', { state: { phone: cleanPhone } });
      else setError(result.error ?? 'Could not send a code. Try demo sign-in.');
    } finally {
      setLoading(false);
    }
  };
  return { isAm, phone, setPhone, error, loading, loginDemo, submit };
}
