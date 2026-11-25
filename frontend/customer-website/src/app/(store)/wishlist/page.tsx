import type { Metadata } from 'next';
import WishlistView from '@/features/wishlist/components/WishlistView';

export const metadata: Metadata = { title: 'Wishlist' };

// Address: /wishlist
export default function WishlistPage() {
  return <WishlistView />;
}
