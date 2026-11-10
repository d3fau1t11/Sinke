import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { signInStaff, hasBackendConfiguration } from './roleAuth';
import type { StaffIdentity, StaffRole } from './roleAuth';

export function useStaffSignIn(role: StaffRole, onSuccess: (identity: StaffIdentity) => void) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const mutation = useMutation({
    mutationFn: () => signInStaff(email, password, role),
    onSuccess: (identity) => {
      setPassword('');
      onSuccess(identity);
    },
  });
  return {
    email,
    setEmail,
    password,
    setPassword,
    error: mutation.error ? 'Sign-in failed. Check your credentials and app role.' : '',
    pending: mutation.isPending,
    configured: hasBackendConfiguration(),
    submit: () => mutation.mutate(),
  };
}
