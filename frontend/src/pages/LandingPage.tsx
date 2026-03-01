// import { useNavigate } from 'react-router-dom';
import { RiAccountCircle2Line } from 'react-icons/ri';
import Layout from '../components/Layout';
import { useGSAP } from '@gsap/react';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { TbClover, TbCloverFilled } from "react-icons/tb";

gsap.registerPlugin(useGSAP);

function Sparkline({ points, color }: { points: number[]; color: string; }) {
  const w = 80, h = 32, pad = 2;
  const xs = points.map((_, i) => pad + (i / (points.length - 1)) * (w - pad * 2));
  const min = Math.min(...points), max = Math.max(...points);
  const ys = points.map(p => pad + (1 - (p - min) / (max - min || 1)) * (h - pad * 2));
  const poly = xs.map((x, i) => `${x},${ys[i]}`).join(" ");
  const area = xs.map((x, i) => `${x},${ys[i]}`).join(" ") + ` ${xs[xs.length - 1]},${h} ${xs[0]},${h}`;
  const uid = `g${points.join("")}`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <defs>
        <linearGradient id={uid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#${uid})`} />
      <polyline points={poly} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

const LandingPage = () => {
  // const navigate = useNavigate();
  const carouselRef1 = useRef<HTMLDivElement>(null);
  const carouselRef2 = useRef<HTMLDivElement>(null);
  const carouselRef3 = useRef<HTMLDivElement>(null);
  const carouselRefs = [carouselRef1, carouselRef2, carouselRef3];
  const highlightedMarkets = [
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
  const newsStocks = [
    { symbol: "NVDA", up: true },
    { symbol: "GOOG", up: false },
  ];
  const stocks = [
    { ticker: "GUTS", company: "Fractyl Health", target: 6.00, upside: 1176.60, rating: "Strong Buy", price: 0.47, change: -0.005, changePct: -113.8, mcap: "$64.31M", lastRating: "3d ago", behavior: -74.51, spark: [10,14,12,22,26,28,29] },
    { ticker: "TCRX", company: "TScan Therapeutics", target: 6.50, upside: 513.21, rating: "Strong Buy", price: 1.06, change: -0.05, changePct: -450.5, mcap: "$60.15M", lastRating: "3d ago", behavior: 11.34, spark: [22,20,18,16,12,10,8] },
    { ticker: "IMUX", company: "Immunic", target: 5.50, upside: 439.22, rating: "Strong Buy", price: 1.02, change: 0.072, changePct: 762.9, mcap: "$133.07M", lastRating: "3d ago", behavior: 56.44, spark: [24,20,16,12,10,6,4] },
    { ticker: "PRQR", company: "ProQR", target: 8.33, upside: 423.90, rating: "Strong Buy", price: 1.59, change: 0, changePct: 0, mcap: "$167.50M", lastRating: "6d ago", behavior: -18.46, spark: [10,14,18,20,22,24,26] },
    { ticker: "ABEO", company: "Abeona Therapeutics", target: 24.00, upside: 368.75, rating: "Strong Buy", price: 5.12, change: -0.08, changePct: -153.8, mcap: "$277.46M", lastRating: "6d ago", behavior: 12.53, spark: [24,20,16,14,14,12,10] },
    { ticker: "CRDF", company: "Cardiff Oncology", target: 8.00, upside: 312.37, rating: "Strong Buy", price: 1.94, change: -0.02, changePct: -102, mcap: "$132.63M", lastRating: "4d ago", behavior: -4.90, spark: [14,16,14,16,18,17,18] },
    { ticker: "TARA", company: "Protara Therapeutics", target: 25.75, upside: 304.87, rating: "Strong Buy", price: 6.36, change: 0.59, changePct: 1022.5, mcap: "$328.37M", lastRating: "5d ago", behavior: 2.25, spark: [20,18,20,18,16,14,14] },
    { ticker: "ATAI", company: "Atai Biolabs NV", target: 14.00, upside: 285.67, rating: "Strong Buy", price: 3.63, change: -0.10, changePct: -268.1, mcap: "$1.32B", lastRating: "2d ago", behavior: -6.20, spark: [8,12,14,18,20,22,24] },
  ];
  const HEADERS = ["Ticker", "Price", "Change", "3M Behavior", "Analyst Target", "Rating"];

  const [dailyMovers, setDailyMovers] = useState(true);
  const [activeFilter, setActiveFilter] = useState(0);
  const dailyMoversBull = [
    { symbol: "NVDA", change: 100 },
    { symbol: "GOOG", change: 80 },
    { symbol: "AAPL", change: 65 },
    { symbol: "MSFT", change: 50 },
    { symbol: "TSLA", change: 35 },
  ];
  const dailyMoversBear = [
    { symbol: "META", change: 90 },
    { symbol: "AMZN", change: 70 },
    { symbol: "NFLX", change: 55 },
    { symbol: "UBER", change: 40 },
    { symbol: "SNAP", change: 25 },
  ];
  const dailyMoversStocks = dailyMovers ? dailyMoversBull : dailyMoversBear;
  const maxChange = Math.max(...dailyMoversStocks.map(s => s.change));
  const bigMoversSelection = ["Portfolio", "Stock", "Crypto", "ETF"];

  const newsItems = [
    {
      id: 1,
      title: "Nvidia Surges Past Expectations in Q4 Earnings Report",
      excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel sapien eget nunc bibendum commodo. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel sapien eget nunc bibendum commodo.",
      sector: "Technology",
      date: "11 January 2026",
      image: "/stub.png",
    },
    {
      id: 2,
      title: "Google Faces New Antitrust Scrutiny From EU Regulators",
      excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel sapien eget nunc bibendum commodo. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel sapien eget nunc bibendum commodo.",
      sector: "Technology",
      date: "11 January 2026",
      image: "/stub.png",
    },
    {
      id: 3,
      title: "AI Chip Demand Drives Record Revenue Across Semiconductor Sector",
      excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel sapien eget nunc bibendum commodo. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel sapien eget nunc bibendum commodo.",
      sector: "Technology",
      date: "11 January 2026",
      image: "/stub.png",
    },
  ];
  const [saved, setSaved] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement;
    if (favicon) {
      favicon.href = '/Logo.png';
    }
    document.title = 'BlackVaultz';
  }, []);

  useGSAP(() => {
    for (let i = 0; i < 3; i++) {
      gsap.fromTo(
        carouselRefs[i].current,
        { xPercent: 0 },
        { xPercent: -100, duration: 30, ease: 'none', repeat: -1 }
      );
    }
  });

  const headerButtons = (
    <div className='flex items-center justify-center gap-4 w-13 h-13'>
      <button
        // onClick={() => navigate('/login')}
        className='text-white font-normal px-1 py-1'
      >
        <RiAccountCircle2Line className='h-12 w-12 hover:h-13 hover:w-13'/>
      </button>
    </div>
  );

  return (
    <Layout headerRight={headerButtons}>
      {/* Main Content */}
      <section className='container flex flex-col max-w-screen flex-grow'>
        {/* Market Highlight */}
        <div className='flex width-100vw overflow-hidden py-3 border-y-2 border-[#3d4243]'>
          {carouselRefs.map((ref, i) => (
            <div className='flex pr-2 gap-2' ref={ref} key={i}>
              {highlightedMarkets.map((market, index) => (
                <div key={index} className='flex flex-row text-sm font-bold h-5 items-center justify-center gap-2 pr-4 border-r-2 border-[#3d4243]'>
                  <h1 className='text-white'>
                    {market.name}
                  </h1>
                  <h1 className='text-white'>
                    {market.price}
                  </h1>
                  <h1 className={`${
                    market.change.startsWith('+') ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {market.change}
                  </h1>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className='flex p-3 gap-4'>
          {/* Today's Big Movers */}
          <div className="p-3 w-full max-w-lg">
            {/* Subheader row */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white text-3xl font-bold">
                {dailyMovers ? "Top Bulls" : "Top Bears"}
              </h2>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setDailyMovers(false)}
                  className={`p-1.5 rounded-lg transition-all duration-200 ${!dailyMovers ? "" : "opacity-40 hover:opacity-70"}`}
                >
                  <span className="text-red-500 text-xl">↓</span>
                </button>
                <button
                  onClick={() => setDailyMovers(true)}
                  className={`p-1.5 rounded-lg transition-all duration-200 ${dailyMovers ? "" : "opacity-40 hover:opacity-70"}`}
                >
                  <span className="text-green-500 text-xl">↑</span>
                </button>
              </div>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-1 mb-5 border-b border-neutral-800 pb-3">
              {bigMoversSelection.map((title, i) => (
                <button
                  key={i}
                  onClick={() => setActiveFilter(i)}
                  className={`px-3 py-1 text-sm rounded-md transition-all duration-150 ${
                    activeFilter === i
                      ? "bg-neutral-800 text-white font-medium"
                      : "text-neutral-500 hover:text-neutral-300"
                  }`}
                >
                  {title}
                </button>
              ))}
            </div>

            {/* Stock rows */}
            <div className="flex flex-col gap-1">
              {dailyMoversStocks.map((stock, i) => {
                const barWidth = (stock.change / maxChange) * 100;
                const isBull = dailyMovers;

                return (
                  <div key={i} className="flex items-center gap-3 py-2.5 px-2 rounded-xl hover:bg-neutral-900 transition-colors duration-150">
                    {/* Icon */}
                    <img
                      src="/Logo.png"
                      alt=""
                      className="w-6 h-6 rounded-md object-cover shrink-0 opacity-70"
                    />

                    {/* Symbol */}
                    <span className="text-white font-bold text-sm w-14 shrink-0">{stock.symbol}</span>

                    {/* Bar */}
                    <div className="flex-1 h-2.5 bg-neutral-900 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${isBull ? "bg-green-500" : "bg-red-500"}`}
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>

                    {/* Percentage */}
                    <span className={`text-sm font-semibold w-14 text-right shrink-0 ${isBull ? "text-green-400" : "text-red-400"}`}>
                      {isBull ? "+" : "-"}{stock.change}%
                    </span>
                  </div>
                );
              })}
            </div>

          </div>
          {/* Analysis */}
          <div className='flex flex-col p-3 w-full justify-left gap-3'>
            <h1 className='text-white font-bold text-3xl'>
              Trending Analysis
            </h1>
            <div className="border border-neutral-900 rounded overflow-hidden">
              <div className="max-h-[340px] overflow-y-auto scrollbar-dark">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-neutral-950">
                      {HEADERS.map(h => (
                        <th
                          key={h}
                          className={`font-mono text-xs font-normal tracking-widest uppercase text-neutral-600 px-5 py-3 border-b border-neutral-800 whitespace-nowrap ${h === "Ticker" ? "text-left" : h === "Rating" ? "text-center" : "text-right"}`}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {stocks.map((s, i) => {
                      const up = s.behavior >= 0;
                      const chgUp = s.change > 0;
                      const chgDown = s.change < 0;
                      const chgClass = chgUp ? "text-emerald-400" : chgDown ? "text-red-400" : "text-neutral-500";
                      const behaviorClass = up ? "text-emerald-400" : "text-red-400";
                      const isLast = i === stocks.length - 1;

                      return (
                        <tr
                          key={s.ticker}
                          className={`transition-colors duration-150 cursor-default hover:bg-neutral-900`}
                        >
                          {/* Ticker */}
                          <td className={`px-5 py-2 ${!isLast ? "border-b border-neutral-900" : ""}`}>
                            <div className="flex flex-col gap-0.5">
                              <span className="font-mono text-sm font-bold text-blue-400 tracking-wide">{s.ticker}</span>
                              <span className="text-xs text-neutral-500 truncate max-w-36">{s.company}</span>
                            </div>
                          </td>

                          {/* Price */}
                          <td className={`px-5 text-right font-mono text-sm font-bold text-gray-100 ${!isLast ? "border-b border-neutral-900" : ""}`}>
                            ${s.price.toFixed(2)}
                          </td>

                          {/* Change */}
                          <td className={`px-5 text-right ${!isLast ? "border-b border-neutral-900" : ""}`}>
                            <div className="flex flex-col items-end gap-0.5">
                              <span className={`font-mono text-xs font-bold ${chgClass}`}>
                                {s.change === 0 ? "—" : `${chgUp ? "▲" : "▼"} ${Math.abs(s.change).toFixed(3)}`}
                              </span>
                              <span className={`text-xs opacity-70 ${chgClass}`}>
                                {s.changePct === 0 ? "—" : `${Math.abs(s.changePct).toFixed(1)}%`}
                              </span>
                            </div>
                          </td>

                          {/* 3M Behavior */}
                          <td className={`px-5 text-right ${!isLast ? "border-b border-neutral-900" : ""}`}>
                            <div className="flex items-center justify-end gap-2.5">
                              <Sparkline points={s.spark} color={up ? "#34d399" : "#f87171"} />
                              <span className={`font-mono text-xs font-bold w-16 text-right ${behaviorClass}`}>
                                {up ? "▲" : "▼"} {Math.abs(s.behavior).toFixed(2)}%
                              </span>
                            </div>
                          </td>

                          {/* Analyst Target */}
                          <td className={`px-5 text-right ${!isLast ? "border-b border-neutral-900" : ""}`}>
                            <div className="flex flex-col items-end gap-0.5">
                              <span className="font-mono text-sm font-bold text-yellow-400">${s.target.toFixed(2)}</span>
                              <span className="text-xs text-emerald-400">↑ {s.upside.toFixed(2)}% upside</span>
                            </div>
                          </td>

                          {/* Rating */}
                          <td className={`px-5 text-center ${!isLast ? "border-b border-neutral-900" : ""}`}>
                            <span className="inline-flex items-center gap-1.5 bg-emerald-950 border border-emerald-900 text-emerald-400 font-mono text-xs tracking-widest px-2.5 py-1 rounded-sm whitespace-nowrap">
                              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full shrink-0" />
                              STRONG BUY
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className='flex p-3 gap-4'>
          {/* Today's News */}
          <div className="p-3 w-full max-w-2xl">
            {/* Title */}
            <div className="flex items-baseline justify-between mb-6">
              <h1 className="text-white text-3xl font-bold tracking-tight">Today's News</h1>
              <span className="text-neutral-600 text-xs font-mono tracking-widest uppercase">{newsItems.length} articles</span>
            </div>

            {/* Cards */}
            <div className="flex flex-col gap-3">
              {newsItems.map((item) => (
                <div
                  key={item.id}
                  className="group flex gap-0 bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden hover:border-neutral-600 hover:bg-neutral-900 transition-all duration-200 cursor-pointer"
                >
                  {/* Image */}
                  <div className="w-36 shrink-0 overflow-hidden">
                    <img
                      src={item.image}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 p-4 gap-2 min-w-0">

                    {/* Top row */}
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-white font-semibold text-sm leading-snug line-clamp-2">{item.title}</h2>
                      <button
                        onClick={(e) => { e.stopPropagation(); setSaved(prev => ({ ...prev, [item.id]: !prev[item.id] })); }}
                        className="shrink-0 mt-0.5 text-blue-500 hover:scale-125 transition-transform duration-150 text-lg"
                      >
                        {saved[item.id] ? "♣" : "♧"}
                      </button>
                    </div>

                    {/* Excerpt */}
                    <p className="text-neutral-400 text-xs leading-relaxed line-clamp-2">{item.excerpt}</p>

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-auto pt-1 border-t border-neutral-800">
                      <span className="text-neutral-500 text-xs">
                        <span className="text-neutral-600">Sector </span>
                        <span className="text-neutral-300 font-medium">{item.sector}</span>
                      </span>

                      <span className="text-xs text-neutral-500">
                        <span className="text-neutral-600">Stocks </span>
                        {newsStocks.map((stock, i) => (
                          <span key={stock.symbol} className={stock.up ? "text-emerald-400 font-medium" : "text-red-400 font-medium"}>
                            {stock.symbol}{i < newsStocks.length - 1 ? ", " : ""}
                          </span>
                        ))}
                      </span>

                      <span className="text-neutral-600 text-xs">{item.date}</span>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className='flex flex-col p-3 w-1/2'>
            <h1 className='text-white font-bold text-3xl'>
              ?????
            </h1>  
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default LandingPage;
