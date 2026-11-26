// Payments. Backend: GET /api/admin/payments, POST /api/admin/payments/{id}/refund
import { api, useBackend } from '@/services/apiClient';
import { createResource } from '@/services/createResource';
import { orderService, changeOrderStatus } from '@/features/orders/services/orderService';
import type { Payment } from '@/types/models';

export const paymentService = createResource<Payment>('payments', '/admin/payments', 'pay');

/** Refunds a captured payment and marks its order as refunded. */
export async function refundPayment(payment: Payment): Promise<Payment> {
  if (useBackend) return api.post<Payment>(`/admin/payments/${encodeURIComponent(payment.id)}/refund`, {});
  const refunded = await paymentService.update(payment.id, { status: 'Refunded' });
  const order = await orderService.get(payment.orderId);
  if (order && order.status !== 'Refunded') await changeOrderStatus(order, 'Refunded', 'Refunded from Payments');
  return refunded;
}
