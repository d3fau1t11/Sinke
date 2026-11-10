import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getDemoProfile } from '@senik/api';
import { useAuthStore } from '../store/authStore';
import { getSession, getUserProfile } from '../authService';

export function useStartup() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  useEffect(() => {
    let active = true;
    const check = async () => {
      try {
        const demoProfile = getDemoProfile();
        if (demoProfile?.role === 'customer') {
          useAuthStore.setState({
            user: demoProfile,
            session: null,
            isAuthenticated: true,
          });
          navigate(pathname.startsWith('/app/') ? pathname : '/app/home', {
            replace: true,
          });
          return;
        }
        const session = await getSession();
        const user = session ? await getUserProfile(session.user.id) : null;
        if (!active) return;
        useAuthStore.setState({
          session,
          user,
          isAuthenticated: Boolean(session && user),
        });
        navigate(user ? (pathname.startsWith('/app/') ? pathname : '/app/home') : '/auth/phone', {
          replace: true,
        });
      } catch {
        if (active) {
          useAuthStore.setState({
            session: null,
            user: null,
            isAuthenticated: false,
          });
          navigate('/auth/phone', { replace: true });
        }
      } finally {
        if (active) useAuthStore.getState().setLoading(false);
      }
    };
    void check();
    return () => {
      active = false;
    };
  }, [navigate, pathname]);
}
