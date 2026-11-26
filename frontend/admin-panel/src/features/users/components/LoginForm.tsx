'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';
import Button from '@/components/buttons/Button';
import { TextField } from '@/components/forms/Field';
import { mockDb } from '@/lib/mock/db';
import { useBackend } from '@/services/apiClient';
import { isBlank, isEmail } from '@/utils/validation';
import { useAuth } from '../hooks/useAuth';
import { DEMO_EMAIL, DEMO_PASSWORD } from '../services/authService';

/** Only allow going back to a page inside the admin panel after signing in. */
const safeNext = (next: string | null) => (next && next.startsWith('/') && !next.startsWith('//') ? next : '/dashboard');

export default function LoginForm({ next }: { next: string | null }) {
  const { user, ready, login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const [busy, setBusy] = useState(false);

  // Already signed in → go straight in.
  useEffect(() => {
    if (ready && user) router.replace(safeNext(next));
  }, [ready, user, router, next]);

  const signIn = async (signInEmail: string, signInPassword: string) => {
    setBusy(true);
    try {
      await login(signInEmail, signInPassword);
      router.replace(safeNext(next));
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : 'Sign in failed' });
      setBusy(false);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const errs: typeof errors = {};
    if (!isEmail(email)) errs.email = 'Enter a valid email';
    if (isBlank(password)) errs.password = 'Enter your password';
    setErrors(errs);
    if (errs.email || errs.password) return;
    void signIn(email, password);
  };

  /** Demo mode: fill in the demo login and sign in, so nothing can be mistyped. */
  const signInWithDemo = () => {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    setErrors({});
    void signIn(DEMO_EMAIL, DEMO_PASSWORD);
  };

  /** Demo mode: put the original sample data back (e.g. if the demo admin was edited or switched off). */
  const resetDemo = () => {
    mockDb.reset();
    signInWithDemo();
  };

  return (
    <form className="auth-card__form" onSubmit={onSubmit} noValidate>
      {errors.form && (
        <p className="alert alert--error" role="alert">
          {errors.form}
        </p>
      )}
      <TextField id="email" label="Email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} full />
      <TextField id="password" label="Password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} full />
      <div className="auth-card__row">
        <Link href="/forgot-password" className="link">
          Forgot password?
        </Link>
      </div>
      <Button type="submit" block loading={busy}>
        Sign in
      </Button>
      {!useBackend && (
        <div className="alert alert--info">
          <p>
            Demo mode — sign in with <strong>{DEMO_EMAIL}</strong> and password <strong>{DEMO_PASSWORD}</strong>.
          </p>
          <div className="auth-card__demo-actions">
            <Button type="button" variant="secondary" size="sm" onClick={signInWithDemo} disabled={busy}>
              Use demo login
            </Button>
            {errors.form && (
              <button type="button" className="link" onClick={resetDemo} disabled={busy}>
                Still not working? Reset demo data
              </button>
            )}
          </div>
        </div>
      )}
    </form>
  );
}
