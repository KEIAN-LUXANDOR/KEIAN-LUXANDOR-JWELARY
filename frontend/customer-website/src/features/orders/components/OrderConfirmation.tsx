'use client';

import Link from 'next/link';
import { formatPrice } from '@/utils/formatPrice';
import { formatAddress } from '@/features/customer-profile/utils/profileValidation';
import { PAYMENT_METHODS } from '@/features/payments/services/paymentService';
import { useOrder } from '../hooks/useOrders';
import OrderItems from './OrderItems';
import './orders.css';

export default function OrderConfirmation({ orderId }: { orderId: string | null }) {
  const { order, loading } = useOrder(orderId);

  if (loading) return <section className="section container" aria-busy="true" />;

  if (!order) {
    return (
      <section className="section container empty-state">
        <p className="serif">We couldn’t find that order.</p>
        <Link href="/" className="btn">
          Back to Home
        </Link>
      </section>
    );
  }

  const method = PAYMENT_METHODS.find((m) => m.id === order.paymentMethod);

  return (
    <section className="section container confirm">
      <div className="confirm__head">
        <p className="eyebrow muted">Order #{order.id}</p>
        <h2>Thank you for your order</h2>
        <p className="muted">
          A confirmation has been sent to <strong>{order.email}</strong>.
          {order.status === 'Awaiting Payment' && ' Your order will be prepared once payment is received.'}
        </p>
      </div>

      <div className="confirm__grid">
        <div>
          <h3 className="confirm__title">Items</h3>
          <OrderItems items={order.items} />
          <dl className="confirm__totals">
            <dt>Subtotal</dt>
            <dd>{formatPrice(order.subtotal)}</dd>
            <dt>Shipping</dt>
            <dd>{order.shipping === 0 ? 'Complimentary' : formatPrice(order.shipping)}</dd>
            <dt>Total</dt>
            <dd>{formatPrice(order.total)}</dd>
          </dl>
        </div>
        <aside className="confirm__aside">
          <h3 className="confirm__title">Shipping to</h3>
          <p>
            {order.shippingAddress.firstName} {order.shippingAddress.lastName}
          </p>
          <p className="muted">{formatAddress(order.shippingAddress)}</p>
          <h3 className="confirm__title">Payment</h3>
          <p>{method?.label ?? order.paymentMethod}</p>
          <p className="muted">Status: {order.status}</p>
          <Link href="/" className="btn btn--outline btn--block">
            Continue Shopping
          </Link>
        </aside>
      </div>
    </section>
  );
}
