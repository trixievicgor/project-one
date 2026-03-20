import { forwardRef, useEffect, useState } from 'react';

export interface MarketData {
  symbol: string;
  price: number;
  currency: string;
  change?: number;
}

const TICKERS = ['GLD', 'BTC-USD', 'NVDA', 'AAPL', 'SPY'];

// Using forwardRef so GSAP can still control the animation from the parent
export const MarketHighlight = forwardRef<HTMLDivElement>((_, ref) => {
  const [marketData, setMarketData] = useState<MarketData[]>([]);

  const fetchAllMarkets = async () => {
    try {
      const requests = TICKERS.map(ticker => 
        fetch(`http://localhost:5001/api/stock/${ticker}`).then(res => res.json())
      );
      const results = await Promise.all(requests);
      setMarketData(results.filter(item => !item.error));
    } catch (err) {
      console.error("Failed to poll market data:", err);
    }
  };

  useEffect(() => {
    fetchAllMarkets();
    const interval = setInterval(fetchAllMarkets, 100000); // 100s as per your original code
    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={ref} className="flex pr-2 gap-2">
      {marketData.map((m, idx) => (
        <div key={idx} className="flex gap-2 pr-4 border-r-2 border-neutral-800 text-sm font-bold text-white items-center">
          <span className="whitespace-nowrap">{m.symbol}</span>
          <span>
            {new Intl.NumberFormat('en-US', { 
              style: 'currency', 
              currency: m.currency 
            }).format(m.price)}
          </span>
          <span className={(m.change ?? 0) > 0 ? 'text-green-500' : 'text-red-500'}>
            {m.change}%
          </span>
        </div>
      ))}
    </div>
  );
});

MarketHighlight.displayName = "MarketHighlight";