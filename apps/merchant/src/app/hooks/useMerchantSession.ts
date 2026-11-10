import { useStaffSession } from '@senik/api';
import type { StaffIdentity } from '@senik/api';
import { useMerchantAuthStore } from '../../features/auth/store/merchantAuthStore';

function restore({ business }: StaffIdentity) {
  if (business) useMerchantAuthStore.getState().setMerchant(
    business.id, business.name_en, business.name_am, business.is_open,
  );
}
const reset = () => useMerchantAuthStore.setState({ isAuthenticated: false, merchantId: null });
export function useMerchantSession() { return useStaffSession('merchant_staff', restore, reset); }
