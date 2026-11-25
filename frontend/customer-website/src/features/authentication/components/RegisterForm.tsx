'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { TextField } from '@/components/common/FormField';
import { hasErrors, type FormErrors } from '@/utils/validation';
import { useAuth } from '../hooks/useAuth';
import type { RegisterInput } from '../types/authTypes';
import { MIN_PASSWORD, safeNext, validateRegister } from '../utils/authValidation';
import './auth.css';

type Values = RegisterInput & { confirm: string };

export default function RegisterForm({ next }: { next?: string }) {
  const { register } = useAuth();
  const router = useRouter();
  const [values, setValues] = useState<Values>({ firstName: '', lastName: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState<FormErrors<Values>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const set = (name: keyof Values) => (e: React.ChangeEvent<HTMLInputElement>) => setValues({ ...values, [name]: e.target.value });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validateRegister(values);
    setErrors(errs);
    setFormError(null);
    if (hasErrors(errs)) return;
    setBusy(true);
    try {
      const { confirm: _confirm, ...input } = values;
      void _confirm;
      await register(input);
      router.push(safeNext(next));
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={onSubmit} noValidate>
      {formError && (
        <p className="form-alert" role="alert">
          {formError}
        </p>
      )}
      <TextField id="reg-first" label="First Name" autoComplete="given-name" value={values.firstName} error={errors.firstName} onChange={set('firstName')} />
      <TextField id="reg-last" label="Last Name" autoComplete="family-name" value={values.lastName} error={errors.lastName} onChange={set('lastName')} />
      <TextField id="reg-email" label="Email" type="email" autoComplete="email" full value={values.email} error={errors.email} onChange={set('email')} />
      <TextField
        id="reg-password"
        label={`Password (min. ${MIN_PASSWORD} characters)`}
        type="password"
        autoComplete="new-password"
        value={values.password}
        error={errors.password}
        onChange={set('password')}
      />
      <TextField id="reg-confirm" label="Confirm Password" type="password" autoComplete="new-password" value={values.confirm} error={errors.confirm} onChange={set('confirm')} />
      <button className="btn btn--block field--full" type="submit" disabled={busy}>
        {busy ? 'Creating account…' : 'Create Account'}
      </button>
      <p className="auth-form__switch field--full muted">
        Already have an account?{' '}
        <Link href={next ? `/login?next=${encodeURIComponent(next)}` : '/login'} className="link-underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
