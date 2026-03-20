import { useParams } from 'react-router-dom';
import { RiAccountCircle2Line } from 'react-icons/ri';
import Layout from '../components/Layout';
import PriceHistory from '../components/individual/PriceHistory';
import KeyStatistics from '../components/individual/KeyStatistics';
import AnalystSignal from '../components/individual/AnalystSignal';
import AIAnalysis from '../components/individual/AIAnalysis';
import LatestNews from '../components/individual/LatestNews';

// ─── Stub metadata ────────────────────────────────────────────────────────────
// Only the title-bar fields live here — all data lives inside each sub-component.
// Replace with a real fetch(symbol) call when ready.

const STUB_META: Record<string, { name: string; exchange: string, currency: string }> = {
  NVDA:    { name: 'NVIDIA Corporation',       exchange: 'NASDAQ', currency: 'USD' },
  VOOG:    { name: 'Vanguard S&P 500 Growth',  exchange: 'NYSE',   currency: 'USD' },
  AAPL:    { name: 'Apple Inc.',               exchange: 'NASDAQ', currency: 'USD' },
  TSLA:    { name: 'Tesla, Inc.',              exchange: 'NASDAQ', currency: 'USD' },
  SPY:     { name: 'SPDR S&P 500 ETF Trust',   exchange: 'NYSE',   currency: 'USD' },
  default: { name: 'Unknown Security',         exchange: '—',      currency: '-' },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export const IndividualPage = () => {
  const { symbol: rawSymbol } = useParams<{ symbol: string }>();
  const symbol = rawSymbol?.toUpperCase() ?? '';
  const { name, exchange, currency } = STUB_META[symbol] ?? STUB_META.default;

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
        <div className="py-6 border-b border-neutral-900">
          <h1 className="text-3xl font-bold text-white">{name}</h1>
          <p className="text-[15px] font-semibold tracking-widest text-white/70 uppercase mb-1">
            {symbol} · {exchange} · {currency}
          </p>
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