import { forwardRef } from 'react';

export const highlightedMarkets = [
  { name: 'GLD', price: '$1,800.00', change: '+0.5%' },
  { name: 'BTC', price: '$180,241.00', change: '+0.5%' },
  { name: 'NVDA', price: '$1,80.00', change: '+0.5%' },
  { name: 'MSFT', price: '$1,800.00', change: '+0.5%' },
  { name: 'SPY', price: '$1,800.00', change: '+0.5%' },
  { name: 'QQQ', price: '$1,800.00', change: '+0.5%' },
  { name: 'BND', price: '$1,80.00', change: '+0.5%' },
  { name: 'AAPL', price: '$1,800.00', change: '+0.5%' },
  { name: 'N225', price: '$1,800.00', change: '+0.5%' },
  { name: 'DIA', price: '$1,800.00', change: '+0.5%' },
];

export const MarketHighlight = forwardRef<HTMLDivElement>((_, ref) => (
  <div ref={ref} className="flex pr-2 gap-2">
    {highlightedMarkets.map((m, idx) => (
      <div key={idx} className="flex gap-2 pr-4 border-r-2 border-neutral-800 text-sm font-bold text-white items-center">
        <span>{m.name}</span>
        <span>{m.price}</span>
        <span className={m.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}>{m.change}</span>
      </div>
    ))}
  </div>
));