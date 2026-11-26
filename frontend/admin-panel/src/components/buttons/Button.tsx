import Link from 'next/link';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import Icon, { type IconName } from '@/components/common/Icon';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

const cls = (variant: ButtonVariant, size: 'sm' | 'md', block?: boolean, extra = '') =>
  ['btn', `btn--${variant}`, size === 'sm' && 'btn--sm', block && 'btn--block', extra].filter(Boolean).join(' ');

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'sm' | 'md';
  icon?: IconName;
  block?: boolean;
  loading?: boolean;
}

export default function Button({ variant = 'primary', size = 'md', icon, block, loading, className, children, disabled, type = 'button', ...rest }: ButtonProps) {
  return (
    <button type={type} className={cls(variant, size, block, className)} disabled={disabled || loading} aria-busy={loading || undefined} {...rest}>
      {loading ? <span className="spinner spinner--sm" aria-hidden="true" /> : icon && <Icon name={icon} size={16} />}
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className,
}: {
  href: string;
  variant?: ButtonVariant;
  size?: 'sm' | 'md';
  icon?: IconName;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link href={href} className={cls(variant, size, false, className)}>
      {icon && <Icon name={icon} size={16} />}
      {children}
    </Link>
  );
}
