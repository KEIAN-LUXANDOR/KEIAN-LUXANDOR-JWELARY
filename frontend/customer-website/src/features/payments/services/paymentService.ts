// ─────────────────────────────────────────────────────────────
// Payments. Card details are NEVER collected by this website:
// the Spring Boot backend should create a payment session with the
// payment provider (Stripe, Razorpay, PayPal, …) and the customer pays
// on the provider's secure page / widget.
//
//   POST /api/payments/session { orderId, method, amount } → PaymentResult
//
// Without a backend, payment is simulated so the checkout flow can be tested.
// ─────────────────────────────────────────────────────────────
import { apiPost, isApiEnabled } from '@/services/apiClient';
import { createId } from '@/utils/text';
import type { PaymentMethod, PaymentMethodId, PaymentResult } from '../types/paymentTypes';

export const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'card', label: 'Credit / Debit Card', description: 'You’ll enter card details securely with our payment provider.' },
  { id: 'paypal', label: 'PayPal', description: 'You’ll be redirected to PayPal to complete your purchase.' },
  { id: 'bank-transfer', label: 'Bank Transfer', description: 'We’ll email transfer details. Your order ships once payment is received.' },
];

export async function processPayment(orderId: string, method: PaymentMethodId, amount: number): Promise<PaymentResult> {
  if (isApiEnabled) return apiPost<PaymentResult>('/payments/session', { orderId, method, amount });
  return { status: method === 'bank-transfer' ? 'pending' : 'authorized', reference: createId('PAY') };
}
