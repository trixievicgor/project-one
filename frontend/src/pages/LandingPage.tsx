// import { useNavigate } from 'react-router-dom';
import { RiAccountCircle2Line } from 'react-icons/ri';
import Layout from '../components/Layout';
import { useGSAP } from '@gsap/react';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { IoTrendingDown, IoTrendingUp } from 'react-icons/io5';
import { TbClover, TbCloverFilled } from "react-icons/tb";

gsap.registerPlugin(useGSAP);

const LandingPage = () => {
  // const navigate = useNavigate();
  const [dailyMovers, setDailyMovers] = useState(true);
  const [saveNews, setSaveNews] = useState(false);
  const carouselRef1 = useRef<HTMLDivElement>(null);
  const carouselRef2 = useRef<HTMLDivElement>(null);
  const carouselRef3 = useRef<HTMLDivElement>(null);
  const carouselRefs = [carouselRef1, carouselRef2, carouselRef3];
  const bigMoversSelection = ['Portfolio', 'Stock', 'Crypto', 'ETF'];
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
  const stocks = [
    { symbol: "NVDA", up: true },
    { symbol: "GOOG", up: false },
  ];

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
      <section className='container flex flex-col max-w-screen flex-grow divide-y-2 divide-[#3d4243]'>
        {/* Market Highlight */}
        <div className='flex width-100vw overflow-hidden py-3'>
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
        <div className='flex p-3 divide-x-2 divide-[#3d4243] gap-4'>
          {/* Today's Big Movers */}
          <div className='px-3 flex flex-col w-2/5 justify-left'>
            <h1 className='font-bold text-3xl'>Daily Movers</h1>
            <div className='flex flex-row items-center justify-between pt-3'>
              <h1 className='py-3 font-bold text-2xl'>{dailyMovers ? 'Top Bulls' : 'Top Bears'}</h1>
              <div className='flex gap-2 transition-all text-4xl'>
                <button
                  onClick={() => setDailyMovers(false)}
                  className={`${!dailyMovers ? 'opacity-100' : 'opacity-50'} hover:opacity-100 hover:scale-110`}
                >
                  <IoTrendingDown className='text-red-500' />
                </button>
                <button
                  onClick={() => setDailyMovers(true)}
                  className={`${dailyMovers ? 'opacity-100' : 'opacity-50'} hover:opacity-100 hover:scale-110`}
                >
                  <IoTrendingUp className='text-green-500' />
                </button>
              </div>
            </div>
              <div className='flex divide-x-2 divide-[#3d4243]'>
                {bigMoversSelection.map((title, index) => (
                  <div key={index} className='flex px-1'>
                    <button
                      className='w-25 py-1 text-white text-sm hover:font-bold hover:bg-[#2a2e30] hover:rounded-xl transition-all'
                    >
                      {title}
                    </button>
                  </div>
                ))}
              </div>
              <div className='py-5'>
                NVDA
              </div>
          </div>
          {/* Analysis */}
          <div className='flex flex-col w-3/5 justify-left'>
            <h1 className='text-white font-bold text-3xl'>
              Trending Analysis
            </h1>
          </div>
        </div>
        <div className='flex p-3 divide-x-2 divide-[#3d4243] gap-4'>
          {/* Today's News */}
          <div className='flex flex-col p-3 w-1/2'>
            {/* MAKE TITLE BUTTON - DIRECTED TO NEWS PAGE */}
            <h1 className='text-white font-bold text-3xl'>
              Today's News
            </h1>
            <div className='flex flex-col w-full pt-6 gap-3'>
              {/* News Card - MAKE IT BUTTON DIRECTED TO INDIVIDUAL NEW PAGE*/}
              <div className='flex border-2 border-[#3d4243] rounded-md overflow-hidden gap-2 bg-[#1e1e1e] items-center hover:scale-101'>
                {/* Image */}
                <img src='/stub.png' alt="" className="h-30 w-30 object-cover p-2 rounded-lg" />
                {/* Content */}
                <div className='flex flex-col flex-1 justify-between p-2'>
                  <div>
                    <div className='flex justify-between items-center'>
                      <h1 className='text-lg'>
                        Lorem Ipsum
                      </h1>
                      <button onClick={() => setSaveNews(prev => !prev)}>
                        {saveNews ? (
                          <TbCloverFilled className='text-blue-500 text-xl hover:scale-125 transition-all' />
                        ) : (
                          <TbClover className='text-blue-500 text-xl hover:scale-125 transition-all' />
                        )}
                      </button>
                    </div>
                    <p className='text-sm mt-1 line-clamp-3'>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel sapien eget nunc bibendum commodo. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel sapien eget nunc bibendum commodo.
                      Lorem ipsum dolor sit amet, consectetur adipis...
                    </p>
                  </div>

                  {/* Bottom info */}
                  <div className='flex text-xs mt-2 justify-between font-bold'>
                    <p className='w-1/3'>Sector: Technology</p>
                    <p className="w-1/3">
                      Stock:{" "}
                      {stocks.map((stock, i) => (
                        <span
                          key={stock.symbol}
                          className={stock.up ? "text-green-500" : "text-red-500"}
                        >
                          {stock.symbol}{i < stocks.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </p>
                    <p className='w-1/3 text-white/70 text-right'>Published 11 January 2026</p>
                  </div>
                </div>
              </div>
              <div className='flex border-2 border-[#3d4243] rounded-md overflow-hidden gap-2 bg-[#1e1e1e] items-center hover:scale-101'>
                {/* Image */}
                <img src='/stub.png' alt="" className="h-30 w-30 object-cover p-2 rounded-lg" />
                {/* Content */}
                <div className='flex flex-col flex-1 justify-between p-2'>
                  <div>
                    <div className='flex justify-between items-center'>
                      <h1 className='text-lg'>
                        Lorem Ipsum
                      </h1>
                      <button onClick={() => setSaveNews(prev => !prev)}>
                        {saveNews ? (
                          <TbCloverFilled className='text-blue-500 text-xl hover:scale-125 transition-all' />
                        ) : (
                          <TbClover className='text-blue-500 text-xl hover:scale-125 transition-all' />
                        )}
                      </button>
                    </div>
                    <p className='text-sm mt-1 line-clamp-3'>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel sapien eget nunc bibendum commodo. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel sapien eget nunc bibendum commodo.
                      Lorem ipsum dolor sit amet, consectetur adipis...
                    </p>
                  </div>

                  {/* Bottom info */}
                  <div className='flex text-xs mt-2 justify-between font-bold'>
                    <p className='w-1/3'>Sector: Technology</p>
                    <p className="w-1/3">
                      Stock:{" "}
                      {stocks.map((stock, i) => (
                        <span
                          key={stock.symbol}
                          className={stock.up ? "text-green-500" : "text-red-500"}
                        >
                          {stock.symbol}{i < stocks.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </p>
                    <p className='w-1/3 text-white/70 text-right'>Published 11 January 2026</p>
                  </div>
                </div>
              </div>
              <div className='flex border-2 border-[#3d4243] rounded-md overflow-hidden gap-2 bg-[#1e1e1e] items-center hover:scale-101'>
                {/* Image */}
                <img src='/stub.png' alt="" className="h-30 w-30 object-cover p-2 rounded-lg" />
                {/* Content */}
                <div className='flex flex-col flex-1 justify-between p-2'>
                  <div>
                    <div className='flex justify-between items-center'>
                      <h1 className='text-lg'>
                        Lorem Ipsum
                      </h1>
                      <button onClick={() => setSaveNews(prev => !prev)}>
                        {saveNews ? (
                          <TbCloverFilled className='text-blue-500 text-xl hover:scale-125 transition-all' />
                        ) : (
                          <TbClover className='text-blue-500 text-xl hover:scale-125 transition-all' />
                        )}
                      </button>
                    </div>
                    <p className='text-sm mt-1 line-clamp-3'>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel sapien eget nunc bibendum commodo. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel sapien eget nunc bibendum commodo.
                      Lorem ipsum dolor sit amet, consectetur adipis...
                    </p>
                  </div>

                  {/* Bottom info */}
                  <div className='flex text-xs mt-2 justify-between font-bold'>
                    <p className='w-1/3'>Sector: Technology</p>
                    <p className="w-1/3">
                      Stock:{" "}
                      {stocks.map((stock, i) => (
                        <span
                          key={stock.symbol}
                          className={stock.up ? "text-green-500" : "text-red-500"}
                        >
                          {stock.symbol}{i < stocks.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </p>
                    <p className='w-1/3 text-white/70 text-right'>Published 11 January 2026</p>
                  </div>
                </div>
              </div>
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
