import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="auth">
      <div className="auth-card auth-card--center">
        <p className="muted">404</p>
        <h1 className="auth-card__title">Page not found</h1>
        <Link href="/dashboard" className="btn btn--primary">
          Go to dashboard
        </Link>
      </div>
    </main>
  );
}
