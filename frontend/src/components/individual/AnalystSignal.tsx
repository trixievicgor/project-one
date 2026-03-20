// ─── Stub ─────────────────────────────────────────────────────────────────────
// Replace with real API call keyed on `symbol`
// signal: 0 = strong sell, 10 = strong buy

const STUB_SIGNAL: Record<string, { signal: number; analystCount: number; newsCount: number }> = {
  default: { signal: 8.2, analystCount: 41, newsCount: 14 },
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface AnalystSignalProps {
  symbol: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getSignalLabel(s: number): { text: string; colorClass: string; hexColor: string } {
  if (s <= 2) return { text: 'Strong Sell', colorClass: 'text-red-400',    hexColor: '#ef4444' };
  if (s <= 4) return { text: 'Sell',        colorClass: 'text-orange-400', hexColor: '#f97316' };
  if (s <= 6) return { text: 'Hold',        colorClass: 'text-yellow-400', hexColor: '#eab308' };
  if (s <= 8) return { text: 'Buy',         colorClass: 'text-emerald-400', hexColor: '#10b981' };
  return              { text: 'Strong Buy', colorClass: 'text-emerald-400', hexColor: '#10b981' };
}

const GAUGE_SEGMENTS = [
  { from: 0,   to: 0.2, stroke: '#ef4444' },
  { from: 0.2, to: 0.4, stroke: '#f97316' },
  { from: 0.4, to: 0.6, stroke: '#eab308' },
  { from: 0.6, to: 0.8, stroke: '#4ade80' },
  { from: 0.8, to: 1.0, stroke: '#10b981' },
];

function describeArc(fromFrac: number, toFrac: number, R: number, cx: number, cy: number) {
  const a1 = Math.PI - fromFrac * Math.PI;
  const a2 = Math.PI - toFrac * Math.PI;
  const x1 = cx + R * Math.cos(a1);
  const y1 = cy + R * Math.sin(a1);
  const x2 = cx + R * Math.cos(a2);
  const y2 = cy + R * Math.sin(a2);
  return `M ${x1} ${y1} A ${R} ${R} 0 0 1 ${x2} ${y2}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AnalystSignal({ symbol }: AnalystSignalProps) {
  // Swap for real fetch(symbol) when ready
  const { signal, analystCount, newsCount } = STUB_SIGNAL[symbol] ?? STUB_SIGNAL.default;

  const { text, colorClass, hexColor } = getSignalLabel(signal);

  const R  = 70;
  const cx = 100;
  const cy = 92;

  const needleAngle = Math.PI - (signal / 10) * Math.PI;
  const needleX = cx + (R - 14) * Math.cos(needleAngle);
  const needleY = cy + (R - 14) * Math.sin(needleAngle);

  return (
    <div className="border border-neutral-900 rounded-xl p-5 bg-black">
      <span className="text-[10px] font-bold tracking-widest text-neutral-600 uppercase block mb-4">
        Analyst Signal
      </span>

      {/* Gauge */}
      <div className="flex flex-col items-center mb-2">
        <svg viewBox="0 0 200 100" width="200" height="100">
          {/* Track */}
          <path
            d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`}
            fill="none"
            stroke="#1a1a1a"
            strokeWidth={14}
            strokeLinecap="round"
          />
          {/* Dim colour bands */}
          {GAUGE_SEGMENTS.map((seg, i) => (
            <path
              key={i}
              d={describeArc(seg.from, seg.to, R, cx, cy)}
              fill="none"
              stroke={seg.stroke}
              strokeWidth={10}
              strokeLinecap="butt"
              opacity={0.2}
            />
          ))}
          {/* Active fill */}
          <path
            d={describeArc(0, signal / 10, R, cx, cy)}
            fill="none"
            stroke={hexColor}
            strokeWidth={10}
            strokeLinecap="round"
            opacity={0.9}
          />
          {/* Needle */}
          <line
            x1={cx} y1={cy}
            x2={needleX} y2={needleY}
            stroke={hexColor}
            strokeWidth={2.5}
            strokeLinecap="round"
          />
          <circle cx={cx} cy={cy} r={5} fill={hexColor} />
        </svg>

        {/* Score + label */}
        <div className="flex flex-col items-center -mt-1">
          <span className={`text-3xl font-bold font-mono ${colorClass}`}>
            {signal.toFixed(1)}
          </span>
          <span className={`text-[10px] font-bold tracking-widest uppercase mt-1 ${colorClass}`}>
            {text}
          </span>
        </div>
      </div>

      {/* Meta counts */}
      <div className="flex items-center justify-center gap-6 pt-4 border-t border-neutral-900">
        <div className="flex flex-col items-center gap-1">
          <span className="text-xl font-bold text-white font-mono">{analystCount}</span>
          <span className="text-[10px] text-neutral-600 uppercase tracking-widest font-medium">
            Analysts
          </span>
        </div>
        <div className="w-px h-8 bg-neutral-900" />
        <div className="flex flex-col items-center gap-1">
          <span className="text-xl font-bold text-white font-mono">{newsCount}</span>
          <span className="text-[10px] text-neutral-600 uppercase tracking-widest font-medium">
            Articles
          </span>
        </div>
      </div>
    </div>
  );
}