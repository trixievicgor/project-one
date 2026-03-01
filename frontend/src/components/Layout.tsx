import { useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
  headerRight?: React.ReactNode;
}

const Layout = ({ children, headerRight }: LayoutProps) => {
  const password = 'trixie';
  const [maintenence, setMaintenence] = useState(true);
  const [input, setInput] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (input === password) {
      setMaintenence(false);
    }
  };
  return (
    <div className='relative min-h-screen overflow-hidden bg-black'>
      {/* Maintenence Notice */}
      {maintenence && <div className='fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/30 text-white text-center px-6'>
        <p className='absolute text-[17rem] font-bold text-white/30 select-none pointer-events-none -z-10'>
          BlackVaultz
        </p>
        <p className='font-semibold text-5xl block'>
          BlackVaultz is Currently Under Construction
        </p>
        <p className='font-semibold text-2xl block mt-4'>
          Launching 1st January 2027
        </p>
        <form onSubmit={handleSubmit} className='mt-8'>
          <input
            type='password'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className='px-4 py-2 rounded-md bg-[#3d4243]/20 border-2 border-transparent hover:bg-[#3d4243]/90 hover:border-white transition-all'
            placeholder='Enter password'
          />
        </form>
      </div>}

      {/* Main Page */}
      <div
        inert={maintenence}
        className={`flex flex-col min-h-screen bg-black ${
          maintenence ? 'blur-[10px]' : ''
        }`}
      >
        {/* Shared Header */}
        <nav className='w-full p-1 flex justify-between items-center'>
          <button
            // onClick={() => navigate('/')}
            className='flex items-center justify-center overflow-hidden cursor-pointer'
          >
            <img src={'/BlackVaultzLogo.png'} alt='Logo' className='h-15' />
          </button>
          {headerRight}
        </nav>

        {/* Page Content */}
        <main className='flex flex-col flex-grow items-center'>
          {children}
        </main>

        {/* Footer */}
        <footer className='w-full bg-black py-8 border-t-2 border-[#3d4243]'>
          <div className='text-center text-gray-400'>
            <p>© 2026 MarketVision. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;