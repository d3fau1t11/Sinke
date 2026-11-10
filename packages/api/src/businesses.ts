import { supabase, asRows, asRow } from './client';
import { isDemoSession } from './demo/session';
import { readDemoData } from './demo/store';
import { searchDemo, updateDemoBusiness } from './demo/catalogApi';
import type { Business, BusinessListItem, BusinessSearchResult } from '@senik/types';

export const businessesApi = {
  async getByZone(zoneId: string): Promise<BusinessListItem[]> {
    if (isDemoSession())
      return readDemoData().businesses.filter((row) => row.zone_id === zoneId && row.is_open);
    const { data, error } = await supabase
      .from('businesses')
      .select(
        'id, name_am, name_en, description_am, description_en, avatar_image, delivery_eta, delivery_fee, rating, is_open, is_fasting_friendly, is_halal',
      )
      .eq('zone_id', zoneId)
      .eq('is_open', true)
      .order('rating', { ascending: false });

    if (error) throw error;
    return asRows<BusinessListItem>(data);
  },

  async getById(id: string): Promise<Business | null> {
    if (isDemoSession()) return readDemoData().businesses.find((row) => row.id === id) ?? null;
    const { data, error } = await supabase.from('businesses').select('*').eq('id', id).single();

    if (error) throw error;
    return asRow<Business>(data);
  },

  async search(query: string): Promise<BusinessSearchResult[]> {
    if (isDemoSession())
      return searchDemo(
        readDemoData().businesses.filter((row) => row.is_open),
        query,
      );
    const { data, error } = await supabase
      .from('businesses')
      .select(
        'id, name_am, name_en, description_am, description_en, avatar_image, delivery_eta, delivery_fee, rating, is_open',
      )
      .or(
        `name_am.ilike.%${query}%,name_en.ilike.%${query}%,description_am.ilike.%${query}%,description_en.ilike.%${query}%`,
      )
      .eq('is_open', true)
      .order('rating', { ascending: false })
      .limit(10);

    if (error) throw error;
    return asRows<BusinessSearchResult>(data);
  },

  async getAll(): Promise<Business[]> {
    if (isDemoSession()) return readDemoData().businesses;
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .order('rating', { ascending: false });

    if (error) throw error;
    return asRows<Business>(data);
  },

  async setIsOpen(id: string, isOpen: boolean): Promise<void> {
    if (isDemoSession()) return updateDemoBusiness(id, isOpen);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('businesses')
      .update({ is_open: isOpen })
      .eq('id', id);

    if (error) throw error;
  },
};
