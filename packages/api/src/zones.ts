import { supabase } from './client';

export const zonesApi = {
  async getZones() {
    const { data, error } = await supabase
      .from('zones')
      .select('id, name_am, name_en, subcity_am, subcity_en, delivery_fee, delivery_eta')
      .eq('is_active', true)
      .order('name_en');

    if (error) throw error;
    return data || [];
  },
};