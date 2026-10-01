import { supabase } from './client';

export const businessesApi = {
  async getByZone(zoneId: string) {
    const { data, error } = await supabase
      .from('businesses')
      .select('id, name_am, name_en, description_am, description_en, avatar_image, delivery_eta, delivery_fee, rating, is_open, is_fasting_friendly, is_halal')
      .eq('zone_id', zoneId)
      .eq('is_open', true)
      .order('rating', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async search(query: string) {
    const { data, error } = await supabase
      .from('businesses')
      .select('id, name_am, name_en, description_am, description_en, avatar_image, delivery_eta, delivery_fee, rating, is_open')
      .or(`name_am.ilike.%${query}%,name_en.ilike.%${query}%,description_am.ilike.%${query}%,description_en.ilike.%${query}%`)
      .eq('is_open', true)
      .order('rating', { ascending: false })
      .limit(10);

    if (error) throw error;
    return data || [];
  },
};