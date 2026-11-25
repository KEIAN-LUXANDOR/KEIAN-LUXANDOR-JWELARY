import { isEmail } from '@/utils/validation';
import { validateAddress } from '@/features/customer-profile/utils/profileValidation';
import type { CheckoutErrors, CheckoutValues } from '../types/checkoutTypes';

export const validateCheckout = (v: CheckoutValues): CheckoutErrors => {
  const errors: CheckoutErrors = { address: validateAddress(v.address) };
  if (!isEmail(v.email)) errors.email = 'Enter a valid email';
  if (!v.acceptTerms) errors.acceptTerms = 'Please accept the terms to continue';
  return errors;
};

export const isCheckoutValid = (e: CheckoutErrors): boolean => !e.email && !e.acceptTerms && Object.keys(e.address).length === 0;
