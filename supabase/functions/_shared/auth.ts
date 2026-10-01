import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export interface AuthContext {
  userId: string;
  role: 'customer' | 'merchant_staff' | 'rider' | 'admin';
  phone: string;
}

export async function authenticateRequest(
  req: Request,
  supabaseUrl: string,
  serviceRoleKey: string
): Promise<AuthContext | null> {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return null;

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    global: { headers: { Authorization: authHeader } }
  });

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, phone')
    .eq('id', user.id)
    .single();

  if (!profile) return null;

  return {
    userId: user.id,
    role: profile.role,
    phone: profile.phone
  };
}

export function requireRole(auth: AuthContext | null, roles: string[]): AuthContext {
  if (!auth) {
    throw new Error('Unauthorized');
  }
  if (!roles.includes(auth.role)) {
    throw new Error('Forbidden');
  }
  return auth;
}