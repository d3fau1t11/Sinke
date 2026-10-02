import { supabase, asRows } from './client';
import type { ZoneListItem } from '@senik/types';

export const zonesApi = {
  async getZones(): Promise<ZoneListItem[]> {
    const { data, error } = await supabase
      .from('zones')
      .select('id, name_am, name_en, subcity_am, subcity_en, delivery_fee, delivery_eta')
      .eq('is_active', true)
      .order('name_en');

    if (error) throw error;
    return asRows<ZoneListItem>(data);
  },
};
