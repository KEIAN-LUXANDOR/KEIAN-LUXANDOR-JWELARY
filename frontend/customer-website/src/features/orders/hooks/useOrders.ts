'use client';

import { useEffect, useState } from 'react';
import type { Order } from '../types/orderTypes';
import { getCustomerOrders, getOrder } from '../services/orderService';

export function useCustomerOrders(customerId: string | null, email: string | null) {
  const [state, setState] = useState<{ key: string | null; orders: Order[] }>({ key: null, orders: [] });
  const key = customerId && email ? `${customerId}|${email}` : null;

  useEffect(() => {
    if (!customerId || !email) return undefined;
    let cancelled = false;
    getCustomerOrders(customerId, email).then((orders) => !cancelled && setState({ key: `${customerId}|${email}`, orders }));
    return () => {
      cancelled = true;
    };
  }, [customerId, email]);

  return { orders: state.key === key ? state.orders : [], loading: key !== null && state.key !== key };
}

export function useOrder(orderId: string | null) {
  const [state, setState] = useState<{ id: string | null; order: Order | null }>({ id: null, order: null });

  useEffect(() => {
    if (!orderId) return undefined;
    let cancelled = false;
    getOrder(orderId).then((order) => !cancelled && setState({ id: orderId, order }));
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  return { order: state.id === orderId ? state.order : null, loading: orderId !== null && state.id !== orderId };
}
