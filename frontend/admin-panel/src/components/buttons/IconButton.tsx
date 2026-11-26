import type { ButtonHTMLAttributes } from 'react';
import Icon, { type IconName } from '@/components/common/Icon';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconName;
  label: string; // read by screen readers and shown as a tooltip
  tone?: 'default' | 'danger';
}

export default function IconButton({ icon, label, tone = 'default', className = '', type = 'button', ...rest }: IconButtonProps) {
  return (
    <button type={type} className={`icon-btn ${tone === 'danger' ? 'icon-btn--danger' : ''} ${className}`} aria-label={label} title={label} {...rest}>
      <Icon name={icon} size={16} />
    </button>
  );
}
