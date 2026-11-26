// Orders. Backend: GET /api/admin/orders, GET/PUT /api/admin/orders/{id}
import { createResource } from '@/services/createResource';
import type { Order, OrderStatus } from '@/types/models';

export const orderService = createResource<Order>('orders', '/admin/orders', 'ord');

/** Moves an order to a new status and records it in the order's history. */
export async function changeOrderStatus(order: Order, status: OrderStatus, note: string, trackingNumber?: string): Promise<Order> {
  const event = { status, at: new Date().toISOString(), note: note.trim() || `Marked as ${status}` };
  return orderService.update(order.id, {
    status,
    trackingNumber: trackingNumber ?? order.trackingNumber,
    paymentStatus: status === 'Refunded' ? 'Refunded' : order.paymentStatus,
    timeline: [...order.timeline, event],
  });
}
