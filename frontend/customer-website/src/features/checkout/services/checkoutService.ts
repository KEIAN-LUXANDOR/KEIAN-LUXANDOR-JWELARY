// Places an order: create it, then start payment.
// Keeps the order + payment steps in one place so the form stays simple.
import { createOrder, recordPayment } from '@/features/orders/services/orderService';
import { processPayment } from '@/features/payments/services/paymentService';
import type { CartItem } from '@/features/cart/types/cartTypes';
import type { Order } from '@/features/orders/types/orderTypes';
import type { CheckoutValues } from '../types/checkoutTypes';

export async function placeOrder(values: CheckoutValues, items: CartItem[], customerId: string | null): Promise<Order> {
  const order = await createOrder({
    email: values.email.trim(),
    customerId,
    items,
    shippingAddress: values.address,
    paymentMethod: values.paymentMethod,
  });
  const payment = await processPayment(order.id, values.paymentMethod, order.total);
  return (await recordPayment(order.id, payment)) ?? order;
}
