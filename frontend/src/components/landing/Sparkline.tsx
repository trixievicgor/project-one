interface SparklineProps {
  points: number[];
  color: string;
}

export default function Sparkline({ points, color }: SparklineProps) {
  const w = 80, h = 32, pad = 2;
  const min = Math.min(...points), max = Math.max(...points);
  const xs = points.map((_, i) => pad + (i / (points.length - 1)) * (w - pad * 2));
  const ys = points.map(p => pad + (1 - (p - min) / (max - min || 1)) * (h - pad * 2));
  const poly = xs.map((x, i) => `${x},${ys[i]}`).join(" ");
  const area = `${poly} ${xs[xs.length - 1]},${h} ${xs[0]},${h}`;
  const uid = `g${points.join("")}`;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <defs>
        <linearGradient id={uid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#${uid})`} />
      <polyline points={poly} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}