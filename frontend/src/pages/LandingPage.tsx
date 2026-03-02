import { RiAccountCircle2Line } from 'react-icons/ri';
import Layout from '../components/Layout';
import { useGSAP } from '@gsap/react';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { MarketHighlight } from '../components/landing/MarketHighlight';
import type { MarketData } from '../components/landing/MarketHighlight';
import TrendingAnalysis from '../components/landing/TrendingAnalysis';
import NewsSection from '../components/landing/NewsSection';
import TopMovers from '../components/landing/TopMovers';
import Social from '../components/landing/Social';

gsap.registerPlugin(useGSAP);
const TICKERS = ['GLD', 'BTC-USD', 'NVDA', 'AAPL', 'SPY'];

export const LandingPage = () => {
  const carouselRefs = [useRef(null), useRef(null), useRef(null)];
  const [saved, setSaved] = useState<Record<number, boolean>>({});
  const [marketData, setMarketData] = useState<MarketData[]>([]);

  useGSAP(() => {
    carouselRefs.forEach(ref => {
      gsap.fromTo(ref.current, { xPercent: 0 }, { xPercent: -100, duration: 30, ease: 'none', repeat: -1 });
    });
  });

  const toggleSave = (id: number) => {
    setSaved(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const headerButtons = (
    <div className='flex items-center justify-center gap-4'>
      <button className='text-white'><RiAccountCircle2Line className='h-12 w-12 hover:scale-110 transition'/></button>
    </div>
  );

  const fetchAllMarkets = async () => {
    try {
      // Map through tickers and fetch each from your backend
      const requests = TICKERS.map(ticker => 
        fetch(`/api/stock/${ticker}`).then(res => res.json())
      );
      
      const results = await Promise.all(requests);
      // Filter out any errors and update state
      setMarketData(results.filter(item => !item.error));
    } catch (err) {
      console.error("Failed to poll market data:", err);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchAllMarkets();

    // Set up 2-second interval
    const interval = setInterval(fetchAllMarkets, 1000000);

    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <Layout headerRight={headerButtons}>
      <section className="container flex flex-col max-w-screen flex-grow">
        
        <div className="flex w-full overflow-hidden py-3 border-y-2 border-neutral-800">
          {carouselRefs.map((ref, i) => <MarketHighlight key={i} ref={ref} data={marketData} />)}
        </div>

        <div className="flex p-3 gap-4">
          <TopMovers />
          <TrendingAnalysis />
        </div>

        <div className="flex p-3 gap-4">
          <NewsSection saved={saved} onToggleSave={toggleSave} />
          <Social/>
        </div>
      </section>
    </Layout>
  );
};

export default LandingPage;
