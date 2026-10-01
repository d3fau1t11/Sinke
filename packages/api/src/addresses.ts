import { supabase } from './client';
import type { Database } from '@senik/types';

type AddressesRow = Database['public']['Tables']['addresses']['Row'];
type AddressesInsert = Database['public']['Tables']['addresses']['Insert'];
type AddressesUpdate = Database['public']['Tables']['addresses']['Update'];

export const addressesApi = {
  async getMyAddresses(): Promise<AddressesRow[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await (supabase
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .from('addresses') as any)
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async addAddress(input: { label: string; full_address: string; landmark?: string }): Promise<AddressesRow> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await (supabase
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .from('addresses') as any)
      .insert({
        user_id: user.id,
        ...input,
      } as AddressesInsert)
      .select()
      .single();

    if (error) throw error;
    return data!;
  },

  async updateAddress(id: string, input: { label: string; full_address: string; landmark?: string }): Promise<AddressesRow> {
    const { data, error } = await (supabase
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .from('addresses') as any)
      .update(input as AddressesUpdate)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data!;
  },

  async deleteAddress(id: string): Promise<void> {
    const { error } = await (supabase
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .from('addresses') as any)
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async setDefault(id: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // First, unset all defaults
    await (supabase
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .from('addresses') as any)
      .update({ is_default: false } as AddressesUpdate)
      .eq('user_id', user.id);

    // Then set the new default
    const { error } = await (supabase
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .from('addresses') as any)
      .update({ is_default: true } as AddressesUpdate)
      .eq('id', id);

    if (error) throw error;
  },
};