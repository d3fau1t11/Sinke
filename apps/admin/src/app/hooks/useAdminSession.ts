import { useStaffSession } from '@senik/api';
import type { StaffIdentity } from '@senik/api';
import { useAdminAuthStore } from '../../features/auth/store/adminAuthStore';

function restore({ profile }: StaffIdentity) {
  useAdminAuthStore.setState({ adminName: profile.full_name, adminEmail: profile.email ?? '',
    adminRole: 'admin', isAuthenticated: true });
}
const reset = () => useAdminAuthStore.setState({ isAuthenticated: false });
export function useAdminSession() { return useStaffSession('admin', restore, reset); }
