import { formatPrice } from '@/utils/formatPrice';
import OrderItems from '@/features/orders/components/OrderItems';
import type { CartItem } from '@/features/cart/types/cartTypes';

export default function CheckoutSummary({ items, subtotal }: { items: CartItem[]; subtotal: number }) {
  return (
    <aside className="checkout__summary">
      <h2>Order Summary</h2>
      <OrderItems items={items} />
      <dl>
        <dt>Subtotal</dt>
        <dd>{formatPrice(subtotal)}</dd>
        <dt>Shipping</dt>
        <dd>Complimentary</dd>
        <dt>Tax</dt>
        <dd>Calculated by your payment provider</dd>
      </dl>
      <p className="cart__total">
        <span>Total</span>
        <span>{formatPrice(subtotal)}</span>
      </p>
    </aside>
  );
}
