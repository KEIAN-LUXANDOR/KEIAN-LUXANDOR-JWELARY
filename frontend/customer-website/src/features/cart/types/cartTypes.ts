import type { Product } from '@/features/products/types/productTypes';

export interface CartItem {
  product: Product;
  qty: number;
  size: string | null; // ring size, when relevant
}
