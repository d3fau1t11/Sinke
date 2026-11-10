import { useNavigate } from 'react-router-dom';
import { startDemoSession, useStaffSignIn } from '@senik/api';
import { useAdminAuthStore } from '../store/adminAuthStore';

export function useAdminLogin() {
  const navigate = useNavigate();
  const store = useAdminAuthStore();
  const live = useStaffSignIn('admin', ({ profile }) => {
    useAdminAuthStore.setState({
      adminName: profile.full_name,
      adminEmail: profile.email ?? '',
      adminRole: 'admin',
      isAuthenticated: true,
      loginError: '',
    });
    navigate('/overview', { replace: true });
  });
  const enterDemo = () => {
    startDemoSession('admin');
    store.loginDemo();
    navigate('/overview', { replace: true });
  };
  return { ...live, enterDemo };
}
