import { useState } from 'react';

// Data contained within the component
const bullData = [
  { symbol: "NVDA", change: 100 },
  { symbol: "GOOG", change: 80 },
  { symbol: "AAPL", change: 65 },
  { symbol: "MSFT", change: 50 },
  { symbol: "TSLA", change: 35 },
];

const bearData = [
  { symbol: "META", change: 90 },
  { symbol: "AMZN", change: 70 },
  { symbol: "NFLX", change: 55 },
  { symbol: "UBER", change: 40 },
  { symbol: "SNAP", change: 25 },
];

const filters = ["Portfolio", "Stock", "Crypto", "ETF"];

export default function TopMovers() {
  const [isBull, setIsBull] = useState(true);
  const [activeFilter, setActiveFilter] = useState(0);

  const currentData = isBull ? bullData : bearData;
  const maxChange = Math.max(...currentData.map(s => s.change));

  return (
    <div className="p-3 w-full max-w-lg">
      {/* Header & Toggle */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white text-3xl font-bold">{isBull ? "Top Bulls" : "Top Bears"}</h2>
        <div className="flex gap-2 text-xl">
          <button onClick={() => setIsBull(false)} className={!isBull ? "text-red-500" : "opacity-30"}>↓</button>
          <button onClick={() => setIsBull(true)} className={isBull ? "text-green-500" : "opacity-30"}>↑</button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 mb-5 border-b border-neutral-800 pb-3">
        {filters.map((title, i) => (
          <button 
            key={title} 
            onClick={() => setActiveFilter(i)}
            className={`px-3 py-1 text-sm rounded-md transition ${activeFilter === i ? "bg-neutral-800 text-white" : "text-neutral-500 hover:text-neutral-300"}`}
          >
            {title}
          </button>
        ))}
      </div>

      {/* List of Stocks */}
      <div className="flex flex-col gap-1">
        {currentData.map((stock, i) => (
          <div key={i} className="flex items-center gap-3 py-2 px-2 rounded-xl hover:bg-neutral-900 transition">
            <img src="/Logo.png" alt="" className="w-6 h-6 rounded opacity-70" />
            <span className="text-white font-bold text-sm w-14">{stock.symbol}</span>
            
            {/* Relative Strength Bar */}
            <div className="flex-1 h-2 bg-neutral-900 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-700 ${isBull ? "bg-green-500" : "bg-red-500"}`} 
                style={{ width: `${(stock.change / maxChange) * 100}%` }} 
              />
            </div>

            <span className={`text-sm font-semibold w-14 text-right ${isBull ? "text-green-400" : "text-red-400"}`}>
              {isBull ? "+" : "-"}{stock.change}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}