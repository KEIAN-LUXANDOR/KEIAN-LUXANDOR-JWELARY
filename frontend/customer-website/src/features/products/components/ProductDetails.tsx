'use client';

import Link from 'next/link';
import { useState, type CSSProperties, type ReactNode } from 'react';
import Icon from '@/components/common/Icon';
import { useUI } from '@/lib/providers/UIProvider';
import { useCart } from '@/features/cart/hooks/useCart';
import { useWishlist } from '@/features/wishlist/hooks/useWishlist';
import { getCollectionTitle } from '@/features/categories/utils/collectionTitle';
import { collectionHref } from '@/features/categories/utils/categoryConfig';
import { formatPrice } from '@/utils/formatPrice';
import useFetch from '@/hooks/useFetch';
import useProductDetails from '../hooks/useProductDetails';
import { getRelatedProducts } from '../services/productService';
import type { Product } from '../types/productTypes';
import { isRing, METAL_SWATCHES, RING_SIZES } from '../utils/productHelpers';
import ProductGallery from './ProductGallery';
import ProductSpecifications from './ProductSpecifications';
import ProductGrid from './ProductGrid';
import './ProductDetails.css';

function Accordion({ title, children, defaultOpen = false }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`acc ${open ? 'is-open' : ''}`}>
      <button className="acc__btn" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span className="eyebrow">{title}</span>
        <Icon name={open ? 'minus' : 'plus'} size={16} />
      </button>
      {open && <div className="acc__body">{children}</div>}
    </div>
  );
}

function NotFound() {
  return (
    <section className="section container empty-state">
      <p className="eyebrow muted">404</p>
      <p className="serif">We couldn’t find that page.</p>
      <Link href="/" className="btn">
        Back to Home
      </Link>
    </section>
  );
}

/** Product page. Step 1: load the product from the backend (GET /api/products/{id}). */
export default function ProductDetails({ id }: { id: string }) {
  const { product, loading, error, notFound } = useProductDetails(id);

  if (loading) {
    return (
      <section className="section container empty-state">
        <p className="muted">Loading…</p>
      </section>
    );
  }
  if (notFound || !product) {
    if (error) {
      return (
        <section className="section container empty-state">
          <p className="serif">We couldn’t load this product.</p>
          <p className="muted">Check that the Spring Boot backend is running on port 8080.</p>
        </section>
      );
    }
    return <NotFound />;
  }
  return <ProductView key={product.id} product={product} />;
}

// Step 2: show the product.
function ProductView({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { open, showToast } = useUI();
  const [metal, setMetal] = useState(product.metal);
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [sizeError, setSizeError] = useState(false);

  // "You May Also Like": other products from the same collection.
  const { data: related } = useFetch(() => getRelatedProducts(product, 4), product.id);

  const ring = isRing(product);
  const saved = isWishlisted(product.id);
  const collectionTitle = getCollectionTitle(product.collection);

  const handleAdd = () => {
    if (ring && !size) {
      setSizeError(true);
      return;
    }
    addToCart({ ...product, metal: metal || product.metal }, qty, size);
    showToast('Added to bag');
  };

  return (
    <div className="container pdp">
      <nav className="breadcrumbs pdp__crumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link> / <Link href={collectionHref(product.collection)}>{collectionTitle}</Link> / <span aria-current="page">{product.name}</span>
      </nav>

      <div className="pdp__grid">
        <ProductGallery product={product} />

        {/* Info */}
        <div className="pdp__info">
          <p className="eyebrow muted">{collectionTitle}</p>
          <h1 className="pdp__title">{product.name}</h1>
          <div className="pdp__meta">
            <span className="pdp__rating" aria-label={`Rated ${Number(product.rating).toFixed(1)} out of 5`}>
              {Array.from({ length: 5 }, (_, i) => (
                <Icon key={i} name="star" size={14} filled={i < Math.round(product.rating)} />
              ))}
              <span className="muted">({product.reviews})</span>
            </span>
            {product.sku && <span className="muted">Style #{product.sku}</span>}
          </div>
          <p className="pdp__price">{formatPrice(product.price)}</p>

          <div className="pdp__option">
            <p className="eyebrow">
              Metal: <span className="muted">{metal}</span>
            </p>
            <div className="pdp__swatches">
              {METAL_SWATCHES.map((m) => (
                <button
                  key={m.name}
                  className={metal === m.name ? 'is-active' : ''}
                  style={{ '--sw': m.color } as CSSProperties}
                  onClick={() => setMetal(m.name)}
                  aria-label={m.name}
                  aria-pressed={metal === m.name}
                />
              ))}
            </div>
          </div>

          {ring && (
            <div className="pdp__option">
              <p className="eyebrow">Ring Size {sizeError && <span className="field-error"> — please select a size</span>}</p>
              <div className="pdp__sizes">
                {RING_SIZES.map((s) => (
                  <button
                    key={s}
                    className={size === s ? 'is-active' : ''}
                    onClick={() => {
                      setSize(s);
                      setSizeError(false);
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="pdp__actions">
            <div className="qty">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
                <Icon name="minus" size={14} />
              </button>
              <span aria-live="polite">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity">
                <Icon name="plus" size={14} />
              </button>
            </div>
            <button className="btn pdp__add" onClick={handleAdd}>
              Add to Bag
            </button>
            <button
              className={`pdp__wish ${saved ? 'is-saved' : ''}`}
              onClick={() => {
                toggleWishlist(product);
                showToast(saved ? 'Removed from wishlist' : 'Added to wishlist');
              }}
              aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
              aria-pressed={saved}
            >
              <Icon name="heart" filled={saved} />
            </button>
          </div>

          <div className="pdp__help">
            <button onClick={() => open('appointment')}>
              <Icon name="calendar" size={18} /> Book an Appointment
            </button>
            <Link href="/store-locator">
              <Icon name="pin" size={18} /> Find in Store
            </Link>
            <button onClick={() => open('chat')}>
              <Icon name="chat" size={18} /> Chat with an Expert
            </button>
          </div>

          <ul className="pdp__assure">
            <li>
              <Icon name="truck" size={20} /> Complimentary shipping
            </li>
            <li>
              <Icon name="refresh" size={20} /> 15-day returns
            </li>
            <li>
              <Icon name="shield" size={20} /> Lifetime warranty
            </li>
          </ul>

          <div className="pdp__accs">
            <Accordion title="Product Details" defaultOpen>
              {product.description && <p style={{ marginBottom: 14 }}>{product.description}</p>}
              <ProductSpecifications product={product} selectedMetal={metal} />
            </Accordion>
            <Accordion title="Shipping & Returns">
              <p>Complimentary insured shipping on all orders. Returns accepted within 15 days in original condition.</p>
            </Accordion>
            <Accordion title="Warranty & Care">
              <p>Every piece is covered by our lifetime manufacturing warranty. Clean gently with warm water and a soft brush.</p>
            </Accordion>
          </div>
        </div>
      </div>

      {related && related.length > 0 && (
        <section className="pdp__related">
          <h2 className="section-head">You May Also Like</h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
