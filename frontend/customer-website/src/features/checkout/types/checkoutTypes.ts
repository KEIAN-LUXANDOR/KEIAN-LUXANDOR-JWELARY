import type { AddressInput } from '@/features/customer-profile/types/profileTypes';
import type { PaymentMethodId } from '@/features/payments/types/paymentTypes';

export interface CheckoutValues {
  email: string;
  address: AddressInput;
  paymentMethod: PaymentMethodId;
  acceptTerms: boolean;
}

export interface CheckoutErrors {
  email?: string;
  address: Partial<Record<keyof AddressInput, string>>;
  acceptTerms?: string;
}
