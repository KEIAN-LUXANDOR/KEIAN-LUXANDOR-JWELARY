'use client';

import ProductCardView from '@/components/product-card/ProductCard';
import Icon from '@/components/common/Icon';
import { useUI } from '@/lib/providers/UIProvider';
import { useCart } from '@/features/cart/hooks/useCart';
import { useWishlist } from '@/features/wishlist/hooks/useWishlist';
import { formatPrice } from '@/utils/formatPrice';
import type { Product } from '../types/productTypes';
import { productHref } from '../utils/productHelpers';

/** Displays a ring, necklace, pendant… with wishlist and quick "Add to Bag". */
export default function ProductCard({ product }: { product: Product }) {
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useUI();
  const saved = isWishlisted(product.id);

  return (
    <ProductCardView
      href={productHref(product)}
      name={product.name}
      price={formatPrice(product.price)}
      tone={product.tone}
      label={product.type}
      image={product.image}
      badge={product.badge}
      actions={
        <>
          <button
            className={`pcard__wish ${saved ? 'is-saved' : ''}`}
            aria-pressed={saved}
            aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
            onClick={() => {
              toggleWishlist(product);
              showToast(saved ? 'Removed from wishlist' : 'Added to wishlist');
            }}
          >
            <Icon name="heart" size={18} filled={saved} />
          </button>
          <button
            className="pcard__quick"
            onClick={() => {
              addToCart(product, 1);
              showToast('Added to bag');
            }}
          >
            Add to Bag
          </button>
        </>
      }
    />
  );
}
