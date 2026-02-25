import { useNavigate } from 'react-router-dom';
import { RiAccountCircle2Line } from "react-icons/ri";
import Layout from '../components/Layout';
import { useGSAP } from '@gsap/react';
import { useRef } from 'react';
import gsap from 'gsap';

gsap.registerPlugin(useGSAP);

const LandingPage = () => {
  const navigate = useNavigate();
  const carouselRef1 = useRef<HTMLDivElement>(null);
  const carouselRef2 = useRef<HTMLDivElement>(null);
  const highlightedMarkets = [
    { name: 'GOLD', price: '$1,800.00', change: '+0.5%' },
    { name: 'GOLD', price: '$1.00', change: '+0.5%' },
    { name: 'SHIBALLLL', price: '$1,800.00', change: '+0.5%' },
    { name: 'SHIBALLLL', price: '$1,800.00', change: '+0.5%' },
    { name: 'SHIBALLLL', price: '$1,800.00', change: '+0.5%' },
    { name: 'BHAHBSHBKSABHKAS', price: '$1,800.00', change: '+0.5%' },
    { name: 'BHAHBSHBKSABHKAS', price: '$1,800.00', change: '+0.5%' },
    { name: 'BHAHBSHBKSABHKAS', price: '$1,800.00', change: '+0.5%' },
    { name: 'BHAHBSHBKSABHKAS', price: '$1,800.00', change: '+0.5%' },
    { name: 'BHAHBSHBKSABHKAS', price: '$1,800.00', change: '+0.5%' },
  ];

  useGSAP(() => {
    gsap.fromTo(
      carouselRef1.current,
      { xPercent: 0 },
      { xPercent: -100, duration: 10, ease: 'none', repeat: -1 }
    );
    gsap.fromTo(
      carouselRef2.current,
      { xPercent: 0 },
      { xPercent: -100, duration: 10, ease: 'none', repeat: -1 }
    );
  });
  

  const headerButtons = (
    <div className='flex items-center gap-4'>
      <button
        // onClick={() => navigate('/login')}
        className='text-white px-1 py-1 rounded-xl hover:bg-[#3d4243] font-bold'
      >
        <RiAccountCircle2Line className="h-15 w-15"/>
      </button>
    </div>
  );

  return (
    <Layout headerRight={headerButtons}>
      {/* Main Content */}
      <section className='container flex flex-col max-w-screen flex-grow py-3'>
        {/* Market Highlight */}
        <div className='flex width-100vw overflow-hidden'>
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
      </section>
    </Layout>
  );
};

export default LandingPage;
