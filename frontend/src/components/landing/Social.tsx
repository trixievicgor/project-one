import { useState } from "react";

type EmbedCard = { source: string; handle: string; text: string; time: string };
type Comment = { user: string; text: string };
type Post = {
  id: number; user: string; time: string; title: string; body: string;
  embed?: EmbedCard; commentPreview?: Comment;
  upvotes: number; comments: number; community: string;
};
type Community = { id: number; name: string; members: string; emoji: string; joined: boolean };

const posts: Post[] = [
  {
    id: 1, user: "S1LVERqn", time: "3h", title: "Oil price jumps", body: "",
    embed: {
      source: "Visegrád 24", handle: "@visegrad24",
      text: "BREAKING:\n\nBrent oil just started trading at +13% following this weekend's US-Israeli operations against Iran.\n\nThe price is now up to $82 a barrel.",
      time: "Today 10:30",
    },
    commentPreview: { user: "Tony2025", text: "Brent oil is not yet open to trade??" },
    upvotes: 1, comments: 5, community: "News",
  },
  {
    id: 2, user: "MrBrown", time: "2d", title: "End of week update",
    body: "Another up and down week but we carry on and April is soon upon us. How was your week? Markets have been volatile but there are opportunities if you know where to look.",
    upvotes: 157, comments: 1200, community: "Growth & Gains",
  },
  {
    id: 3, user: "AlphaTrader", time: "5h", title: "NVDA breaking resistance levels",
    body: "Looking at the chart, NVDA has been testing the $900 resistance three times now. A breakout seems imminent. Volume is confirming the move — watching closely for a close above.",
    commentPreview: { user: "JordanHull", text: "Agreed, RSI is also showing strength here" },
    upvotes: 89, comments: 412, community: "Technical Analysis",
  },
];

const trending: Community[] = [
  { id: 1, name: "Silver", members: "13.5K", emoji: "🥈", joined: false },
  { id: 2, name: "Nvidia", members: "180K", emoji: "💚", joined: true },
  { id: 3, name: "Gold", members: "41.1K", emoji: "🥇", joined: false },
  { id: 4, name: "News", members: "922K", emoji: "📰", joined: true },
  { id: 5, name: "Datavault", members: "7.3K", emoji: "🔵", joined: false },
  { id: 6, name: "Off-topic", members: "40.6K", emoji: "🍺", joined: false },
];

const popular: Community[] = [
  { id: 7, name: "Dividends", members: "776K", emoji: "💧", joined: false },
  { id: 8, name: "Memes", members: "609K", emoji: "🐸", joined: false },
  { id: 9, name: "Day Trading", members: "256K", emoji: "📅", joined: true },
  { id: 10, name: "Tesla", members: "656K", emoji: "🔴", joined: false },
  { id: 11, name: "Penny Stocks", members: "291K", emoji: "🪙", joined: false },
  { id: 12, name: "Rolls-Royce", members: "212K", emoji: "🏎️", joined: false },
];

const newCommunities: Community[] = [
  { id: 13, name: "AI Stocks", members: "4.2K", emoji: "🤖", joined: false },
  { id: 14, name: "Biotech", members: "1.8K", emoji: "🧬", joined: false },
  { id: 15, name: "Crypto Bears", members: "3.1K", emoji: "🐻", joined: false },
  { id: 16, name: "ETF Hub", members: "9.4K", emoji: "📊", joined: false },
  { id: 17, name: "Emerging Markets", members: "5.7K", emoji: "🌍", joined: false },
  { id: 18, name: "Options Flow", members: "2.3K", emoji: "⚡", joined: false },
];

const tabs = ["Feed", "Communities"];

