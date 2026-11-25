'use client';

import { useState, type FormEvent } from 'react';
import { TextField } from '@/components/common/FormField';
import { useUI } from '@/lib/providers/UIProvider';
import { useAuth } from '@/features/authentication/hooks/useAuth';
import type { Customer } from '@/features/authentication/types/authTypes';
import { hasErrors, type FormErrors } from '@/utils/validation';
import { updateProfile } from '../services/profileService';
import type { ProfileInput } from '../types/profileTypes';
import { validateProfile } from '../utils/profileValidation';
import './account.css';

function ProfileFormInner({ customer }: { customer: Customer }) {
  const { updateCustomer } = useAuth();
  const { showToast } = useUI();
  const [values, setValues] = useState<ProfileInput>({ firstName: customer.firstName, lastName: customer.lastName, phone: customer.phone ?? '' });
  const [errors, setErrors] = useState<FormErrors<ProfileInput>>({});
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validateProfile(values);
    setErrors(errs);
    if (hasErrors(errs)) return;
    setBusy(true);
    try {
      updateCustomer(await updateProfile(customer, values));
      showToast('Profile updated');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="form-grid" onSubmit={onSubmit} noValidate>
      <TextField id="pf-first" label="First Name" autoComplete="given-name" value={values.firstName} error={errors.firstName} onChange={(e) => setValues({ ...values, firstName: e.target.value })} />
      <TextField id="pf-last" label="Last Name" autoComplete="family-name" value={values.lastName} error={errors.lastName} onChange={(e) => setValues({ ...values, lastName: e.target.value })} />
      <TextField id="pf-email" label="Email" type="email" value={customer.email} readOnly full />
      <TextField id="pf-phone" label="Phone" type="tel" autoComplete="tel" full value={values.phone} error={errors.phone} onChange={(e) => setValues({ ...values, phone: e.target.value })} />
      <div className="form-actions field--full">
        <button className="btn" type="submit" disabled={busy}>
          {busy ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}

/** Name and phone for the signed-in customer. */
export default function ProfileForm() {
  const { customer } = useAuth();
  if (!customer) return null;
  return (
    <div className="account-panel">
      <h2>Personal Details</h2>
      <ProfileFormInner key={customer.id} customer={customer} />
    </div>
  );
}
