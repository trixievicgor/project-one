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

// ─── Types ────────────────────────────────────────────────────────────────────

interface PriceHistoryProps {
  symbol: string;
}

interface OHLCBar {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  adjClose: number;
  volume: number;
}

interface ChartPoint {
  label: string;
  price: number;
}

interface StockQuote {
  regularMarketPrice: number;
  regularMarketChange: number;
  regularMarketChangePercent: number;
  regularMarketDayHigh: number;
  regularMarketDayLow: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  currency: string;
  postMarketPrice?: number;
  postMarketChange?: number;
  postMarketChangePercent?: number;
  marketState: string; // 'REGULAR' | 'PRE' | 'POST' | 'CLOSED' | 'POSTPOST' | 'PREPRE'
}

// ─── Constants ────────────────────────────────────────────────────────────────

const RANGES = ['1W', '1M', '3M', '6M', 'YTD', '1Y', '5Y', 'ALL'] as const;
type Range = typeof RANGES[number];

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$', EUR: '€', GBP: '£', JPY: '¥', CAD: 'CA$', AUD: 'A$',
};

// NYSE/NASDAQ hours ET Mon–Fri
const PRE_OPEN_MINS = 4 * 60;
const OPEN_MINS     = 9 * 60 + 30;
const CLOSE_MINS    = 16 * 60;
const AH_CLOSE_MINS = 20 * 60;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getCurrencySymbol(code: string): string {
  return CURRENCY_SYMBOLS[code] ?? code + ' ';
}

