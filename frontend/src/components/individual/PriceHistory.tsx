import { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// ─── Stub ─────────────────────────────────────────────────────────────────────

const STUB_DATA: Record<string, {
  price: number;
  change: number;
  changePct: number;
  todayHigh: number;
  todayLow: number;
  week52High: number;
  week52Low: number;
  currency: string;          // e.g. 'USD', 'EUR', 'GBP'
  currencySymbol: string;    // e.g. '$', '€', '£'
  preMarketPrice: number | null;    // null when no pre-market data
  preMarketChange: number | null;
  preMarketChangePct: number | null;
  history: { label: string; price: number }[];
}> = {
  default: {
    price: 875.42,
    change: +18.34,
    changePct: +2.14,
    todayHigh: 891.20,
    todayLow: 853.10,
    week52High: 974.00,
    week52Low: 402.60,
    currency: 'USD',
    currencySymbol: '$',
    preMarketPrice: 879.10,
    preMarketChange: +3.68,
    preMarketChangePct: +0.42,
    history: [
      { label: 'Jan', price: 412 },
      { label: 'Feb', price: 438 },
      { label: 'Mar', price: 421 },
      { label: 'Apr', price: 455 },
      { label: 'May', price: 471 },
      { label: 'Jun', price: 449 },
      { label: 'Jul', price: 489 },
      { label: 'Aug', price: 502 },
      { label: 'Sep', price: 478 },
      { label: 'Oct', price: 511 },
      { label: 'Nov', price: 534 },
      { label: 'Dec', price: 521 },
    ],
  },
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface PriceHistoryProps {
  symbol: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const RANGES = ['1D', '1W', '1M', '3M', '6M', 'YTD', '1Y', '5Y', 'ALL'] as const;

// NYSE/NASDAQ hours ET Mon–Fri
// Pre-market:  04:00 – 09:30
// Regular:     09:30 – 16:00
// After-hours: 16:00 – 20:00
const PRE_OPEN_MINS = 4 * 60;       // 240
const OPEN_MINS     = 9 * 60 + 30;  // 570
const CLOSE_MINS    = 16 * 60;      // 960
const AH_CLOSE_MINS = 20 * 60;      // 1200

// ─── Market status helper ─────────────────────────────────────────────────────

type Session = 'pre-market' | 'open' | 'after-hours' | 'closed';

function getMarketStatus(): { session: Session; label: string; dotClass: string } {
  const etString = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
  const now      = new Date(etString);
  const day      = now.getDay();
  const nowMins  = now.getHours() * 60 + now.getMinutes();
  const isWeekday = day >= 1 && day <= 5;

  const fmt = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  if (isWeekday && nowMins >= PRE_OPEN_MINS && nowMins < OPEN_MINS) {
    return {
      session: 'pre-market',
      label: `Opens in ${fmt(OPEN_MINS - nowMins)}`,
      dotClass: 'bg-yellow-500',
    };
  }

  if (isWeekday && nowMins >= OPEN_MINS && nowMins < CLOSE_MINS) {
    return {
      session: 'open',
      label: `Market Open · Closes in ${fmt(CLOSE_MINS - nowMins)}`,
      dotClass: 'bg-emerald-500',
    };
  }

  if (isWeekday && nowMins >= CLOSE_MINS && nowMins < AH_CLOSE_MINS) {
    return {
      session: 'after-hours',
      label: `After-Hours · Closes in ${fmt(AH_CLOSE_MINS - nowMins)}`,
      dotClass: 'bg-blue-400',
    };
  }

  // Closed — find next weekday open
  let minsUntil: number;
  let dayLabel = '';

  if (isWeekday && nowMins < PRE_OPEN_MINS) {
    minsUntil = PRE_OPEN_MINS - nowMins;
  } else {
    let daysAhead = 1;
    let nextDay   = (day + 1) % 7;
    while (nextDay === 0 || nextDay === 6) { daysAhead++; nextDay = (nextDay + 1) % 7; }
    const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayLabel  = ` ${DAYS[nextDay]}`;
    minsUntil = (24 * 60 - nowMins) + (daysAhead - 1) * 24 * 60 + PRE_OPEN_MINS;
  }

  return {
    session: 'closed',
    label: `Closed · Pre-Market${dayLabel} in ${fmt(minsUntil)}`,
    dotClass: 'bg-neutral-600',
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PriceHistory({ symbol }: PriceHistoryProps) {
  const [activeRange, setActiveRange]   = useState<string>('1Y');
  const [marketStatus, setMarketStatus] = useState(getMarketStatus);

  // Refresh status every 30 s
  useEffect(() => {
    const id = setInterval(() => setMarketStatus(getMarketStatus()), 30_000);
    return () => clearInterval(id);
  }, []);

  const data = STUB_DATA[symbol] ?? STUB_DATA.default;
  const {
    price, change, changePct,
    todayHigh, todayLow,
    week52High, week52Low,
    currencySymbol,
    preMarketPrice, preMarketChange, preMarketChangePct,
    history,
  } = data;

  const isPositive       = change >= 0;
  const chartColor       = isPositive ? '#10b981' : '#ef4444';
  const isPreMarketPos   = (preMarketChange ?? 0) >= 0;
  const showPreMarket    = preMarketPrice !== null &&
                           (marketStatus.session === 'pre-market' || marketStatus.session === 'closed');

  return (
    <div className="border border-neutral-900 rounded-xl p-5 bg-black">

      {/* ── Header row ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap mb-5">

        {/* Left: price + change + currency + pre-market + market status */}
        <div className="flex flex-col gap-2">

          {/* Main price row */}
          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="text-4xl font-bold text-white font-mono tracking-tight">
              {currencySymbol}{price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            <span className={`text-sm font-semibold px-2.5 py-1 rounded-md ${
              isPositive ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'
            }`}>
              {isPositive ? '+' : ''}{change.toFixed(2)}&nbsp;
              ({isPositive ? '+' : ''}{changePct.toFixed(2)}%)
            </span>

          </div>

          {/* Pre-market price row — only shown when market is closed/pre-market */}
          {showPreMarket && (
            <div className="flex items-center gap-2 pl-0.5">
              <span className="text-[10px] font-bold tracking-widest text-yellow-500/80 uppercase">
                Pre-Market
              </span>
              <span className="text-sm font-bold text-white font-mono">
                {currencySymbol}{preMarketPrice!.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
              <span className={`text-xs font-semibold ${isPreMarketPos ? 'text-emerald-400' : 'text-red-400'}`}>
                {isPreMarketPos ? '+' : ''}{preMarketChange!.toFixed(2)}&nbsp;
                ({isPreMarketPos ? '+' : ''}{preMarketChangePct!.toFixed(2)}%)
              </span>
            </div>
          )}

          {/* Market session status */}
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${marketStatus.dotClass} ${
              marketStatus.session === 'open' || marketStatus.session === 'pre-market' ? 'animate-pulse' : ''
            }`} />
            <span className="text-[11px] font-medium text-neutral-500 tracking-wide">
              {marketStatus.label}
            </span>
            <span className="text-[11px] text-neutral-500">· ET</span>
          </div>
        </div>

        {/* Right: Today H/L + 52W H/L with range bars */}
        <div className="flex gap-6 pt-1">

          {/* Today */}
          <div className="flex flex-col gap-2 min-w-[140px]">
            <span className="text-[10px] font-bold tracking-widest text-white uppercase">Today</span>
            {/* H/L values */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-white">L</span>
                <span className="text-xs font-bold text-red-400 font-mono">
                  {currencySymbol}{todayLow.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-emerald-400 font-mono">
                  {currencySymbol}{todayHigh.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[10px] font-bold text-white">H</span>
              </div>
            </div>
            {/* Bar with marker */}
            <div className="relative h-1.5 bg-neutral-800 rounded-full overflow-visible">
              {/* Filled portion up to current price */}
              <div
                className="absolute left-0 top-0 h-full rounded-full"
                style={{ width: `${Math.min(100, Math.max(0, ((price - todayLow) / (todayHigh - todayLow)) * 100))}%` }}
              />
              {/* Current price marker dot */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full border-2 border-black shadow-md"
                style={{ left: `calc(${Math.min(100, Math.max(0, ((price - todayLow) / (todayHigh - todayLow)) * 100))}% - 5px)` }}
              />
            </div>
          </div>

          {/* Divider */}
          <div className="w-px bg-neutral-900 self-stretch" />

          {/* 52 Week */}
          <div className="flex flex-col gap-2 min-w-[140px]">
            <span className="text-[10px] font-bold tracking-widest text-white uppercase">52 Week</span>
            {/* H/L values */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-white">L</span>
                <span className="text-xs font-bold text-red-400 font-mono">
                  {currencySymbol}{week52Low.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-emerald-400 font-mono">
                  {currencySymbol}{week52High.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[10px] font-bold text-white">H</span>
              </div>
            </div>
            {/* Bar with marker */}
            <div className="relative h-1.5 bg-neutral-800 rounded-full overflow-visible">
              <div
                className="absolute left-0 top-0 h-full rounded-full"
                style={{ width: `${Math.min(100, Math.max(0, ((price - week52Low) / (week52High - week52Low)) * 100))}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full border-2 border-black shadow-md"
                style={{ left: `calc(${Math.min(100, Math.max(0, ((price - week52Low) / (week52High - week52Low)) * 100))}% - 5px)` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Range tabs ── */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-bold tracking-widest text-neutral-600 uppercase">
          Price History
        </span>
        <div className="flex gap-1">
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setActiveRange(r)}
              className={`px-2 py-1 text-xs font-semibold rounded transition ${
                activeRange === r
                  ? 'bg-neutral-800 text-white'
                  : 'text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* ── Chart ── */}
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={history} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id={`grad-${symbol}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={chartColor} stopOpacity={0.2} />
              <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="label" tick={{ fill: '#525252', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#525252', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: '#0a0a0a', border: '1px solid #262626', borderRadius: 8, color: '#f5f5f5' }}
            labelStyle={{ color: '#737373' }}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke={chartColor}
            strokeWidth={1.5}
            fill={`url(#grad-${symbol})`}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}