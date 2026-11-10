import { supabase, asRows, asRow } from './client';
import { isDemoSession } from './demo/session';
import { readDemoData } from './demo/store';
import {
  createDemoProduct,
  updateDemoProduct,
  deleteDemoProduct,
  searchDemo,
} from './demo/catalogApi';
import type {
  ProductListItem,
  ProductSearchResult,
  ProductWithOptions,
  TableInsert,
  TableUpdate,
} from '@senik/types';

export const productsApi = {
  async getPopular(): Promise<ProductListItem[]> {
    if (isDemoSession())
      return readDemoData().products.filter((row) => row.popular && row.is_available);
    const { data, error } = await supabase
      .from('products')
      .select('id, business_id, name_am, name_en, price, image, is_fasting, is_available, popular')
      .eq('popular', true)
      .eq('is_available', true)
      .order('name_en')
      .limit(20);

    if (error) throw error;
    return asRows<ProductListItem>(data);
  },

  async getByBusiness(businessId: string): Promise<ProductWithOptions[]> {
    if (isDemoSession())
      return readDemoData().products.filter(
        (row) => row.business_id === businessId && row.is_available,
      );
    const { data, error } = await supabase
      .from('products')
      .select(
        'id, business_id, name_am, name_en, description_am, description_en, price, image, category, is_fasting, is_available, popular, product_options(*)',
      )
      .eq('business_id', businessId)
      .eq('is_available', true)
      .order('category')
      .order('name_en');

    if (error) throw error;
    return asRows<ProductWithOptions>(data);
  },

  async getById(id: string): Promise<ProductWithOptions | null> {
    if (isDemoSession()) return readDemoData().products.find((row) => row.id === id) ?? null;
    const { data, error } = await supabase
      .from('products')
      .select('*, product_options(*)')
      .eq('id', id)
      .single();

    if (error) throw error;
    return asRow<ProductWithOptions>(data);
  },

  async search(query: string): Promise<ProductSearchResult[]> {
    if (isDemoSession())
      return searchDemo(
        readDemoData().products.filter((row) => row.is_available),
        query,
      );
    const { data, error } = await supabase
      .from('products')
      .select(
        'id, business_id, name_am, name_en, description_am, description_en, price, image, category, is_fasting, is_available, popular',
      )
      .or(
        `name_am.ilike.%${query}%,name_en.ilike.%${query}%,description_am.ilike.%${query}%,description_en.ilike.%${query}%`,
      )
      .eq('is_available', true)
      .order('popular', { ascending: false })
      .order('name_en')
      .limit(20);

    if (error) throw error;
    return asRows<ProductSearchResult>(data);
  },

  async getAllByBusiness(businessId: string): Promise<ProductWithOptions[]> {
    if (isDemoSession())
      return readDemoData().products.filter((row) => row.business_id === businessId);
    const { data, error } = await supabase
      .from('products')
      .select(
        'id, business_id, name_am, name_en, description_am, description_en, price, image, category, is_fasting, is_available, popular, product_options(*)',
      )
      .eq('business_id', businessId)
      .order('name_en');

    if (error) throw error;
    return asRows<ProductWithOptions>(data);
  },

  async setIsAvailable(id: string, isAvailable: boolean): Promise<void> {
    if (isDemoSession()) return updateDemoProduct(id, { is_available: isAvailable });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('products')
      .update({ is_available: isAvailable })
      .eq('id', id);

    if (error) throw error;
  },

  async create(product: TableInsert<'products'>): Promise<ProductWithOptions> {
    if (isDemoSession()) return createDemoProduct(product);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('products')
      .insert(product)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: TableUpdate<'products'>): Promise<void> {
    if (isDemoSession()) return updateDemoProduct(id, updates);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from('products').update(updates).eq('id', id);

    if (error) throw error;
  },

  async delete(id: string): Promise<void> {
    if (isDemoSession()) return deleteDemoProduct(id);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from('products').delete().eq('id', id);

    if (error) throw error;
  },
};
