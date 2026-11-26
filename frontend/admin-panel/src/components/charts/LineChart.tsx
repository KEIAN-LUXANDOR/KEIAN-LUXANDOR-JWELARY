'use client';

// Line + area chart for a trend over time (e.g. daily revenue).
import useElementWidth from '@/hooks/useElementWidth';
import type { ChartPoint } from './BarChart';

export default function LineChart({ data, title, formatValue = String, height = 220 }: { data: ChartPoint[]; title: string; formatValue?: (v: number) => string; height?: number }) {
  const [ref, W] = useElementWidth<HTMLElement>();
  const H = height;
  const pad = { top: 16, right: 12, bottom: 28, left: 56 };
  const max = Math.max(1, ...data.map((d) => d.value));
  const innerW = W - pad.left - pad.right;
  const innerH = H - pad.top - pad.bottom;
  const x = (i: number) => pad.left + (data.length <= 1 ? innerW / 2 : (innerW * i) / (data.length - 1));
  const y = (v: number) => pad.top + innerH * (1 - v / max);
  const line = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(d.value).toFixed(1)}`).join(' ');
  const area = data.length ? `${line} L${x(data.length - 1).toFixed(1)},${pad.top + innerH} L${x(0).toFixed(1)},${pad.top + innerH} Z` : '';
  const labelEvery = Math.ceil(data.length / 8);

  return (
    <figure className="chart" ref={ref}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={title} width={W} height={H} className="chart__svg">
        {[0, 0.5, 1].map((t) => (
          <g key={t}>
            <line x1={pad.left} x2={W - pad.right} y1={pad.top + innerH * (1 - t)} y2={pad.top + innerH * (1 - t)} className="chart__grid" />
            <text x={pad.left - 8} y={pad.top + innerH * (1 - t) + 4} textAnchor="end" className="chart__axis">
              {formatValue(max * t)}
            </text>
          </g>
        ))}
        <path d={area} className="chart__area" />
        <path d={line} className="chart__line" />
        {data.map((d, i) => (
          <g key={d.label}>
            <circle cx={x(i)} cy={y(d.value)} r="3" className="chart__dot">
              <title>{`${d.label}: ${formatValue(d.value)}`}</title>
            </circle>
            {i % labelEvery === 0 && (
              <text x={x(i)} y={H - 8} textAnchor="middle" className="chart__axis">
                {d.label}
              </text>
            )}
          </g>
        ))}
      </svg>
    </figure>
  );
}
