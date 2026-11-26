import type { ReactNode } from 'react';
import Logo from './Logo';

/** Centred card used by the sign-in pages. */
export default function AuthCard({ title, text, children }: { title: string; text?: string; children: ReactNode }) {
  return (
    <main className="auth">
      <div className="auth-card">
        <div className="auth-card__logo">
          <Logo height={40} />
        </div>
        <h1 className="auth-card__title">{title}</h1>
        {text && <p className="muted auth-card__text">{text}</p>}
        {children}
      </div>
    </main>
  );
}
