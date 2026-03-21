import { forwardRef, useEffect, useState } from 'react';

export interface MarketData {
  symbol: string;
  price: number;
  currency: string;
  change: number;
}

const TICKERS = ['GLD', 'BTC-USD', 'NVDA', 'AAPL', 'SPY'];

export const MarketHighlight = forwardRef<HTMLDivElement>((_, ref) => {
  const [marketData, setMarketData] = useState<MarketData[]>([]);

  const fetchAllMarkets = async () => {
    try {
      const requests = TICKERS.map(ticker => 
        fetch(`http://localhost:5001/api/stock/data/${ticker}`).then(res => res.json())
      );
      
      const results = await Promise.all(requests);
      
      const formattedData = results
        .filter(item => !item.error && item.symbol)
        .map((item): MarketData => ({
          symbol: item.symbol,
          price: item.regularMarketPrice,
          currency: item.currency || 'USD',
          change: parseFloat(item.regularMarketChangePercent?.toFixed(2) || '0')
        }));

      setMarketData(formattedData);
    } catch (err) {
      console.error("Failed to poll market data:", err);
    }
  };

  useEffect(() => {
    fetchAllMarkets();
    const interval = setInterval(fetchAllMarkets, 100000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={ref} className="flex pr-2 gap-2">
      {marketData.map((m, idx) => (
        <div key={idx} className="flex gap-2 pr-6 border-r-2 border-neutral-800 text-sm font-bold text-white items-center">
          <span className="whitespace-nowrap tracking-tighter text-neutral-400">{m.symbol}</span>
          
          <span className="font-mono">
            {new Intl.NumberFormat('en-US', { 
              style: 'currency', 
              currency: m.currency 
            }).format(m.price)}
          </span>

          <span className={`flex items-center gap-0.5 ${m.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {m.change >= 0 ? '▲' : '▼'}
            {Math.abs(m.change)}%
          </span>
        </div>
      ))}
    </div>
  );
});

MarketHighlight.displayName = "MarketHighlight";