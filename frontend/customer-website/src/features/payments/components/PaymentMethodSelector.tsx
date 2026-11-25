import type { PaymentMethodId } from '../types/paymentTypes';
import { PAYMENT_METHODS } from '../services/paymentService';

export default function PaymentMethodSelector({ value, onChange }: { value: PaymentMethodId; onChange: (id: PaymentMethodId) => void }) {
  return (
    <fieldset className="pay-methods">
      <legend className="visually-hidden">Payment method</legend>
      {PAYMENT_METHODS.map((m) => (
        <label key={m.id} className={`pay-method ${value === m.id ? 'is-active' : ''}`}>
          <input type="radio" name="payment-method" value={m.id} checked={value === m.id} onChange={() => onChange(m.id)} />
          <span>
            <span className="pay-method__label">{m.label}</span>
            <span className="muted pay-method__desc">{m.description}</span>
          </span>
        </label>
      ))}
    </fieldset>
  );
}
