// ─── Types ────────────────────────────────────────────────────────────────────

interface NewsArticle {
  id: number;
  source: string;
  time: string;
  headline: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  tags: string[];
}

interface LatestNewsProps {
  symbol: string;
}

// ─── Stub ─────────────────────────────────────────────────────────────────────
// Replace with real API call keyed on `symbol`

const STUB_NEWS: Record<string, NewsArticle[]> = {
  default: [
    {
      id: 1,
      source: 'Reuters',
      time: '2h ago',
      headline: 'Lorem ipsum raises guidance as demand shows no signs of slowing into fiscal 2025',
      sentiment: 'positive',
      tags: ['NVDA', 'AI'],
    },
    {
      id: 2,
      source: 'Bloomberg',
      time: '5h ago',
      headline: 'Data center revenue surges past analyst expectations for third consecutive quarter',
      sentiment: 'positive',
      tags: ['NVDA'],
    },
    {
      id: 3,
      source: 'WSJ',
      time: '8h ago',
      headline: 'Dolor sit amet regulators scrutinize export controls on advanced chips to select markets',
      sentiment: 'neutral',
      tags: ['NVDA', 'POLICY'],
    },
    {
      id: 4,
      source: 'CNBC',
      time: '1d ago',
      headline: 'Adipiscing elit: Next-gen shipments to begin Q3, manufacturing ramp confirmed by CEO',
      sentiment: 'positive',
      tags: ['NVDA'],
    },
    {
      id: 5,
      source: 'FT',
      time: '1d ago',
      headline: 'Short interest declines to lowest level in 18 months as sentiment continues to shift',
      sentiment: 'positive',
      tags: ['NVDA'],
    },
    {
      id: 6,
      source: "Barron's",
      time: '2d ago',
      headline: 'Supply chain sources indicate capacity expansion at foundry partners for upcoming orders',
      sentiment: 'neutral',
      tags: ['NVDA', 'TSM'],
    },
  ],
};

// ─── NewsItem ─────────────────────────────────────────────────────────────────

function NewsItem({ item }: { item: NewsArticle }) {
  const dotColor =
    item.sentiment === 'positive'
      ? 'bg-emerald-500'
      : item.sentiment === 'negative'
      ? 'bg-red-500'
      : 'bg-neutral-600';

  return (
    <div className="flex gap-3 py-3 border-b border-neutral-900 last:border-b-0">
      <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${dotColor}`} />
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        <p className="text-sm font-medium text-neutral-200 leading-snug cursor-pointer hover:text-white transition">
          {item.headline}
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-wider">
            {item.source}
          </span>
          <span className="text-[10px] text-neutral-700">{item.time}</span>
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="text-[9px] font-bold text-blue-400 bg-blue-400/10 border border-blue-400/15 rounded px-1.5 py-0.5 uppercase tracking-wider"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function LatestNews({ symbol }: LatestNewsProps) {
  // Swap for real fetch(symbol) when ready
  const articles = STUB_NEWS[symbol] ?? STUB_NEWS.default;

  return (
    <div className="border border-neutral-900 rounded-xl p-5 bg-black">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-bold tracking-widest text-neutral-600 uppercase">
          Latest News
        </span>
        <span className="text-[10px] text-neutral-600 uppercase tracking-widest">
          {articles.length} Articles
        </span>
      </div>
      <div className="flex flex-col">
        {articles.map((item) => (
          <NewsItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}