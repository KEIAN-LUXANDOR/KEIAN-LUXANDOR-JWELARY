'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import Button from '@/components/buttons/Button';
import { TextField } from '@/components/forms/Field';
import { isEmail } from '@/utils/validation';
import { requestPasswordReset } from '../services/authService';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isEmail(email)) return setError('Enter a valid email');
    setError(undefined);
    setBusy(true);
    try {
      await requestPasswordReset(email);
      setSent(true);
    } finally {
      setBusy(false);
    }
  };

  if (sent) {
    return (
      <div className="auth-card__form">
        <p className="alert alert--success" role="status">
          If an admin account exists for <strong>{email}</strong>, we’ve sent a link to reset the password. It works for 30 minutes.
        </p>
        <Link href="/login" className="btn btn--secondary btn--block">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form className="auth-card__form" onSubmit={onSubmit} noValidate>
      <TextField id="email" label="Email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} error={error} full />
      <Button type="submit" block loading={busy}>
        Send reset link
      </Button>
      <Link href="/login" className="link auth-card__center">
        Back to sign in
      </Link>
    </form>
  );
}
