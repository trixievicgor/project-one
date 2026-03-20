import { useState, useEffect } from 'react';

interface Mover {
  symbol: string;
  changePercent: number;
}

interface TopMoversData {
  gainers: Mover[];
  losers: Mover[];
}

const filters = ["World", "Portfolio 1", "Portfolio 2", "Portfolio 3"];

export default function TopMovers() {
  const [isBull, setIsBull] = useState(true);
  const [activeFilter, setActiveFilter] = useState(0);
  const [data, setData] = useState<TopMoversData | null>(null);
  const currentData = isBull ? data?.gainers : data?.losers;
  const maxChange = currentData?.length 
    ? Math.max(...currentData.map(s => Math.abs(s.changePercent))) 
    : 100;

  const getMovers = async () => {
    try {
      // Keep loading true only on first fetch to prevent flickering on intervals
      const response = await fetch('http://localhost:5001/api/top-movers');
      if (!response.ok) throw new Error('Network response was not ok');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching movers:", error);
    } 
  };

  useEffect(() => {
    getMovers();
  }, []);

  return (
    <div className="p-3 w-full max-w-lg">
      {/* Header & Toggle */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white text-3xl font-bold">{isBull ? "Top Bulls" : "Top Bears"}</h2>
        <div className="flex gap-2 text-xl">
          <button onClick={() => setIsBull(false)} className={!isBull ? "text-red-500" : "opacity-30 hover:opacity-50 hover:text-red-500"}>↓</button>
          <button onClick={() => setIsBull(true)} className={isBull ? "text-green-500" : "opacity-30 hover:opacity-50 hover:text-green-500"}>↑</button>
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
      <div className="flex flex-col gap-1 overflow-hidden max-h-[280px] overflow-y-auto scrollbar-dark">
        {currentData?.map((stock, i) => (
          <div key={i} className="flex items-center gap-3 py-2 px-2 rounded-xl hover:bg-neutral-900 transition">
            <img src="/Logo.png" alt="" className="w-6 h-6 rounded opacity-70" />
            <span className="text-white font-bold text-sm w-14">{stock.symbol}</span>
            
            {/* Relative Strength Bar */}
            <div className="flex-1 h-2 bg-neutral-900 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-700 ${isBull ? "bg-green-500" : "bg-red-500"}`} 
                style={{ width: `${(stock.changePercent / maxChange) * 100}%` }} 
              />
            </div>

            <span className={`text-sm font-semibold w-14 text-right ${isBull ? "text-green-400" : "text-red-400"}`}>
              {isBull ? "+" : ""}{stock.changePercent}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
