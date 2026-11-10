import { useEffect, useState } from 'react';
import { supabase } from './client';
import { getStaffIdentity, hasBackendConfiguration } from './roleAuth';
import type { StaffIdentity, StaffRole } from './roleAuth';
import { getDemoRole } from './demo/session';

export function useStaffSession(
  role: StaffRole,
  onIdentity: (identity: StaffIdentity) => void,
  onSignedOut: () => void,
) {
  const [checking, setChecking] = useState(true);
  useEffect(() => {
    let active = true;
    let checkingSession = false;
    const restore = async () => {
      if (checkingSession || !active) return;
      checkingSession = true;
      const demoRole = role === 'merchant_staff' ? 'merchant' : role;
      try {
        if (getDemoRole() === demoRole) return;
        if (!hasBackendConfiguration()) { onSignedOut(); return; }
        const identity = await getStaffIdentity(role);
        if (active) onIdentity(identity);
      } catch {
        if (active) onSignedOut();
      } finally {
        checkingSession = false;
        if (active) setChecking(false);
      }
    };
    void restore();
    const listener = hasBackendConfiguration() ? supabase.auth.onAuthStateChange(() => {
      // Supabase callbacks must not wait on another auth request while its lock is held.
      setTimeout(() => { void restore(); }, 0);
    }).data.subscription : null;
    return () => { active = false; listener?.unsubscribe(); };
  }, [role, onIdentity, onSignedOut]);
  return checking;
}
