import Icon, { type IconName } from './Icon';
import type { ReactNode } from 'react';

export default function EmptyState({ icon = 'box', title, text, action }: { icon?: IconName; title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="empty">
      <Icon name={icon} size={28} />
      <p className="empty__title">{title}</p>
      {text && <p className="muted">{text}</p>}
      {action}
    </div>
  );
}
