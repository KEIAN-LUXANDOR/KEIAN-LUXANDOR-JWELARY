import Link from 'next/link';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'solid' | 'outline' | 'light' | 'ghost-light';

const classes = (variant: Variant, block?: boolean, extra = '') =>
  ['btn', variant !== 'solid' && `btn--${variant}`, block && 'btn--block', extra].filter(Boolean).join(' ');

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  block?: boolean;
}

/** Standard button. Use <ButtonLink> when it navigates. */
export default function Button({ variant = 'solid', block, className, type = 'button', ...rest }: ButtonProps) {
  return <button type={type} className={classes(variant, block, className)} {...rest} />;
}

export function ButtonLink({
  href,
  variant = 'solid',
  block,
  className,
  children,
}: {
  href: string;
  variant?: Variant;
  block?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={classes(variant, block, className)}>
      {children}
    </Link>
  );
}
