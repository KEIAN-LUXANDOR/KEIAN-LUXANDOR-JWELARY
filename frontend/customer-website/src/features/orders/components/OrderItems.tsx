import Link from 'next/link';
import Media from '@/components/common/Media';
import { formatPrice } from '@/utils/formatPrice';
import { productHref } from '@/features/products/utils/productHelpers';
import type { CartItem } from '@/features/cart/types/cartTypes';
import './orders.css';

/** Compact line-item list used in checkout summary, confirmation and order history. */
export default function OrderItems({ items }: { items: CartItem[] }) {
  return (
    <ul className="order-items">
      {items.map((item) => (
        <li key={`${item.product.id}|${item.product.metal}|${item.size ?? ''}`} className="order-items__row">
          <Link href={productHref(item.product)} className="order-items__thumb">
            <Media src={item.product.image} tone={item.product.tone} label={item.product.type} />
            <span className="order-items__qty">{item.qty}</span>
          </Link>
          <div>
            <Link href={productHref(item.product)} className="order-items__name">
              {item.product.name}
            </Link>
            <p className="muted">
              {item.product.metal}
              {item.size ? ` · Size ${item.size}` : ''}
            </p>
          </div>
          <p>{formatPrice(item.product.price * item.qty)}</p>
        </li>
      ))}
    </ul>
  );
}
