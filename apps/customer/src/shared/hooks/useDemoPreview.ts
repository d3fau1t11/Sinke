import { isDemoSession, resetDemoData } from '@senik/api';
import { useQueryClient } from '@tanstack/react-query';

export function useDemoPreview() {
  const queryClient = useQueryClient();
  const reset = () => {
    resetDemoData();
    localStorage.removeItem('senik-cart');
    localStorage.removeItem('senik-merchant-wallet');
    localStorage.removeItem('senik-rider-wallet');
    queryClient.clear();
    window.location.assign('/app/home');
  };
  return { isDemo: isDemoSession(), reset };
}
