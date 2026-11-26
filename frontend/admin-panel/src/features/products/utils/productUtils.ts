import type { Product, ProductInput } from '@/types/models';
import { isBlank, type FormErrors } from '@/utils/validation';

export const emptyProduct = (): ProductInput => ({
  sku: '',
  name: '',
  type: 'Ring',
  category: 'rings',
  metal: '14K Yellow Gold',
  weightGrams: 0,
  price: 0,
  compareAtPrice: null,
  status: 'draft',
  badge: '',
  description: '',
  images: [],
  tags: [],
  stock: 0,
  lowStockThreshold: 5,
  specs: { diamondShape: '', caratWeight: null, diamondColor: '', diamondClarity: '', ringSizes: [] },
});

export const toInput = (product: Product): ProductInput => {
  const { id, createdAt, updatedAt, ...rest } = product;
  void id;
  void createdAt;
  void updatedAt;
  return rest;
};

export const validateProduct = (p: ProductInput, existingSkus: string[] = []): FormErrors<ProductInput> => {
  const e: FormErrors<ProductInput> = {};
  if (isBlank(p.name)) e.name = 'Enter a product name';
  if (isBlank(p.sku)) e.sku = 'Enter a style number (SKU)';
  else if (existingSkus.some((s) => s.toLowerCase() === p.sku.trim().toLowerCase())) e.sku = 'Another product already uses this SKU';
  if (isBlank(p.type)) e.type = 'Enter the type, e.g. Ring';
  if (!(p.price > 0)) e.price = 'Price must be more than 0';
  if (p.compareAtPrice != null && p.compareAtPrice <= p.price) e.compareAtPrice = 'Must be higher than the price (or leave empty)';
  if (p.stock < 0 || !Number.isInteger(p.stock)) e.stock = 'Stock must be a whole number, 0 or more';
  if (p.weightGrams < 0) e.weightGrams = 'Weight can’t be negative';
  return e;
};

export type StockStatus = 'In stock' | 'Low stock' | 'Out of stock';

export const stockStatus = (p: Pick<Product, 'stock' | 'lowStockThreshold'>): StockStatus =>
  p.stock <= 0 ? 'Out of stock' : p.stock <= p.lowStockThreshold ? 'Low stock' : 'In stock';

/** Rings and bands need ring sizes. Word match, so "Earrings" is not a ring. */
export const isRingType = (type: string) => /\b(ring|band)s?\b/i.test(type);
