'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { TextField } from '@/components/common/FormField';
import { hasErrors, type FormErrors } from '@/utils/validation';
import { useAuth } from '../hooks/useAuth';
import type { LoginInput } from '../types/authTypes';
import { safeNext, validateLogin } from '../utils/authValidation';
import './auth.css';

export default function LoginForm({ next }: { next?: string }) {
  const { login } = useAuth();
  const router = useRouter();
  const [values, setValues] = useState<LoginInput>({ email: '', password: '' });
  const [errors, setErrors] = useState<FormErrors<LoginInput>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validateLogin(values);
    setErrors(errs);
    setFormError(null);
    if (hasErrors(errs)) return;
    setBusy(true);
    try {
      await login(values);
      router.push(safeNext(next));
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Sign in failed. Please try again.');
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
      <TextField id="login-email" label="Email" type="email" autoComplete="email" full value={values.email} error={errors.email} onChange={(e) => setValues({ ...values, email: e.target.value })} />
      <TextField
        id="login-password"
        label="Password"
        type="password"
        autoComplete="current-password"
        full
        value={values.password}
        error={errors.password}
        onChange={(e) => setValues({ ...values, password: e.target.value })}
      />
      <button className="btn btn--block field--full" type="submit" disabled={busy}>
        {busy ? 'Signing in…' : 'Sign In'}
      </button>
      <p className="auth-form__switch field--full muted">
        New to Keian Luxandor?{' '}
        <Link href={next ? `/register?next=${encodeURIComponent(next)}` : '/register'} className="link-underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}
