export const newsItemsData = [
  { id: 1, title: "Nvidia Surges Past Expectations", excerpt: "Lorem ipsum dolor...", sector: "Technology", date: "11 Jan 2026", image: "/stub.png" },
  { id: 2, title: "Google Faces Antitrust Scrutiny", excerpt: "Lorem ipsum dolor...", sector: "Technology", date: "11 Jan 2026", image: "/stub.png" },
  { id: 3, title: "AI Chip Demand Drives Revenue", excerpt: "Lorem ipsum dolor...", sector: "Technology", date: "11 Jan 2026", image: "/stub.png" },
  { id: 4, title: "AI Chip Demand Drives Revenue", excerpt: "Lorem ipsum dolor...", sector: "Technology", date: "11 Jan 2026", image: "/stub.png" },
  { id: 5, title: "AI Chip Demand Drives Revenue", excerpt: "Lorem ipsum dolor...", sector: "Technology", date: "11 Jan 2026", image: "/stub.png" },
];

export const newsStocksData = [
  { symbol: "NVDA", up: true },
  { symbol: "GOOG", up: false },
];

interface NewsProps {
  saved: Record<number, boolean>;
  onToggleSave: (id: number) => void;
}

export default function NewsSection({ saved, onToggleSave }: NewsProps) {
  return (
    <div className="p-3 w-full max-w-2xl">
      <div className="flex justify-between items-end mb-6">
        <h1 className="text-white text-3xl font-bold">Today's News</h1>
        <span className="text-neutral-600 text-[10px] uppercase">{newsItemsData.length} Articles</span>
      </div>
      <div className="flex flex-col gap-3">
        {newsItemsData.map((item) => (
          <div key={item.id} className="group flex bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden hover:border-neutral-500 transition">
            <div className="w-32 shrink-0 overflow-hidden"><img src={item.image} className="h-full w-full object-cover group-hover:scale-105 transition" alt="" /></div>
            <div className="flex flex-col p-4 flex-1 min-w-0">
              <div className="flex justify-between gap-2">
                <h2 className="text-white font-semibold text-sm line-clamp-2">{item.title}</h2>
                <button onClick={() => onToggleSave(item.id)} className="text-blue-500 text-lg leading-none">
                  {saved[item.id] ? "♣" : "♧"}
                </button>
              </div>
              <p className="text-neutral-500 text-xs line-clamp-2 my-2">{item.excerpt}</p>
              <div className="flex justify-between mt-auto pt-2 border-t border-neutral-900 text-[10px] text-neutral-500">
                <span>Sector <span className="text-neutral-300">{item.sector}</span></span>
                <span>{newsStocksData.map(s => <span key={s.symbol} className={s.up ? "text-emerald-400" : "text-red-400"}>{s.symbol} </span>)}</span>
                <span>{item.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}