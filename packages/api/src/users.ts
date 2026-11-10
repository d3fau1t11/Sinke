import type { Profile } from '@senik/types';
import { supabase, asRows } from './client';
import { demoAccounts, isDemoSession } from './demo/session';

export const usersApi = {
  async getAll(): Promise<Profile[]> {
    if (isDemoSession()) return Object.values(demoAccounts).map((profile) => ({ ...profile }));
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return asRows<Profile>(data);
  },
};
