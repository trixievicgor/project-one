import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  headerRight?: React.ReactNode;
}

type SearchState = 'idle' | 'loading' | 'not-found' | 'error';

const Layout = ({ children, headerRight }: LayoutProps) => {
  const password  = 'trixie';
  const navigate  = useNavigate();

  const [maintenence, setMaintenence] = useState(true);
  const [input, setInput]             = useState('');
  const [search, setSearch]           = useState('');
  const [searchState, setSearchState] = useState<SearchState>('idle');
  const [notFoundSym, setNotFoundSym] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === password) setMaintenence(false);
  };

  const handleSearchKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;

    const symbol = search.trim().toUpperCase();
    if (!symbol) return;

    setSearchState('loading');
    setNotFoundSym('');

    try {
      const res = await fetch(`http://localhost:5001/api/stock/data/${symbol.toLowerCase()}`);

      if (res.ok) {
        const data = await res.json();
        // Confirm the API returned a real quote (not an empty/error body)
        if (data?.symbol || data?.shortName || data?.regularMarketPrice) {
          setSearch('');
          setSearchState('idle');
          navigate(`/${symbol}`);
        } else {
          setNotFoundSym(symbol);
          setSearchState('not-found');
          setSearch('');
        }
      } else {
        // Any non-ok response (404, 400, 500, etc.) = symbol not found
        setNotFoundSym(symbol);
        setSearchState('not-found');
        setSearch('');
      }
    } catch {
      setNotFoundSym(symbol);
      setSearchState('not-found');
      setSearch('');
    }
  };

  // Clear error/not-found as soon as the user starts typing again
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    if (searchState !== 'idle') setSearchState('idle');
  };

  const borderClass =
    searchState === 'not-found' || searchState === 'error'
      ? 'border-red-500/60'
      : 'border-neutral-800';

  const placeholder =
    searchState === 'not-found'
      ? `Couldn't find "${notFoundSym}" — try another symbol`
      : searchState === 'error'
      ? 'Something went wrong — please try again'
      : 'Search Stock, ETF, Crypto, etc by Symbol (e.g., NVDA, AAPL, BTC, VOOG)';

  const placeholderColor =
    searchState === 'not-found' || searchState === 'error'
      ? 'placeholder-red-400/70'
      : 'placeholder-neutral-600';

  return (
    <div className='relative min-h-screen overflow-hidden bg-black'>
      {/* Maintenance Notice */}
      {maintenence && (
        <div className='fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/30 text-white text-center px-6'>
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
        </div>
      )}

      {/* Main Page */}
      <div
        inert={maintenence}
        className={`flex flex-col min-h-screen bg-black ${maintenence ? 'blur-[10px]' : ''}`}
      >
        {/* Shared Header */}
        <nav className='w-full p-1 flex justify-between items-center'>
          <button
            onClick={() => navigate('/')}
            className='flex items-center justify-center overflow-hidden cursor-pointer'
          >
            <img src={'/BlackVaultzLogo.png'} alt='Logo' className='h-15' />
          </button>

          {/* Search bar */}
          <div className={`flex w-1/2 items-center gap-2 bg-neutral-900 border rounded-xl px-3 py-2 transition-colors ${borderClass}`}>
            {searchState === 'loading' ? (
              <span className="flex gap-0.5 items-center">
                <span className="w-1 h-1 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1 h-1 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '100ms' }} />
                <span className="w-1 h-1 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
              </span>
            ) : (
              <span className={`text-normal ${searchState === 'not-found' || searchState === 'error' ? 'text-red-400/70' : 'text-neutral-500'}`}>
                🔍
              </span>
            )}
            <input
              ref={inputRef}
              value={search}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              disabled={searchState === 'loading'}
              placeholder={placeholder}
              className={`bg-transparent text-sm text-white outline-none flex-1 ${placeholderColor} disabled:opacity-50`}
            />
            {/* Clear button when there's an error state */}
            {(searchState === 'not-found' || searchState === 'error') && (
              <button
                onClick={() => { setSearch(''); setSearchState('idle'); inputRef.current?.focus(); }}
                className="text-red-400/60 hover:text-red-400 text-xs transition ml-1"
              >
                ✕
              </button>
            )}
          </div>

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