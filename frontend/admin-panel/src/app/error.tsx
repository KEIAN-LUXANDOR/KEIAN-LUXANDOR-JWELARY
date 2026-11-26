'use client';

import { useEffect } from 'react';

// Shown when a page crashes, instead of a blank screen.
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="auth">
      <div className="auth-card auth-card--center">
        <h1 className="auth-card__title">Something went wrong</h1>
        <p className="muted">{error.message || 'An unexpected error happened.'}</p>
        <button type="button" className="btn btn--primary" onClick={reset}>
          Try again
        </button>
      </div>
    </main>
  );
}
