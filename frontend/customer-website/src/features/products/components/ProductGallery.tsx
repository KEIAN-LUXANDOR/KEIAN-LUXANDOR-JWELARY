import ImageGallery, { type GalleryItem } from '@/components/product-gallery/ImageGallery';
import type { Product } from '../types/productTypes';

/** Product photos. Shows four placeholder views until the product has real photos. */
export default function ProductGallery({ product }: { product: Product }) {
  const photos = product.images && product.images.length > 0 ? product.images : ['', '', '', ''];
  const items: GalleryItem[] = photos.map((src, i) => ({
    id: `${i}-${src}`,
    src: src || undefined,
    label: `View photo ${i + 1}`,
    placeholderLabel: i === 3 && !src ? 'sparkle' : product.type,
  }));

  return (
    <ImageGallery
      items={items}
      tone={product.tone}
      alt={product.name}
      overlay={product.badge ? <span className="pcard__badge">{product.badge}</span> : null}
    />
  );
}
