'use client';

import { createContext, useMemo, type ReactNode } from 'react';
import usePersistentState from '@/hooks/usePersistentState';
import type { Product } from '@/features/products/types/productTypes';
import type { CartItem } from '../types/cartTypes';
import { addItem, cartCount, cartSubtotal } from '../utils/cartHelpers';

export interface CartContextValue {
  cart: CartItem[];
  ready: boolean; // false until the saved cart has loaded in the browser
  cartCount: number;
  cartTotal: number;
  addToCart: (product: Product, qty?: number, size?: string | null) => void;
  setQty: (index: number, qty: number) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextValue | null>(null);

/** Shopping bag, saved in the browser. Swap for a backend cart API later. */
export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart, ready] = usePersistentState<CartItem[]>('shop.cart', []);

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      ready,
      cartCount: cartCount(cart),
      cartTotal: cartSubtotal(cart),
      addToCart: (product, qty = 1, size = null) => setCart((c) => addItem(c, product, qty, size)),
      setQty: (index, qty) =>
        setCart((c) => c.map((i, idx) => (idx === index ? { ...i, qty: Math.max(0, qty) } : i)).filter((i) => i.qty > 0)),
      removeFromCart: (index) => setCart((c) => c.filter((_, idx) => idx !== index)),
      clearCart: () => setCart([]),
    }),
    [cart, ready, setCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
