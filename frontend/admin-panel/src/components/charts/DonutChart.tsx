// Donut chart with a legend, for shares (e.g. sales by metal).
export interface DonutSlice {
  label: string;
  value: number;
  color: string;
}

export default function DonutChart({ data, title, formatValue = String }: { data: DonutSlice[]; title: string; formatValue?: (v: number) => string }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const R = 70;
  const C = 2 * Math.PI * R;
  let offset = 0;

  return (
    <figure className="chart donut">
      <svg viewBox="0 0 200 200" role="img" aria-label={title} className="donut__svg">
        <circle cx="100" cy="100" r={R} className="donut__track" />
        {total > 0 &&
          data.map((d) => {
            const len = (d.value / total) * C;
            const el = (
              <circle
                key={d.label}
                cx="100"
                cy="100"
                r={R}
                fill="none"
                stroke={d.color}
                strokeWidth="26"
                strokeDasharray={`${len} ${C - len}`}
                strokeDashoffset={-offset}
                transform="rotate(-90 100 100)"
              >
                <title>{`${d.label}: ${formatValue(d.value)}`}</title>
              </circle>
            );
            offset += len;
            return el;
          })}
        <text x="100" y="96" textAnchor="middle" className="donut__total">
          {formatValue(total)}
        </text>
        <text x="100" y="116" textAnchor="middle" className="donut__caption">
          total
        </text>
      </svg>
      <ul className="legend">
        {data.map((d) => (
          <li key={d.label}>
            <span className="legend__swatch" style={{ background: d.color }} aria-hidden="true" />
            <span className="legend__label">{d.label}</span>
            <span className="legend__value">
              {formatValue(d.value)} <span className="muted">({total ? Math.round((d.value / total) * 100) : 0}%)</span>
            </span>
          </li>
        ))}
      </ul>
    </figure>
  );
}
