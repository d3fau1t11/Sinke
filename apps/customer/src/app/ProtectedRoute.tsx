import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../features/auth/store/authStore';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const authenticated = useAuthStore((state) => state.isAuthenticated);
  return authenticated ? <>{children}</> : <Navigate to="/auth/phone" replace />;
}
