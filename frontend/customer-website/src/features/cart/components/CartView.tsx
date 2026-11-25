'use client';

import Link from 'next/link';
import Media from '@/components/common/Media';
import Icon from '@/components/common/Icon';
import { formatPrice } from '@/utils/formatPrice';
import { productHref } from '@/features/products/utils/productHelpers';
import { useCart } from '../hooks/useCart';
import { itemKey } from '../utils/cartHelpers';

/** Bag contents with quantity controls and the order summary. */
export default function CartView() {
  const { cart, cartTotal, setQty, removeFromCart, ready } = useCart();

  if (!ready) return <section className="section container" aria-busy="true" />;

  if (cart.length === 0) {
    return (
      <section className="section container empty-state">
        <p className="serif">Your bag is empty.</p>
        <Link href="/collections/fine-jewelry" className="btn">
          Continue Shopping
        </Link>
      </section>
    );
  }

  return (
    <section className="section container cart">
      <ul className="cart__items">
        {cart.map((item, idx) => (
          <li key={itemKey(item)} className="cart__item">
            <Link href={productHref(item.product)}>
              <Media src={item.product.image} tone={item.product.tone} label={item.product.type} />
            </Link>
            <div className="cart__details">
              <Link href={productHref(item.product)} className="cart__name">
                {item.product.name}
              </Link>
              <p className="muted">
                {item.product.metal}
                {item.size ? ` · Size ${item.size}` : ''}
              </p>
              <div className="qty">
                <button onClick={() => setQty(idx, item.qty - 1)} aria-label="Decrease quantity">
                  <Icon name="minus" size={14} />
                </button>
                <span>{item.qty}</span>
                <button onClick={() => setQty(idx, item.qty + 1)} aria-label="Increase quantity">
                  <Icon name="plus" size={14} />
                </button>
              </div>
            </div>
            <div className="cart__right">
              <p>{formatPrice(item.product.price * item.qty)}</p>
              <button className="link-underline" onClick={() => removeFromCart(idx)}>
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      <aside className="cart__summary">
        <h2>Order Summary</h2>
        <dl>
          <dt>Subtotal</dt>
          <dd>{formatPrice(cartTotal)}</dd>
          <dt>Shipping</dt>
          <dd>Complimentary</dd>
          <dt>Estimated Tax</dt>
          <dd>Calculated at checkout</dd>
        </dl>
        <p className="cart__total">
          <span>Total</span>
          <span>{formatPrice(cartTotal)}</span>
        </p>
        <Link href="/checkout" className="btn btn--block">
          Proceed to Checkout
        </Link>
        <Link href="/collections/fine-jewelry" className="link-underline">
          Continue Shopping
        </Link>
      </aside>
    </section>
  );
}
