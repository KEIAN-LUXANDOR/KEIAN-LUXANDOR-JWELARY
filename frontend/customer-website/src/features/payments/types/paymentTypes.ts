export type PaymentMethodId = 'card' | 'paypal' | 'bank-transfer';

export interface PaymentMethod {
  id: PaymentMethodId;
  label: string;
  description: string;
}

export interface PaymentResult {
  status: 'authorized' | 'pending';
  reference: string;
}
