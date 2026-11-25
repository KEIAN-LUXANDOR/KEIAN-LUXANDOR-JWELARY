'use client';

import { useState, type FormEvent } from 'react';
import { useUI } from '@/lib/providers/UIProvider';
import { useAuth } from '@/features/authentication/hooks/useAuth';
import { hasErrors, type FormErrors } from '@/utils/validation';
import useAddresses from '../hooks/useAddresses';
import type { AddressInput } from '../types/profileTypes';
import { EMPTY_ADDRESS, formatAddress, validateAddress } from '../utils/profileValidation';
import AddressFields from './AddressFields';
import './account.css';

export default function AddressBook() {
  const { customer } = useAuth();
  const { showToast } = useUI();
  const { addresses, ready, addAddress, removeAddress, setDefault } = useAddresses(customer?.id ?? null);
  const [adding, setAdding] = useState(false);
  const [values, setValues] = useState<AddressInput>(EMPTY_ADDRESS);
  const [errors, setErrors] = useState<FormErrors<AddressInput>>({});

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validateAddress(values);
    setErrors(errs);
    if (hasErrors(errs)) return;
    await addAddress(values);
    setValues(EMPTY_ADDRESS);
    setAdding(false);
    showToast('Address saved');
  };

  return (
    <div className="account-panel">
      <h2>Saved Addresses</h2>
      {ready && addresses.length === 0 && !adding && <p className="muted">You haven’t saved any addresses yet.</p>}

      <ul className="address-list">
        {addresses.map((a) => (
          <li key={a.id} className="address-card">
            {a.isDefault && <span className="eyebrow address-card__default">Default</span>}
            <p className="serif address-card__name">
              {a.firstName} {a.lastName}
            </p>
            <p className="muted">{formatAddress(a)}</p>
            {a.phone && <p className="muted">{a.phone}</p>}
            <div className="address-card__actions">
              {!a.isDefault && (
                <button className="link-underline" onClick={() => setDefault(a.id)}>
                  Make default
                </button>
              )}
              <button className="link-underline" onClick={() => removeAddress(a.id)}>
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      {adding ? (
        <form className="form-grid" onSubmit={onSubmit} noValidate>
          <AddressFields idPrefix="addr" values={values} errors={errors} onChange={setValues} />
          <div className="form-actions field--full">
            <button className="btn" type="submit">
              Save Address
            </button>
            <button className="btn btn--outline" type="button" onClick={() => setAdding(false)}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button className="btn btn--outline" onClick={() => setAdding(true)}>
          Add New Address
        </button>
      )}
    </div>
  );
}