function formatLabel(dateStr: string, range: Range): string {
  const d = new Date(dateStr);
  if (range === '1W' || range === '1M' || range === '3M') {
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
}

function fmtPrice(val: number, sym: string): string {
  return `${sym}${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function dedupeByDate(bars: OHLCBar[]): OHLCBar[] {
  const seen = new Set<string>();
  return bars.filter(b => {
    const day = b.date.split('T')[0];
    if (seen.has(day)) return false;
    seen.add(day);
    return true;
  });
}

// ─── Market status helper ─────────────────────────────────────────────────────

type Session = 'pre-market' | 'open' | 'after-hours' | 'closed';

function getMarketStatus(): { session: Session; label: string; dotClass: string } {
  const etString  = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
  const now       = new Date(etString);
  const day       = now.getDay();
  const nowMins   = now.getHours() * 60 + now.getMinutes();
  const isWeekday = day >= 1 && day <= 5;

  const fmt = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  if (isWeekday && nowMins >= PRE_OPEN_MINS && nowMins < OPEN_MINS)
    return { session: 'pre-market', label: `Pre-Market · Opens in ${fmt(OPEN_MINS - nowMins)}`, dotClass: 'bg-yellow-500' };
  if (isWeekday && nowMins >= OPEN_MINS && nowMins < CLOSE_MINS)
    return { session: 'open', label: `Market Open · Closes in ${fmt(CLOSE_MINS - nowMins)}`, dotClass: 'bg-emerald-500' };
  if (isWeekday && nowMins >= CLOSE_MINS && nowMins < AH_CLOSE_MINS)
    return { session: 'after-hours', label: `After-Hours · Closes in ${fmt(AH_CLOSE_MINS - nowMins)}`, dotClass: 'bg-blue-400' };

  let minsUntil: number;
  let dayLabel = '';
  if (isWeekday && nowMins < PRE_OPEN_MINS) {
    minsUntil = PRE_OPEN_MINS - nowMins;
  } else {
    let daysAhead = 1;
    let nextDay = (day + 1) % 7;
    while (nextDay === 0 || nextDay === 6) { daysAhead++; nextDay = (nextDay + 1) % 7; }
    const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayLabel  = ` ${DAYS[nextDay]}`;
    minsUntil = (24 * 60 - nowMins) + (daysAhead - 1) * 24 * 60 + PRE_OPEN_MINS;
  }

  return { session: 'closed', label: `Closed · Pre-Market${dayLabel} in ${fmt(minsUntil)}`, dotClass: 'bg-neutral-600' };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PriceHistory({ symbol }: PriceHistoryProps) {
  const [activeRange, setActiveRange]   = useState<Range>('1W');
  const [marketStatus, setMarketStatus] = useState(getMarketStatus);

  const [quote, setQuote]           = useState<StockQuote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(true);
  const [quoteError, setQuoteError]     = useState<string | null>(null);

  const [chartData, setChartData]   = useState<ChartPoint[]>([]);
  const [chartLoading, setChartLoading] = useState(true);
  const [chartError, setChartError]     = useState<string | null>(null);

  // Refresh market status every 30 s
  useEffect(() => {
    const id = setInterval(() => setMarketStatus(getMarketStatus()), 30_000);
    return () => clearInterval(id);
  }, []);

  // Fetch quote data
  useEffect(() => {
    if (!symbol) return;
    setQuoteLoading(true);
    setQuoteError(null);
    fetch(`http://localhost:5001/api/stock/data/${symbol.toLowerCase()}`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<StockQuote>;
      })
      .then(data => { setQuote(data); setQuoteLoading(false); })
      .catch(err => { setQuoteError(err.message); setQuoteLoading(false); });
  }, [symbol]);

  // Fetch chart history
  useEffect(() => {
    if (!symbol) return;
    setChartLoading(true);
    setChartError(null);
    fetch(`http://localhost:5001/api/stock/history/${symbol.toLowerCase()}/${activeRange.toLowerCase()}`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<OHLCBar[]>;
      })
      .then(bars => {
        const unique = dedupeByDate(bars);
        setChartData(unique.map(b => ({
          label: formatLabel(b.date, activeRange),
          price: parseFloat(b.close.toFixed(2)),
        })));
        setChartLoading(false);
      })
      .catch(err => { setChartError(err.message); setChartLoading(false); });
  }, [symbol, activeRange]);

  // ── Derived values ──────────────────────────────────────────────────────────

  const currencyCode   = quote?.currency ?? 'USD';
  const currencySymbol = getCurrencySymbol(currencyCode);
  const price          = quote?.regularMarketPrice ?? 0;
  const change         = quote?.regularMarketChange ?? 0;
  const changePct      = quote?.regularMarketChangePercent ?? 0;
  const dayHigh        = quote?.regularMarketDayHigh ?? 0;
  const dayLow         = quote?.regularMarketDayLow ?? 0;
  const w52High        = quote?.fiftyTwoWeekHigh ?? 0;
  const w52Low         = quote?.fiftyTwoWeekLow ?? 0;

  // Post-market / pre-market
  const marketState    = quote?.marketState ?? 'CLOSED';
  const showPostMarket = (marketState === 'POST' || marketState === 'POSTPOST' || marketState === 'CLOSED') &&
                         quote?.postMarketPrice != null;
  const showPreMarket  = (marketState === 'PRE' || marketState === 'PREPRE') &&
                         marketStatus.session === 'pre-market';

  const postPrice   = quote?.postMarketPrice ?? 0;
  const postChange  = quote?.postMarketChange ?? 0;
  const postPct     = quote?.postMarketChangePercent ?? 0;

  // Chart growth over selected range
  const rangeStart    = chartData[0]?.price ?? 0;
  const rangeEnd      = chartData[chartData.length - 1]?.price ?? 0;
  const rangeChange   = rangeEnd - rangeStart;
  const rangePct      = rangeStart > 0 ? (rangeChange / rangeStart) * 100 : 0;
  const rangePositive = rangeChange >= 0;

  // Chart line color follows range growth, not just today's change
  const chartColor = rangePositive ? '#10b981' : '#ef4444';

  const isPositive    = change >= 0;
  const isPostPos     = postChange >= 0;

  const rangeMarker = (low: number, high: number) =>
    `calc(${Math.min(100, Math.max(0, ((price - low) / (high - low)) * 100))}% - 6px)`;

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="border border-neutral-900 rounded-xl p-5 bg-black">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap mb-5">

        {/* Left */}
        <div className="flex flex-col gap-2">
          {quoteLoading ? (
            <div className="h-10 w-48 bg-neutral-900 rounded animate-pulse" />
          ) : quoteError ? (
            <span className="text-xs text-neutral-600">Failed to load quote</span>
          ) : (
            <>
              {/* Main price */}
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-4xl font-bold text-white font-mono tracking-tight">
                  {fmtPrice(price, currencySymbol)}
                </span>
                <span className={`text-sm font-semibold px-2.5 py-1 rounded-md ${
                  isPositive ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'
                }`}>
                  {isPositive ? '+' : ''}{change.toFixed(2)}&nbsp;
                  ({isPositive ? '+' : ''}{changePct.toFixed(2)}%)
                </span>
              </div>

              {/* Post-market */}
              {showPostMarket && (
                <div className="flex items-center gap-2 pl-0.5">
                  <span className="text-[10px] font-bold tracking-widest text-blue-400/80 uppercase">After-Hours</span>
                  <span className="text-sm font-bold text-white font-mono">{fmtPrice(postPrice, currencySymbol)}</span>
                  <span className={`text-xs font-semibold ${isPostPos ? 'text-emerald-400' : 'text-red-400'}`}>
                    {isPostPos ? '+' : ''}{postChange.toFixed(2)}&nbsp;
                    ({isPostPos ? '+' : ''}{postPct.toFixed(2)}%)
                  </span>
                </div>
              )}

              {/* Pre-market */}
              {showPreMarket && (
                <div className="flex items-center gap-2 pl-0.5">
                  <span className="text-[10px] font-bold tracking-widest text-yellow-500/80 uppercase">Pre-Market</span>
                  <span className="text-sm font-bold text-white font-mono">{fmtPrice(postPrice, currencySymbol)}</span>
                  <span className={`text-xs font-semibold ${isPostPos ? 'text-emerald-400' : 'text-red-400'}`}>
                    {isPostPos ? '+' : ''}{postChange.toFixed(2)}&nbsp;
                    ({isPostPos ? '+' : ''}{postPct.toFixed(2)}%)
                  </span>
                </div>
              )}

              {/* Market session */}
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${marketStatus.dotClass} ${
                  marketStatus.session === 'open' || marketStatus.session === 'pre-market' ? 'animate-pulse' : ''
                }`} />
                <span className="text-[11px] font-medium text-neutral-500 tracking-wide">{marketStatus.label}</span>
                <span className="text-[11px] text-neutral-700">· ET</span>
              </div>
            </>
          )}
        </div>

        {/* Right: range bars */}
        {!quoteLoading && !quoteError && (
          <div className="flex flex-col gap-4 pt-1 min-w-[220px]">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-neutral-300">52 Week Range</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-500 font-mono w-14 text-right">{fmtPrice(w52Low, currencySymbol)}</span>
                <div className="relative flex-1 h-1 bg-neutral-700 rounded-full">
                  <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-neutral-400 rounded-full"
                    style={{ left: rangeMarker(w52Low, w52High) }} />
                </div>
                <span className="text-xs text-neutral-500 font-mono w-14">{fmtPrice(w52High, currencySymbol)}</span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-neutral-300">Day Range</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-500 font-mono w-14 text-right">{fmtPrice(dayLow, currencySymbol)}</span>
                <div className="relative flex-1 h-1 bg-neutral-700 rounded-full">
                  <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-neutral-400 rounded-full"
                    style={{ left: rangeMarker(dayLow, dayHigh) }} />
                </div>
                <span className="text-xs text-neutral-500 font-mono w-14">{fmtPrice(dayHigh, currencySymbol)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Range tabs + growth badge ── */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold tracking-widest text-white uppercase">Price History</span>
          {/* Growth badge for selected range */}
          {!chartLoading && chartData.length > 1 && (
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
              rangePositive
                ? 'text-emerald-400 bg-emerald-500/10'
                : 'text-red-400 bg-red-500/10'
            }`}>
              {rangePositive ? '+' : ''}{rangePct.toFixed(2)}% ({activeRange})
            </span>
          )}
        </div>
        <div className="flex gap-1">
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setActiveRange(r)}
              className={`px-2 py-1 text-xs font-semibold rounded transition ${
                activeRange === r
                  ? 'bg-neutral-800 text-white'
                  : 'text-white hover:text-neutral-300 hover:bg-neutral-900'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* ── Chart ── */}
      <div className="relative">
        {chartLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="flex gap-1.5">
              <span className="w-1.5 h-1.5 bg-neutral-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-neutral-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-neutral-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        {chartError && !chartLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <span className="text-xs text-white">Failed to load chart data</span>
          </div>
        )}

        <div className={chartLoading || chartError ? 'opacity-20 pointer-events-none' : ''}>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={chartData} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id={`grad-${symbol}-${activeRange}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColor} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis
                dataKey="label"
                tick={{ fill: '#ffffff', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fill: '#ffffff', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                domain={['auto', 'auto']}
              />
              <Tooltip
                contentStyle={{ background: '#0a0a0a', border: '1px solid #262626', borderRadius: 8, color: '#f5f5f5' }}
                labelStyle={{ color: '#737373' }}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke={chartColor}
                strokeWidth={1.5}
                fill={`url(#grad-${symbol}-${activeRange})`}
                dot={false}
                isAnimationActive={!chartLoading}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}