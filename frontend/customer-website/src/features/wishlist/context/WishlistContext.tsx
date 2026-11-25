'use client';

import { createContext, useMemo, type ReactNode } from 'react';
import usePersistentState from '@/hooks/usePersistentState';
import type { Product } from '@/features/products/types/productTypes';

export interface WishlistContextValue {
  wishlist: Product[];
  ready: boolean;
  toggleWishlist: (product: Product) => void;
  isWishlisted: (id: string) => boolean;
}

export const WishlistContext = createContext<WishlistContextValue | null>(null);

/** Saved (favourite) products, stored in the browser. */
export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist, ready] = usePersistentState<Product[]>('shop.wishlist', []);

  const value = useMemo<WishlistContextValue>(
    () => ({
      wishlist,
      ready,
      toggleWishlist: (product) =>
        setWishlist((list) => (list.some((p) => p.id === product.id) ? list.filter((p) => p.id !== product.id) : [...list, product])),
      isWishlisted: (id) => wishlist.some((p) => p.id === id),
    }),
    [wishlist, ready, setWishlist],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}
