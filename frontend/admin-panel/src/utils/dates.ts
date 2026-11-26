// Date-range helpers for reports and the dashboard.
export const DAY = 24 * 60 * 60 * 1000;

export const daysAgo = (days: number, from = new Date()): Date => new Date(from.getTime() - days * DAY);

export const isWithin = (iso: string, from: Date, to = new Date()): boolean => {
  const t = new Date(iso).getTime();
  return t >= from.getTime() && t <= to.getTime();
};

/** The last `count` months as { key: "2026-11", label: "Nov" }, oldest first. */
export const lastMonths = (count: number, now = new Date()): { key: string; label: string }[] =>
  Array.from({ length: count }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (count - 1 - i), 1);
    return { key: monthKey(d.toISOString()), label: d.toLocaleString('en-US', { month: 'short' }) };
  });

export const monthKey = (iso: string): string => {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};
