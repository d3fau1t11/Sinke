import { useStaffSession } from '@senik/api';
import type { StaffIdentity } from '@senik/api';
import { useRiderAuthStore } from '../../features/auth/store/riderAuthStore';

function restore({ profile, riderOnline }: StaffIdentity) {
  useRiderAuthStore.getState().setRider(profile.id, profile.full_name, profile.phone);
  useRiderAuthStore.getState().setIsOnline(riderOnline ?? false);
}
const reset = () => useRiderAuthStore.setState({ isAuthenticated: false, riderId: null });
export function useRiderSession() { return useStaffSession('rider', restore, reset); }
