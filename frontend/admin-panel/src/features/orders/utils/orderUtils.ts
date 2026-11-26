import type { OrderStatus } from '@/types/models';

/** Which statuses an order can move to next. */
export const NEXT_STATUSES: Record<OrderStatus, OrderStatus[]> = {
  Pending: ['Processing', 'Cancelled'],
  Processing: ['Shipped', 'Cancelled'],
  Shipped: ['Delivered'],
  Delivered: ['Refunded'],
  Cancelled: [],
  Refunded: [],
};

export const itemCount = (items: { qty: number }[]) => items.reduce((s, i) => s + i.qty, 0);
