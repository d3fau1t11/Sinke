import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { verifyOtp, resendOtp, getSession } from '../authService';

export function useOtpVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const phone = (location.state as { phone?: string } | null)?.phone ?? '';
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [cooldown, setCooldown] = useState(60);
  useEffect(() => { if (!phone) navigate('/auth/phone', { replace: true }); }, [phone, navigate]);
  useEffect(() => {
    if (!cooldown) return;
    const timer = setTimeout(() => setCooldown((value) => Math.max(0, value - 1)), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);
  const verify = async () => {
    if (!/^\d{6}$/.test(otp) || loading) return;
    setLoading(true); setError('');
    try {
      const result = await verifyOtp(phone, otp);
      if (!result.success || !result.user) throw new Error(result.error);
      const session = await getSession();
      if (!session) throw new Error('Missing session');
      useAuthStore.getState().setSession(session);
      useAuthStore.getState().setUser(result.user);
      navigate('/onboarding', { replace: true });
    } catch { setError('Verification failed. Try again.'); }
    finally { setLoading(false); }
  };
  const resend = async () => {
    if (cooldown || resendLoading) return;
    setResendLoading(true); setError('');
    try {
      const result = await resendOtp(phone);
      if (!result.success) throw new Error(result.error);
      setCooldown(60);
    } catch { setError('Could not send a code. Check your phone number and connection.'); }
    finally { setResendLoading(false); }
  };
  return { phone, otp, setOtp, loading, error, cooldown, resendLoading, verify, resend };
}
