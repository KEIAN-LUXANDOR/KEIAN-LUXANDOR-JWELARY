import Icon, { type IconName } from './Icon';

interface StatCardProps {
  label: string;
  value: string;
  icon: IconName;
  /** Change vs the previous period, in percent. */
  change?: number | null;
  hint?: string;
}

/** One number on the dashboard: revenue, orders, customers … */
export default function StatCard({ label, value, icon, change, hint }: StatCardProps) {
  return (
    <div className="stat">
      <div className="stat__icon">
        <Icon name={icon} size={20} />
      </div>
      <div>
        <p className="stat__label">{label}</p>
        <p className="stat__value">{value}</p>
        {change != null && (
          <p className={`stat__change ${change >= 0 ? 'is-up' : 'is-down'}`}>
            {change >= 0 ? '▲' : '▼'} {Math.abs(change).toFixed(1)}% <span className="muted">{hint ?? 'vs previous 30 days'}</span>
          </p>
        )}
        {change == null && hint && <p className="stat__change muted">{hint}</p>}
      </div>
    </div>
  );
}
