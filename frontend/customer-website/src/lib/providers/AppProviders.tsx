'use client';

import type { ReactNode } from 'react';
import { UIProvider } from './UIProvider';
import { AuthProvider } from '@/features/authentication/context/AuthContext';
import { CartProvider } from '@/features/cart/context/CartContext';
import { WishlistProvider } from '@/features/wishlist/context/WishlistContext';

/** Every app-wide React context, in one place. Used by app/layout.tsx. */
export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <UIProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>{children}</WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </UIProvider>
  );
}
