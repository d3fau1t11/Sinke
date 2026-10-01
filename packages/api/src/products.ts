import { supabase } from './client';

export const productsApi = {
  async getPopular() {
    const { data, error } = await supabase
      .from('products')
      .select('id, business_id, name_am, name_en, price, image, is_fasting, is_available, popular')
      .eq('popular', true)
      .eq('is_available', true)
      .order('name_en')
      .limit(20);

    if (error) throw error;
    return data || [];
  },

  async getByBusiness(businessId: string) {
    const { data, error } = await supabase
      .from('products')
      .select('id, business_id, name_am, name_en, description_am, description_en, price, image, category, is_fasting, is_available, popular, product_options(*)')
      .eq('business_id', businessId)
      .eq('is_available', true)
      .order('category')
      .order('name_en');

    if (error) throw error;
    return data || [];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*, product_options(*)')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async search(query: string) {
    const { data, error } = await supabase
      .from('products')
      .select('id, business_id, name_am, name_en, description_am, description_en, price, image, category, is_fasting, is_available, popular')
      .or(`name_am.ilike.%${query}%,name_en.ilike.%${query}%,description_am.ilike.%${query}%,description_en.ilike.%${query}%`)
      .eq('is_available', true)
      .order('popular', { ascending: false })
      .order('name_en')
      .limit(20);

    if (error) throw error;
    return data || [];
  },
};