'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { TextField } from '@/components/common/FormField';
import { useCart } from '@/features/cart/hooks/useCart';
import { useAuth } from '@/features/authentication/hooks/useAuth';
import type { Customer } from '@/features/authentication/types/authTypes';
import useAddresses from '@/features/customer-profile/hooks/useAddresses';
import AddressFields from '@/features/customer-profile/components/AddressFields';
import type { Address } from '@/features/customer-profile/types/profileTypes';
import { EMPTY_ADDRESS } from '@/features/customer-profile/utils/profileValidation';
import PaymentMethodSelector from '@/features/payments/components/PaymentMethodSelector';
import type { CheckoutErrors, CheckoutValues } from '../types/checkoutTypes';
import { isCheckoutValid, validateCheckout } from '../utils/checkoutValidation';
import { placeOrder } from '../services/checkoutService';
import CheckoutSummary from './CheckoutSummary';
import './checkout.css';

const initialValues = (customer: Customer | null, saved: Address | null): CheckoutValues => {
  const address = saved
    ? { firstName: saved.firstName, lastName: saved.lastName, line1: saved.line1, line2: saved.line2, city: saved.city, state: saved.state, zip: saved.zip, country: saved.country, phone: saved.phone }
    : { ...EMPTY_ADDRESS, firstName: customer?.firstName ?? '', lastName: customer?.lastName ?? '', phone: customer?.phone ?? '' };
  return { email: customer?.email ?? '', address, paymentMethod: 'card', acceptTerms: false };
};

function CheckoutFormInner({ customer, savedAddress, onPlaced }: { customer: Customer | null; savedAddress: Address | null; onPlaced: () => void }) {
  const { cart, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const [values, setValues] = useState<CheckoutValues>(() => initialValues(customer, savedAddress));
  const [errors, setErrors] = useState<CheckoutErrors>({ address: {} });
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validateCheckout(values);
    setErrors(errs);
    setFormError(null);
    if (!isCheckoutValid(errs)) return;
    setBusy(true);
    try {
      const order = await placeOrder(values, cart, customer?.id ?? null);
      onPlaced();
      clearCart();
      router.push(`/order-confirmation?order=${encodeURIComponent(order.id)}`);
    } catch {
      setFormError('We couldn’t place your order. Please try again.');
      setBusy(false);
    }
  };

  return (
    <div className="checkout">
      <form className="checkout__form" onSubmit={onSubmit} noValidate>
        {formError && (
          <p className="form-alert" role="alert">
            {formError}
          </p>
        )}

        <section className="checkout__step">
          <div className="checkout__step-head">
            <h2>1. Contact</h2>
            {!customer && (
              <Link href="/login?next=/checkout" className="link-underline">
                Sign in
              </Link>
            )}
          </div>
          <div className="form-grid">
            <TextField id="co-email" label="Email" type="email" autoComplete="email" full value={values.email} error={errors.email} onChange={(e) => setValues({ ...values, email: e.target.value })} />
          </div>
        </section>

        <section className="checkout__step">
          <h2>2. Shipping Address</h2>
          <div className="form-grid">
            <AddressFields idPrefix="co" values={values.address} errors={errors.address} onChange={(address) => setValues({ ...values, address })} />
          </div>
        </section>

        <section className="checkout__step">
          <h2>3. Payment</h2>
          <PaymentMethodSelector value={values.paymentMethod} onChange={(paymentMethod) => setValues({ ...values, paymentMethod })} />
        </section>

        <label className="check checkout__terms">
          <input type="checkbox" checked={values.acceptTerms} onChange={(e) => setValues({ ...values, acceptTerms: e.target.checked })} />
          <span>
            I agree to the <Link href="/shop-with-confidence">terms of sale</Link> and <Link href="/privacy-policy">privacy policy</Link>.
          </span>
        </label>
        {errors.acceptTerms && <p className="field-error">{errors.acceptTerms}</p>}

        <button className="btn btn--block" type="submit" disabled={busy}>
          {busy ? 'Placing order…' : 'Place Order'}
        </button>
      </form>

      <CheckoutSummary items={cart} subtotal={cartTotal} />
    </div>
  );
}

/** Contact, shipping, payment and order summary. Pre-fills details for signed-in customers. */
export default function CheckoutForm() {
  const { cart, ready: cartReady } = useCart();
  const { customer, ready: authReady } = useAuth();
  const { defaultAddress, ready: addressesReady } = useAddresses(customer?.id ?? null);
  const [placed, setPlaced] = useState(false);

  const ready = cartReady && authReady && (!customer || addressesReady);
  if (!ready || placed) return <section className="section container" aria-busy="true" />;

  if (cart.length === 0) {
    return (
      <section className="section container empty-state">
        <p className="serif">Your bag is empty.</p>
        <Link href="/collections/fine-jewelry" className="btn">
          Continue Shopping
        </Link>
      </section>
    );
  }

  return (
    <section className="section container">
      <CheckoutFormInner key={customer?.id ?? 'guest'} customer={customer} savedAddress={defaultAddress} onPlaced={() => setPlaced(true)} />
    </section>
  );
}
