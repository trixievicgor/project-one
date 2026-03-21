import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { RiAccountCircle2Line } from 'react-icons/ri';
import Layout from '../components/Layout';
import PriceHistory   from '../components/individual/PriceHistory';
import KeyStatistics  from '../components/individual/KeyStatistics';
import AnalystSignal  from '../components/individual/AnalystSignal';
import AIAnalysis     from '../components/individual/AIAnalysis';
import LatestNews     from '../components/individual/LatestNews';

// ─── Types ────────────────────────────────────────────────────────────────────

interface StockMeta {
  name: string;
  exchange: string;
  currency: string;
}

// ─── Exchange code → readable label ──────────────────────────────────────────

const EXCHANGE_LABELS: Record<string, string> = {
  NMS:   'NASDAQ',
  NYQ:   'NYSE',
  NGM:   'NASDAQ',
  NCM:   'NASDAQ',
  ASE:   'AMEX',
  PCX:   'NYSE Arca',
  BTS:   'BATS',
};

function resolveExchange(raw: string, full?: string): string {
  return EXCHANGE_LABELS[raw] ?? full ?? raw;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export const IndividualPage = () => {
  const { symbol: rawSymbol } = useParams<{ symbol: string }>();
  const symbol = rawSymbol?.toUpperCase() ?? '';

  const [meta, setMeta]         = useState<StockMeta | null>(null);
  const [metaLoading, setLoading] = useState(true);
  const [metaError, setError]     = useState<string | null>(null);

  useEffect(() => {
    if (!symbol) return;
    setLoading(true);
    setError(null);

    fetch(`http://localhost:5001/api/stock/data/${symbol.toLowerCase()}`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        setMeta({
          name:     data.longName ?? data.shortName ?? data.displayName ?? symbol,
          exchange: resolveExchange(data.exchange ?? '', data.fullExchangeName),
          currency: data.currency ?? data.financialCurrency ?? '—',
        });
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [symbol]);

  const headerButtons = (
    <div className="flex items-center justify-center gap-4">
      <button className="text-white">
        <RiAccountCircle2Line className="h-12 w-12 hover:scale-110 transition" />
      </button>
    </div>
  );

  return (
    <Layout headerRight={headerButtons}>
      <section className="w-full flex flex-col flex-grow px-4 md:px-6 pb-16">

        {/* ── Title ── */}
        <div className="py-6 border-b border-neutral-900 min-h-[88px]">
          {metaLoading ? (
            <div className="flex flex-col gap-2">
              <div className="h-8 w-64 bg-neutral-900 rounded animate-pulse" />
              <div className="h-4 w-40 bg-neutral-900 rounded animate-pulse" />
            </div>
          ) : metaError ? (
            <>
              <h1 className="text-3xl font-bold text-white">{symbol}</h1>
              <p className="text-[13px] font-semibold tracking-widest text-neutral-600 uppercase mt-1">
                Failed to load metadata
              </p>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-white">{meta!.name}</h1>
              <p className="text-[13px] font-semibold tracking-widest text-neutral-500 uppercase mt-1">
                {symbol} · {meta!.exchange} · {meta!.currency}
              </p>
            </>
          )}
        </div>

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-4 mt-4">

          {/* Left column */}
          <div className="flex flex-col gap-4">
            <PriceHistory  symbol={symbol} />
            <KeyStatistics symbol={symbol} />
            <LatestNews    symbol={symbol} />
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-4">
            <AnalystSignal symbol={symbol} />
            <AIAnalysis    symbol={symbol} />
          </div>

        </div>
      </section>
    </Layout>
  );
};

export default IndividualPage;