function Avatar({ name }: { name: string }) {
  const colors = ["bg-blue-900", "bg-emerald-900", "bg-purple-900", "bg-yellow-900", "bg-rose-900"];
  const color = colors[name.charCodeAt(0) % colors.length];
  return (
    <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center shrink-0`}>
      <span className="text-xs font-bold text-white font-mono">{name.slice(0, 2).toUpperCase()}</span>
    </div>
  );
}

function formatCount(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);
}

function CommunityGrid({ items, joined, onToggle }: { items: Community[]; joined: Record<number, boolean>; onToggle: (id: number) => void }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {items.map(c => {
        const isJoined = joined[c.id] ?? c.joined;
        return (
          <div key={c.id} className="flex items-center gap-3 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-3 hover:border-neutral-700 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-neutral-800 flex items-center justify-center text-base shrink-0">{c.emoji}</div>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-xs font-semibold text-white truncate">{c.name}</span>
              <span className="text-xs text-neutral-600">{c.members} members</span>
            </div>
            <button
              onClick={() => onToggle(c.id)}
              className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 transition-all ${
                isJoined
                  ? "bg-neutral-800 text-neutral-400 border border-neutral-700"
                  : "bg-blue-600 hover:bg-blue-500 text-white"
              }`}
            >
              {isJoined ? "✓" : "Join"}
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default function Social() {
  const [activeTab, setActiveTab] = useState("Feed");
  const [liked, setLiked] = useState<Record<number, boolean>>({});
  const [followed, setFollowed] = useState<Record<number, boolean>>({});
  const [communityJoined, setCommunityJoined] = useState<Record<number, boolean>>({});
  const [search, setSearch] = useState("");

  const toggleCommunity = (id: number) =>
    setCommunityJoined(prev => ({ ...prev, [id]: !(prev[id] ?? [...trending, ...popular, ...newCommunities].find(c => c.id === id)?.joined) }));

  return (
    <div className="bg-black text-white w-full p-3 flex flex-col gap-5">

      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-3xl font-bold tracking-tight shrink-0">Social</h1>
        <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 flex-1">
          <span className="text-neutral-500 text-xs">🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search people, communities..."
            className="bg-transparent text-xs text-white placeholder-neutral-600 outline-none flex-1"
          />
        </div>
        <button className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 hover:bg-neutral-700 transition-colors shrink-0">
          ✏️
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-800">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 text-sm font-medium transition-colors relative rounded-t-lg hover:bg-neutral-900 ${activeTab === tab ? "text-white" : "text-neutral-500 hover:text-neutral-300"}`}
          >
            {tab}
            {activeTab === tab && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-t" />}
          </button>
        ))}
      </div>

      {/* ── FEED TAB ── */}
      {activeTab === "Feed" && (
        <>
          <div className="flex flex-col gap-3">
            {posts.map(post => (
              <div key={post.id} className="bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden hover:border-neutral-700 transition-colors">

                <div className="flex items-center justify-between px-4 pt-4">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={post.user} />
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-white leading-tight">{post.user}</span>
                      <span className="text-xs text-blue-400">{post.community}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-600">{post.time}</span>
                    <button className="text-neutral-600 hover:text-neutral-400 text-sm px-1">•••</button>
                  </div>
                </div>

                <div className="px-4 pt-3 flex flex-col gap-1">
                  {post.title && <h2 className="text-sm font-semibold text-white">{post.title}</h2>}
                  {post.body && <p className="text-xs text-neutral-400 leading-relaxed">{post.body}</p>}
                </div>

                {post.embed && (
                  <div className="mx-4 mt-3 border border-neutral-800 rounded-lg bg-neutral-900">
                    <div className="flex items-start justify-between px-3 pt-3 pb-1">
                      <div>
                        <span className="text-xs font-semibold text-white">{post.embed.source}</span>
                        <span className="text-xs text-neutral-500 ml-1">{post.embed.handle}</span>
                      </div>
                      <span className="text-neutral-500 text-xs">✕</span>
                    </div>
                    <p className="px-3 pb-3 text-xs text-neutral-300 leading-relaxed whitespace-pre-line">{post.embed.text}</p>
                    <div className="px-3 pb-2 text-xs text-neutral-600">✕ | {post.embed.time}</div>
                  </div>
                )}

                <div className="flex items-center justify-between px-4 py-3 mt-1">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setLiked(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1 transition-colors ${liked[post.id] ? "bg-rose-950 border border-rose-800" : "bg-neutral-800 hover:bg-neutral-700"}`}
                    >
                      <span className={`text-xs ${liked[post.id] ? "text-rose-400" : "text-neutral-400"}`}>{liked[post.id] ? "♥" : "♡"}</span>
                      <span className={`text-xs ${liked[post.id] ? "text-rose-400" : "text-neutral-300"}`}>{post.upvotes + (liked[post.id] ? 1 : 0)}</span>
                    </button>
                    <button className="flex items-center gap-1.5 bg-neutral-800 hover:bg-neutral-700 transition-colors rounded-full px-3 py-1">
                      <span className="text-xs text-neutral-400">💬</span>
                      <span className="text-xs text-neutral-300">{formatCount(post.comments)}</span>
                    </button>
                    <button className="flex items-center gap-1.5 bg-neutral-800 hover:bg-neutral-700 transition-colors rounded-full px-3 py-1">
                      <span className="text-xs text-neutral-400">↗</span>
                    </button>
                  </div>
                  <button
                    onClick={() => setFollowed(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                    className={`text-xs px-3 py-1 rounded-full border transition-all ${followed[post.id] ? "border-neutral-700 text-neutral-500" : "border-neutral-600 text-white bg-neutral-800 hover:bg-neutral-700"}`}
                  >
                    {followed[post.id] ? "Following" : "Follow"}
                  </button>
                </div>

                {post.commentPreview && (
                  <div className="px-4 pb-3 border-t border-neutral-800 pt-2">
                    <p className="text-xs text-neutral-500">
                      <span className="text-neutral-300 font-semibold">{post.commentPreview.user}:</span>{" "}
                      {post.commentPreview.text}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── COMMUNITIES TAB ── */}
      {activeTab === "Communities" && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>⚡</span>
                <span className="text-sm font-semibold text-neutral-200">Trending</span>
              </div>
              <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-mono tracking-wide">View all</button>
            </div>
            <CommunityGrid items={trending.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))} joined={communityJoined} onToggle={toggleCommunity} />
          </div>

          {/* Popular */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>🔥</span>
                <span className="text-sm font-semibold text-neutral-200">Popular</span>
              </div>
              <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-mono tracking-wide">View all</button>
            </div>
            <CommunityGrid items={popular.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))} joined={communityJoined} onToggle={toggleCommunity} />
          </div>

          {/* New */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>✨</span>
                <span className="text-sm font-semibold text-neutral-200">New communities</span>
              </div>
              <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-mono tracking-wide">View all</button>
            </div>
            <CommunityGrid items={newCommunities.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))} joined={communityJoined} onToggle={toggleCommunity} />
          </div>

        </div>
      )}

    </div>
  );
}