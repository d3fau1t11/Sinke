import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@senik/i18n';
import { useAuthStore } from './store/authStore';
import { getSession, getUserProfile } from './authService';

export function SplashScreen() {
  const { isAm } = useApp();
  const navigate = useNavigate();
  const { setSession, setUser, setLoading } = useAuthStore();

  useEffect(() => {
    let mounted = true;

    async function checkAuth() {
      try {
        const session = await getSession();

        if (mounted) {
          if (session) {
            setSession(session);
            const user = await getUserProfile(session.user.id);
            if (mounted && user) {
              setUser(user);
              navigate('/app/home', { replace: true });
            } else if (mounted) {
              navigate('/auth/phone', { replace: true });
            }
          } else {
            navigate('/auth/phone', { replace: true });
          }
        }
      } catch (error) {
        if (mounted) {
          navigate('/auth/phone', { replace: true });
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    checkAuth();

    return () => {
      mounted = false;
    };
  }, [navigate, setSession, setUser, setLoading]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <img
          src="/senik-logo.jpg"
          alt="Senik"
          className="w-24 h-24 mx-auto mb-4 rounded-xl shadow-level-2"
        />
        <h1 className="font-display font-bold text-3xl text-on-surface">
          ስንቅ <span className="text-primary">SENIK</span>
        </h1>
        <p className="mt-2 text-on-surface-variant">
          {isAm ? 'የሰፈር ፈጣን ማድረሻ' : 'Hyperlocal Delivery'}
        </p>
        <div className="mt-8 w-32 h-2 mx-auto bg-primary rounded-full animate-pulse" />
      </div>
    </div>
  );
}