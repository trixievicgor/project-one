const STUB_STATS: Record<string, {
  marketCap: string;
  peRatio: number;
  volume: string;
  avgVolume: string;
  week52High: number;
  week52Low: number;
  eps: number;
  beta: number;
  dividend: string;
}> = {
  default: {
    marketCap: '2.15T',
    peRatio: 68.4,
    volume: '42.3M',
    avgVolume: '38.1M',
    week52High: 974.0,
    week52Low: 402.6,
    eps: 12.81,
    beta: 1.68,
    dividend: 'N/A',
  },
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface KeyStatisticsProps {
  symbol: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function KeyStatistics({ symbol }: KeyStatisticsProps) {
  // Swap for real fetch(symbol) when ready
  const s = STUB_STATS[symbol] ?? STUB_STATS.default;

  const stats = [
    { label: 'Market Cap',  value: s.marketCap },
    { label: 'P/E Ratio',   value: String(s.peRatio) },
    { label: 'Volume',      value: s.volume },
    { label: 'Avg Volume',  value: s.avgVolume },
    { label: '52W High',    value: `$${s.week52High}` },
    { label: '52W Low',     value: `$${s.week52Low}` },
    { label: 'EPS',         value: String(s.eps) },
    { label: 'Beta',        value: String(s.beta) },
    { label: 'Dividend',    value: s.dividend },
  ];

  return (
    <div className="border border-neutral-900 rounded-xl p-5 bg-black">
      <span className="text-[10px] font-bold tracking-widest text-white uppercase block mb-4">
        Key Statistics
      </span>

      <div className="grid grid-cols-3 gap-0">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={`flex flex-col gap-1 py-3 ${i < 6 ? 'border-b border-neutral-900' : ''}`}
          >
            <span className="text-[10px] text-white font-medium uppercase tracking-wider">
              {stat.label}
            </span>
            <span className="text-sm font-bold text-white font-mono">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}