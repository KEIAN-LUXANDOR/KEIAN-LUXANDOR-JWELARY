import type { Product } from '@/features/products/types/productTypes';
import type { CartItem } from '../types/cartTypes';

const keyOf = (productId: string, metal: string, size: string | null) => `${productId}|${metal}|${size ?? ''}`;
export const itemKey = (item: CartItem) => keyOf(item.product.id, item.product.metal, item.size);

/** Adds a product, merging with an existing line of the same product, metal and size. */
export const addItem = (cart: CartItem[], product: Product, qty: number, size: string | null): CartItem[] => {
  const key = keyOf(product.id, product.metal, size);
  const exists = cart.find((i) => itemKey(i) === key);
  return exists ? cart.map((i) => (i === exists ? { ...i, qty: i.qty + qty } : i)) : [...cart, { product, qty, size }];
};

export const cartCount = (cart: CartItem[]) => cart.reduce((n, i) => n + i.qty, 0);
export const cartSubtotal = (cart: CartItem[]) => cart.reduce((n, i) => n + i.qty * i.product.price, 0);
