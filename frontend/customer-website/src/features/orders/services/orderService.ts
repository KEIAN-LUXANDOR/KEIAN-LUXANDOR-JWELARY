// ─────────────────────────────────────────────────────────────
// Orders. Backend endpoints (used when NEXT_PUBLIC_CUSTOMER_API=true):
//   POST  /api/orders                 NewOrder → Order
//   PATCH /api/orders/{id}/payment    PaymentResult → Order
//   GET   /api/orders/{id}            → Order
//   GET   /api/customers/me/orders    → Order[]
// Without a backend, orders are kept in this browser's localStorage.
// ─────────────────────────────────────────────────────────────
import { apiGet, apiPost, apiPut, isApiEnabled } from '@/services/apiClient';
import { loadJSON, saveJSON } from '@/utils/storage';
import { createId } from '@/utils/text';
import { cartSubtotal } from '@/features/cart/utils/cartHelpers';
import type { PaymentResult } from '@/features/payments/types/paymentTypes';
import type { NewOrder, Order } from '../types/orderTypes';

const ORDERS_KEY = 'kl.orders';
const SHIPPING_COST = 0; // complimentary shipping

const loadOrders = () => loadJSON<Order[]>(ORDERS_KEY, []);

export async function createOrder(input: NewOrder): Promise<Order> {
  if (isApiEnabled) return apiPost<Order>('/orders', input);
  const subtotal = cartSubtotal(input.items);
  const order: Order = {
    ...input,
    id: createId('KL'),
    createdAt: new Date().toISOString(),
    status: 'Awaiting Payment',
    subtotal,
    shipping: SHIPPING_COST,
    total: subtotal + SHIPPING_COST,
  };
  saveJSON(ORDERS_KEY, [order, ...loadOrders()]);
  return order;
}

export async function recordPayment(orderId: string, payment: PaymentResult): Promise<Order | null> {
  if (isApiEnabled) return apiPut<Order>(`/orders/${encodeURIComponent(orderId)}/payment`, payment);
  let updated: Order | null = null;
  saveJSON(
    ORDERS_KEY,
    loadOrders().map((o) => {
      if (o.id !== orderId) return o;
      updated = { ...o, payment, status: payment.status === 'authorized' ? 'Processing' : 'Awaiting Payment' };
      return updated;
    }),
  );
  return updated;
}

export async function getOrder(id: string): Promise<Order | null> {
  if (isApiEnabled) return apiGet<Order>(`/orders/${encodeURIComponent(id)}`);
  return loadOrders().find((o) => o.id === id) ?? null;
}

export async function getCustomerOrders(customerId: string, email: string): Promise<Order[]> {
  if (isApiEnabled) return apiGet<Order[]>('/customers/me/orders');
  return loadOrders().filter((o) => o.customerId === customerId || o.email.toLowerCase() === email.toLowerCase());
}
