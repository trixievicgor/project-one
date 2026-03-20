// ─── Stub ─────────────────────────────────────────────────────────────────────
// Replace with real API call keyed on `symbol`

const STUB_ANALYSIS: Record<string, string> = {
  default:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. This ticker continues to dominate its sector with strong institutional demand and sustained capital expenditure from major players. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua, with supply constraints beginning to ease through Q2. Analysts broadly maintain buy ratings, citing long-term positioning in key infrastructure markets. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface AIAnalysisProps {
  symbol: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AIAnalysis({ symbol }: AIAnalysisProps) {
  // Swap for real fetch(symbol) when ready
  const summary = STUB_ANALYSIS[symbol] ?? STUB_ANALYSIS.default;

  return (
    <div className="border border-neutral-900 rounded-xl p-5 bg-black">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-bold tracking-widest text-neutral-600 uppercase">
          AI Analysis
        </span>
        <span className="text-[9px] font-bold tracking-widest text-blue-400 bg-blue-400/10 border border-blue-400/20 rounded px-2 py-0.5 uppercase">
          AI
        </span>
      </div>
      <p className="text-sm leading-relaxed text-neutral-500">{summary}</p>
    </div>
  );
}