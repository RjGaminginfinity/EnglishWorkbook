/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { Search, Gamepad2, Maximize2, ChevronLeft, LayoutGrid, Trophy, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import gamesData from './games.json';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeGame, setActiveGame] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const categories = ['All', ...Array.from(new Set(gamesData.map(g => g.category)))];

  const filteredGames = useMemo(() => {
    return gamesData.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || game.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 glass-panel border-b border-zinc-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => { setActiveGame(null); setSelectedCategory('All'); }}
          >
            <div className="p-2 bg-neon-green rounded-lg group-hover:rotate-12 transition-transform">
              <Gamepad2 className="w-6 h-6 text-black" />
            </div>
            <h1 className="text-2xl font-bold tracking-tighter italic">
              UNBLOCKED<span className="text-neon-green">ARCADE</span>
            </h1>
          </div>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search games..."
              className="w-full bg-zinc-800/50 border border-zinc-700 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:border-neon-green transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-zinc-400">
            <button className="hover:text-neon-green transition-colors flex items-center gap-2">
              <Flame className="w-4 h-4" /> Trending
            </button>
            <button className="hover:text-neon-green transition-colors flex items-center gap-2">
              <Trophy className="w-4 h-4" /> High Scores
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full p-6">
        <AnimatePresence mode="wait">
          {!activeGame ? (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Categories */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? 'bg-neon-green text-black'
                        : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Hero Section (Optional) */}
              {selectedCategory === 'All' && !searchQuery && (
                <div className="relative h-64 rounded-2xl overflow-hidden group">
                  <img 
                    src="https://picsum.photos/seed/arcade/1200/400" 
                    className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
                  <div className="absolute bottom-8 left-8">
                    <span className="bg-neon-pink text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest mb-2 inline-block">
                      Featured Game
                    </span>
                    <h2 className="text-4xl font-bold mb-2">Slope Runner</h2>
                    <p className="text-zinc-400 max-w-md">Master the gravity-defying tracks in this high-speed neon adventure.</p>
                  </div>
                </div>
              )}

              {/* Game Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredGames.map((game, index) => (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="group cursor-pointer"
                    onClick={() => setActiveGame(game)}
                  >
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3 border border-zinc-800 game-card-glow transition-all">
                      <img
                        src={game.thumbnail}
                        alt={game.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-12 h-12 bg-neon-green rounded-full flex items-center justify-center text-black">
                          <Gamepad2 className="w-6 h-6" />
                        </div>
                      </div>
                      <div className="absolute top-2 right-2">
                        <span className="bg-zinc-900/80 backdrop-blur-sm text-[10px] font-bold px-2 py-1 rounded border border-zinc-700 text-zinc-300 uppercase">
                          {game.category}
                        </span>
                      </div>
                    </div>
                    <h3 className="font-bold text-zinc-200 group-hover:text-neon-green transition-colors truncate">
                      {game.title}
                    </h3>
                  </motion.div>
                ))}
              </div>

              {filteredGames.length === 0 && (
                <div className="text-center py-20">
                  <LayoutGrid className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                  <p className="text-zinc-500">No games found matching your search.</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="player"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col h-[calc(100vh-12rem)]"
            >
              <div className="flex items-center justify-between mb-4">
                <button 
                  onClick={() => setActiveGame(null)}
                  className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group"
                >
                  <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  Back to Arcade
                </button>
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-bold text-neon-green">{activeGame.title}</h2>
                  <button 
                    onClick={toggleFullscreen}
                    className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
                    title="Fullscreen"
                  >
                    <Maximize2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 bg-black rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl relative">
                <iframe
                  src={activeGame.iframeUrl}
                  className="w-full h-full border-none"
                  allow="autoplay; fullscreen; keyboard"
                  title={activeGame.title}
                />
              </div>

              <div className="mt-6 glass-panel p-6 rounded-2xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-zinc-800 text-zinc-400 text-[10px] font-bold rounded uppercase">
                        {activeGame.category}
                      </span>
                    </div>
                    <p className="text-zinc-400 leading-relaxed max-w-2xl">
                      {activeGame.description}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-medium transition-colors">
                      Share
                    </button>
                    <button className="px-6 py-2 bg-neon-green text-black rounded-xl font-bold hover:opacity-90 transition-opacity">
                      Favorite
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-auto border-t border-zinc-900 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-zinc-600 text-sm">
          <p>© 2026 Unblocked Arcade. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-zinc-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-zinc-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-zinc-400 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
