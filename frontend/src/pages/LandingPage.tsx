// import { useNavigate } from 'react-router-dom';
import { RiAccountCircle2Line } from 'react-icons/ri';
import Layout from '../components/Layout';
import { useGSAP } from '@gsap/react';
import { useRef } from 'react';
import gsap from 'gsap';

gsap.registerPlugin(useGSAP);

const LandingPage = () => {
  // const navigate = useNavigate();
  const carouselRef1 = useRef<HTMLDivElement>(null);
  const carouselRef2 = useRef<HTMLDivElement>(null);
  const bigMoversSelection = ['Portfolio', 'Stock', 'Crypto', 'ETF'];
  const highlightedMarkets = [
    { name: 'GLD', price: '$1,800.00', change: '+0.5%' },
    { name: 'BTC', price: '$1.00', change: '+0.5%' },
    { name: 'NVDA', price: '$1,80.00', change: '+0.5%' },
    { name: 'MSFT', price: '$1,800.00', change: '+0.5%' },
    { name: 'SPY', price: '$1,800.00', change: '+0.5%' },
    { name: 'QQQ', price: '$1,800.00', change: '+0.5%' },
    { name: 'BND', price: '$1,80.00', change: '+0.5%' },
    { name: 'AAPL', price: '$1,800.00', change: '+0.5%' },
    { name: 'N225', price: '$1,800.00', change: '+0.5%' },
    { name: 'DIA', price: '$1,800.00', change: '+0.5%' },
  ];

  useGSAP(() => {
    gsap.fromTo(
      carouselRef1.current,
      { xPercent: 0 },
      { xPercent: -100, duration: 30, ease: 'none', repeat: -1 }
    );
    gsap.fromTo(
      carouselRef2.current,
      { xPercent: 0 },
      { xPercent: -100, duration: 30, ease: 'none', repeat: -1 }
    );
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
      <section className='container flex flex-col max-w-screen flex-grow divide-y-2 divide-[#3d4243]'>
        {/* Market Highlight */}
        <div className='flex width-100vw overflow-hidden py-3'>
          <div className='flex pr-4 gap-4' ref={carouselRef1}>
            {highlightedMarkets.map((market, index) => (
              <div key={index} className='flex flex-col w-40 h-20 items-start justify-center pr-4 border-r-2 border-[#3d4243]'>
                <h1 className='text-xs font-bold text-white'>
                  {market.name}
                </h1>
                <h1 className='text-lg font-bold text-white'>
                  {market.price}
                </h1>
                <h1 className={`text-xs ${
                  market.change.startsWith('+') ? 'text-green-500' : 'text-red-500'
                }`}>
                  {market.change}
                </h1>
              </div>
            ))}
          </div>
          <div className='flex pr-4 gap-4' ref={carouselRef2}>
            {highlightedMarkets.map((market, index) => (
              <div key={index} className='flex flex-col w-40 h-20 items-start justify-center pr-4 border-r-2 border-[#3d4243]'>
                <h1 className='text-xs font-bold text-white'>
                  {market.name}
                </h1>
                <h1 className='text-lg font-bold text-white'>
                  {market.price}
                </h1>
                <h1 className={`text-xs ${
                  market.change.startsWith('+') ? 'text-green-500' : 'text-red-500'
                }`}>
                  {market.change}
                </h1>
              </div>
            ))}
          </div>
        </div>
        {/* Today's Big Movers, Top Gainers & Top Losers */}
        <div className='flex flex-col p-3'>
          <div className='flex divide-x-2 divide-[#3d4243]'>
            {bigMoversSelection.map((title, index) => (
              <div key={index} className='flex px-3'>
                <button
                  className='w-25 py-1 text-white text-lg hover:font-bold hover:bg-[#2a2e30] hover:rounded-xl transition-all'
                >
                  {title}
                </button>
              </div>
            ))}
          </div>
          <div className='flex divide-x-2 divide-[#3d4243] gap-4 px-3 py-3'>
            <div className='flex w-1/2 justify-left'>
              <h1 className='text-white font-bold text-4xl'>
                Top Gainers
              </h1>
            </div>

            <div className='flex w-1/2 justify-left'>
              <h1 className='text-white font-bold text-4xl'>
                Top Losers
              </h1>
            </div>
          </div>
        </div>
        
        <div className='flex py-3'>
          <h1 className='text-white '>
            hahaha
          </h1>
        </div>
      </section>
    </Layout>
  );
};

export default LandingPage;
