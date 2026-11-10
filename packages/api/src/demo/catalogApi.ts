import type { Business, ProductWithOptions, TableInsert, TableUpdate } from '@senik/types';
import { readDemoData, writeDemoData } from './store';
import { requireDemoRole } from './session';

export function updateDemoBusiness(id: string, isOpen: boolean): void {
  requireDemoRole('merchant', 'admin');
  const data = readDemoData();
  const business = data.businesses.find((row) => row.id === id);
  if (!business) throw new Error('Restaurant not found.');
  business.is_open = isOpen;
  writeDemoData(data);
}

export function createDemoProduct(input: TableInsert<'products'>): ProductWithOptions {
  requireDemoRole('merchant', 'admin');
  validatePrice(input.price);
  if (!input.name_en.trim()) throw new Error('Enter a dish name.');
  const data = readDemoData();
  const stamp = new Date().toISOString();
  const product: ProductWithOptions = {
    ...input,
    id: crypto.randomUUID(),
    is_available: input.is_available ?? true,
    is_fasting: input.is_fasting ?? false,
    popular: input.popular ?? false,
    created_at: stamp,
    updated_at: stamp,
    product_options: [],
  };
  data.products.push(product);
  writeDemoData(data);
  return product;
}

export function updateDemoProduct(id: string, input: TableUpdate<'products'>): void {
  requireDemoRole('merchant', 'admin');
  if (input.price !== undefined) validatePrice(input.price);
  const data = readDemoData();
  const product = data.products.find((row) => row.id === id);
  if (!product) throw new Error('Dish not found.');
  Object.assign(product, input, { updated_at: new Date().toISOString() });
  writeDemoData(data);
}

export function deleteDemoProduct(id: string): void {
  requireDemoRole('merchant', 'admin');
  const data = readDemoData();
  data.products = data.products.filter((row) => row.id !== id);
  writeDemoData(data);
}

function validatePrice(price: number): void {
  if (!Number.isFinite(price) || price <= 0) throw new Error('Price must be greater than zero.');
}

export function searchDemo<
  T extends Pick<Business, 'name_am' | 'name_en' | 'description_am' | 'description_en'>,
>(rows: T[], query: string): T[] {
  const term = query.trim().toLocaleLowerCase();
  return rows.filter((row) =>
    [row.name_en, row.name_am, row.description_en, row.description_am].some((value) =>
      value.toLocaleLowerCase().includes(term),
    ),
  );
}
