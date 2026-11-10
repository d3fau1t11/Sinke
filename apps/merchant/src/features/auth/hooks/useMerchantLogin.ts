import { useStaffSignIn } from '@senik/api';
import { useNavigate } from 'react-router-dom';
import { startDemoSession, DEMO_BUSINESS_ID } from '@senik/api';
import { useMerchantAuthStore } from '../store/merchantAuthStore';

export function useMerchantLogin() {
  const navigate = useNavigate();
  const live = useStaffSignIn('merchant_staff', ({ business }) => {
    if (business) {
      useMerchantAuthStore
        .getState()
        .setMerchant(business.id, business.name_en, business.name_am, business.is_open);
      navigate('/dashboard', { replace: true });
    }
  });
  const loginDemo = () => {
    startDemoSession('merchant');
    useMerchantAuthStore.getState().setMerchant(DEMO_BUSINESS_ID, 'Koye Kitchen', 'ኮዬ ኪችን', true);
    navigate('/dashboard', { replace: true });
  };
  return { loginDemo, live };
}
