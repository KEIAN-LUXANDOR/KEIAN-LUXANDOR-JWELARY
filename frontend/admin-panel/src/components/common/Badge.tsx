import type { ReactNode } from 'react';

export type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'gold';

export default function Badge({ tone = 'neutral', children }: { tone?: BadgeTone; children: ReactNode }) {
  return <span className={`badge badge--${tone}`}>{children}</span>;
}

const STATUS_TONES: Record<string, BadgeTone> = {
  // orders
  Pending: 'warning',
  Processing: 'info',
  Shipped: 'gold',
  Delivered: 'success',
  Cancelled: 'neutral',
  Refunded: 'danger',
  // payments
  Captured: 'success',
  Failed: 'danger',
  // products & generic
  active: 'success',
  draft: 'warning',
  archived: 'neutral',
  blocked: 'danger',
  // reviews
  pending: 'warning',
  approved: 'success',
  hidden: 'neutral',
  // time-based
  Live: 'success',
  Scheduled: 'info',
  Ended: 'neutral',
  Inactive: 'neutral',
  'Used up': 'neutral',
  'Out of stock': 'danger',
  'Low stock': 'warning',
  'In stock': 'success',
};

/** Coloured label for a status word ("Delivered", "draft", "Low stock" …). */
export function StatusBadge({ status }: { status: string }) {
  return <Badge tone={STATUS_TONES[status] ?? 'neutral'}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
}
