'use client';

// Simple vertical bar chart in SVG (no chart library needed).
import useElementWidth from '@/hooks/useElementWidth';
export interface ChartPoint {
  label: string;
  value: number;
}

interface BarChartProps {
  data: ChartPoint[];
  title: string; // read by screen readers
  formatValue?: (value: number) => string;
  height?: number;
}

const niceMax = (max: number) => {
  if (max <= 0) return 1;
  const step = Math.pow(10, Math.floor(Math.log10(max)));
  return Math.ceil(max / step) * step;
};

export default function BarChart({ data, title, formatValue = String, height = 240 }: BarChartProps) {
  const [ref, W] = useElementWidth<HTMLElement>();
  const H = height;
  const pad = { top: 16, right: 8, bottom: 28, left: 56 };
  const max = niceMax(Math.max(0, ...data.map((d) => d.value)));
  const innerW = W - pad.left - pad.right;
  const innerH = H - pad.top - pad.bottom;
  const slot = innerW / Math.max(1, data.length);
  const barW = Math.min(36, slot * 0.6);
  const ticks = [0, 0.25, 0.5, 0.75, 1];

  return (
    <figure className="chart" ref={ref}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={title} width={W} height={H} className="chart__svg">
        {ticks.map((t) => {
          const y = pad.top + innerH * (1 - t);
          return (
            <g key={t}>
              <line x1={pad.left} x2={W - pad.right} y1={y} y2={y} className="chart__grid" />
              <text x={pad.left - 8} y={y + 4} textAnchor="end" className="chart__axis">
                {formatValue(max * t)}
              </text>
            </g>
          );
        })}
        {data.map((d, i) => {
          const h = (d.value / max) * innerH;
          const x = pad.left + slot * i + (slot - barW) / 2;
          return (
            <g key={d.label}>
              <rect x={x} y={pad.top + innerH - h} width={barW} height={Math.max(0, h)} className="chart__bar">
                <title>{`${d.label}: ${formatValue(d.value)}`}</title>
              </rect>
              <text x={x + barW / 2} y={H - 8} textAnchor="middle" className="chart__axis">
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </figure>
  );
}
