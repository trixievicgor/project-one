import { forwardRef } from 'react';

// Define the shape of our stock data
export interface MarketData {
  symbol: string;
  price: number;
  currency: string;
  change?: number; // Optional if backend doesn't provide it yet
}

interface MarketHighlightProps {
  data: MarketData[];
}

export const MarketHighlight = forwardRef<HTMLDivElement, MarketHighlightProps>(({ data }, ref) => (
  <div ref={ref} className="flex pr-2 gap-2">
    {data.map((m, idx) => (
      <div key={idx} className="flex gap-2 pr-4 border-r-2 border-neutral-800 text-sm font-bold text-white items-center">
        <span className="whitespace-nowrap">{m.symbol}</span>
        {/* Format the price based on currency */}
        <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: m.currency }).format(m.price)}</span>
        <span className={m.change && m.change > 0 ? 'text-green-500' : 'text-red-500'}>{m.change}%</span>
      </div>
    ))}
  </div>
));
