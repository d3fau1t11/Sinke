import type { Profile } from '@senik/types';

export type DemoRole = 'customer' | 'merchant' | 'rider' | 'admin';
export const DEMO_SESSION_KEY = 'senik-demo-session-v1';
export const DEMO_BUSINESS_ID = 'demo-restaurant-koye';
export const DEMO_ZONE_ID = 'demo-zone-koye';

export const demoAccounts: Record<DemoRole, Profile> = {
  customer: makeProfile('customer', 'Selam Demo', '0911000001'),
  merchant: makeProfile('merchant_staff', 'Koye Kitchen Demo', '0911000002'),
  rider: makeProfile('rider', 'Abebe Demo Rider', '0911000003'),
  admin: makeProfile('admin', 'Demo Administrator', '0911000004'),
};

function makeProfile(role: Profile['role'], name: string, phone: string): Profile {
  return {
    id: `demo-${role}`,
    full_name: name,
    phone,
    email: `${role}@demo.senik.example`,
    avatar_url: null,
    role,
    zone_id: DEMO_ZONE_ID,
    created_at: '2026-01-01T09:00:00.000Z',
    updated_at: '2026-01-01T09:00:00.000Z',
  };
}

export function getDemoRole(): DemoRole | null {
  const role = globalThis.localStorage?.getItem(DEMO_SESSION_KEY);
  return role === 'customer' || role === 'merchant' || role === 'rider' || role === 'admin'
    ? role
    : null;
}

export function isDemoSession(): boolean {
  return getDemoRole() !== null;
}

export function startDemoSession(role: DemoRole): Profile {
  globalThis.localStorage.setItem(DEMO_SESSION_KEY, role);
  return { ...demoAccounts[role] };
}

export function endDemoSession(): void {
  globalThis.localStorage?.removeItem(DEMO_SESSION_KEY);
}

export function getDemoProfile(): Profile | null {
  const role = getDemoRole();
  return role ? { ...demoAccounts[role] } : null;
}

export function requireDemoRole(...roles: DemoRole[]): Profile {
  const role = getDemoRole();
  if (!role || !roles.includes(role))
    throw new Error('This demo account cannot perform that action.');
  return { ...demoAccounts[role] };
}
