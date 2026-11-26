import type { Order } from '@/types/models';

export interface CustomerStats {
  orders: number;
  spent: number;
  lastOrderAt: string | null;
}

const COUNTED = (o: Order) => o.status !== 'Cancelled' && o.status !== 'Refunded';

/** Orders and money spent per customer id (cancelled and refunded orders don't count as spend). */
export const statsByCustomer = (orders: Order[]): Record<string, CustomerStats> => {
  const map: Record<string, CustomerStats> = {};
  for (const o of orders) {
    const s = (map[o.customerId] ??= { orders: 0, spent: 0, lastOrderAt: null });
    s.orders += 1;
    if (COUNTED(o)) s.spent += o.total;
    if (!s.lastOrderAt || o.createdAt > s.lastOrderAt) s.lastOrderAt = o.createdAt;
  }
  return map;
};
