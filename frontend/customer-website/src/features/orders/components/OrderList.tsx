'use client';

import Link from 'next/link';
import { useAuth } from '@/features/authentication/hooks/useAuth';
import { formatPrice } from '@/utils/formatPrice';
import { useCustomerOrders } from '../hooks/useOrders';
import OrderItems from './OrderItems';
import './orders.css';

const formatDate = (iso: string) => new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

/** Order history for the signed-in customer. */
export default function OrderList() {
  const { customer } = useAuth();
  const { orders, loading } = useCustomerOrders(customer?.id ?? null, customer?.email ?? null);

  return (
    <div className="account-panel">
      <h2>Order History</h2>
      {!loading && orders.length === 0 && (
        <div className="empty-state">
          <p className="muted">You haven’t placed any orders yet.</p>
          <Link href="/" className="btn btn--outline">
            Start Shopping
          </Link>
        </div>
      )}
      <ul className="order-list">
        {orders.map((o) => (
          <li key={o.id} className="order-card">
            <div className="order-card__head">
              <div>
                <p className="eyebrow muted">Order</p>
                <p className="serif order-card__id">#{o.id}</p>
              </div>
              <div>
                <p className="eyebrow muted">Placed</p>
                <p>{formatDate(o.createdAt)}</p>
              </div>
              <div>
                <p className="eyebrow muted">Total</p>
                <p>{formatPrice(o.total)}</p>
              </div>
              <span className="order-card__status">{o.status}</span>
            </div>
            <OrderItems items={o.items} />
          </li>
        ))}
      </ul>
    </div>
  );
}
