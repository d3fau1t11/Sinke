import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@senik/i18n';
import { Button, Input } from '@senik/ui';
import { useAuthStore } from './store/authStore';
import { sendOtp } from './authService';

export function PhoneLoginScreen() {
  const { isAm } = useApp();
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setLoading: setAuthLoading } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!phone.trim()) {
      setError(isAm ? 'እባክዎ ስልክ ቁጥርዎን ያስገቡ' : 'Please enter your phone number');
      return;
    }

    const cleanPhone = phone.replace(/[\s-]/g, '');
    if (!/^(\+251|0)[1-9]\d{8}$/.test(cleanPhone)) {
      setError(isAm ? 'የተሳሳተ የስልክ ቁጥር' : 'Invalid phone number');
      return;
    }

    setLoading(true);
    setAuthLoading(true);

    const result = await sendOtp(cleanPhone);

    setLoading(false);
    setAuthLoading(false);

    if (result.success) {
      navigate('/auth/verify', { state: { phone: cleanPhone } });
    } else {
      setError(result.error || (isAm ? 'ስህተት ተከስቷል' : 'An error occurred'));
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-level-2">
        <div className="text-center mb-8">
          <h1 className="font-display font-bold text-3xl text-on-surface">
            {isAm ? 'ወደ ስንቅ ይግቡ' : 'Welcome to Senik'}
          </h1>
          <p className="mt-2 text-on-surface-variant">
            {isAm ? 'ስልክ ቁጥርዎን ያስገቡ ለመግባት' : 'Enter your phone number to continue'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label={isAm ? 'ስልክ ቁጥር' : 'Phone Number'}
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+251 9xx xxx xxx"
            error={error}
            fullWidth
            disabled={loading}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
          >
            {isAm ? 'ኮድ ይላክ' : 'Send Code'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-on-surface-variant">
          {isAm
            ? 'በመግባት የአገልግሎት ውሎች እና የግላዊነት ፖሊሲ ተቀብለዋል።'
            : 'By continuing, you agree to our Terms of Service and Privacy Policy.'}
        </p>
      </div>
    </div>
  );
}