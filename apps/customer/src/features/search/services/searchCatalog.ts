import { productsApi, businessesApi } from '@senik/api';
import type { SearchResult } from '@senik/types';

export async function searchCatalog(query: string): Promise<SearchResult[]> {
  const [products, businesses] = await Promise.all([
    productsApi.search(query), businessesApi.search(query),
  ]);
  return [
    ...products.map((row): SearchResult => ({ ...row, type: 'product' })),
    ...businesses.map((row): SearchResult => ({ ...row, type: 'merchant' })),
  ];
}
