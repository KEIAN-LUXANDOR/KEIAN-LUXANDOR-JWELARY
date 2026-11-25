import type { CartItem } from '@/features/cart/types/cartTypes';
import type { AddressInput } from '@/features/customer-profile/types/profileTypes';
import type { PaymentMethodId, PaymentResult } from '@/features/payments/types/paymentTypes';

export type OrderStatus = 'Awaiting Payment' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  createdAt: string; // ISO date
  status: OrderStatus;
  email: string;
  customerId: string | null;
  items: CartItem[];
  shippingAddress: AddressInput;
  paymentMethod: PaymentMethodId;
  payment?: PaymentResult;
  subtotal: number;
  shipping: number;
  total: number;
}

export interface NewOrder {
  email: string;
  customerId: string | null;
  items: CartItem[];
  shippingAddress: AddressInput;
  paymentMethod: PaymentMethodId;
}
