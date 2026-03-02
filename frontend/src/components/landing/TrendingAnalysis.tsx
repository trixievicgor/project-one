import Sparkline from './Sparkline';

export const ANALYSIS_HEADERS = ["Ticker", "Price", "Change", "3M Behavior", "Analyst Target", "Rating"];

export const stocksData = [
  { ticker: "GUTS", company: "Fractyl Health", target: 6.00, upside: 1176.60, rating: "Strong Buy", price: 0.47, change: -0.005, changePct: -113.8, behavior: -74.51, spark: [10,14,12,22,26,28,29] },
  { ticker: "TCRX", company: "TScan Therapeutics", target: 6.50, upside: 513.21, rating: "Strong Buy", price: 1.06, change: -0.05, changePct: -450.5, behavior: 11.34, spark: [22,20,18,16,12,10,8] },
  { ticker: "IMUX", company: "Immunic", target: 5.50, upside: 439.22, rating: "Strong Buy", price: 1.02, change: 0.072, changePct: 762.9, behavior: 56.44, spark: [24,20,16,12,10,6,4] },
  { ticker: "PRQR", company: "ProQR", target: 8.33, upside: 423.90, rating: "Strong Buy", price: 1.59, change: 0, changePct: 0, behavior: -18.46, spark: [10,14,18,20,22,24,26] },
  { ticker: "ABEO", company: "Abeona Therapeutics", target: 24.00, upside: 368.75, rating: "Strong Buy", price: 5.12, change: -0.08, changePct: -153.8, behavior: 12.53, spark: [24,20,16,14,14,12,10] },
  { ticker: "CRDF", company: "Cardiff Oncology", target: 8.00, upside: 312.37, rating: "Strong Buy", price: 1.94, change: -0.02, changePct: -102, behavior: -4.90, spark: [14,16,14,16,18,17,18] },
  { ticker: "TARA", company: "Protara Therapeutics", target: 25.75, upside: 304.87, rating: "Strong Buy", price: 6.36, change: 0.59, changePct: 1022.5, behavior: 2.25, spark: [20,18,20,18,16,14,14] },
  { ticker: "ATAI", company: "Atai Biolabs NV", target: 14.00, upside: 285.67, rating: "Strong Buy", price: 3.63, change: -0.10, changePct: -268.1, behavior: -6.20, spark: [8,12,14,18,20,22,24] },
];

export default function TrendingAnalysis() {
  return (
    <div className="flex flex-col p-3 w-full">
      <h1 className="text-white font-bold text-3xl mb-4">Trending Analysis</h1>
      <div className="border border-neutral-900 rounded overflow-hidden max-h-[340px] overflow-y-auto scrollbar-dark">
        <table className="w-full text-right">
          <thead className="bg-neutral-950 sticky top-0 text-[10px] tracking-widest text-neutral-600 uppercase">
            <tr>
              {ANALYSIS_HEADERS.map(h => <th key={h} className={`px-5 py-3 font-normal ${h === "Ticker" ? "text-left" : h === "Rating" ? "text-center" : ""}`}>{h}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-900">
            {stocksData.map((s) => (
              <tr key={s.ticker} className="hover:bg-neutral-800/50 transition">
                <td className="px-5 py-2 text-left">
                  <div className="font-mono text-sm font-bold text-blue-400">{s.ticker}</div>
                  <div className="text-[10px] text-neutral-500 truncate max-w-32">{s.company}</div>
                </td>
                <td className="px-5 font-mono text-sm text-white">${s.price.toFixed(2)}</td>
                <td className={`px-5 font-mono text-xs ${s.change >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  <div>{s.change >= 0 ? "▲" : "▼"} {Math.abs(s.change).toFixed(2)}</div>
                  <div className="opacity-60">{s.changePct.toFixed(1)}%</div>
                </td>
                <td className="px-5">
                  <div className="flex items-center justify-end gap-2">
                    <Sparkline points={s.spark} color={s.behavior >= 0 ? "#10b981" : "#ef4444"} />
                    <span className={`text-xs font-bold ${s.behavior >= 0 ? "text-emerald-400" : "text-red-400"}`}>{Math.abs(s.behavior)}%</span>
                  </div>
                </td>
                <td className="px-5">
                  <div className="text-yellow-400 font-bold text-sm">${s.target}</div>
                  <div className="text-[10px] text-emerald-400">↑ {s.upside}%</div>
                </td>
                <td className="px-5 text-center">
                  <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[9px] px-2 py-0.5 rounded uppercase">Strong Buy</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}