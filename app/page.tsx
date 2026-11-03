'use client';

import React, { useEffect, useState } from 'react';
import HeroSection from './components/HeroSection';
import GameCard from './components/GameCard';
import { Trophy, Medal, RefreshCw } from 'lucide-react';

interface ScoreEntry {
  rank: number;
  id: string;
  score: number;
  applesEaten: number;
  starsCollected: number;
  playedAt: string;
  username: string;
}

export default function HomePage() {
  const [leaderboard, setLeaderboard] = useState<ScoreEntry[]>([]);
  const [loadingScores, setLoadingScores] = useState(true);

  const fetchScores = async () => {
    setLoadingScores(true);
    try {
      const res = await fetch('/api/scores?limit=10&game=snake_3d');
      if (res.ok) {
        const data = await res.json();
        setLeaderboard(data.scores || []);
      }
    } catch (e) {
      console.error('Failed to load leaderboard', e);
    } finally {
      setLoadingScores(false);
    }
  };

  useEffect(() => {
    fetchScores();
  }, []);

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <HeroSection />

      {/* Games Catalog Section */}
      <section id="games" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-3">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Featured Games
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Select a game to play instantly with your keyboard or touchscreen.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <GameCard
            id="snake-3d"
            title="Snake 3D"
            genre="Arcade"
            description="The classic arcade favorite rebuilt with smooth 3D visuals, juicy fruits, bonus stars, and real-time score tracking."
            badge="HOT"
            isAvailable={true}
            href="/games/snake-3d"
          />

          <GameCard
            id="space-invaders-3d"
            title="Space Invaders 3D"
            genre="Shooter"
            description="Defend against descending waves of galactic invaders in a modernized 3D arena."
            badge="COMING SOON"
            isAvailable={false}
          />

          <GameCard
            id="retro-pong-3d"
            title="Retro Pong 3D"
            genre="Sports"
            description="High-speed paddle table tennis against intelligent AI opponents with realistic ball physics."
            badge="COMING SOON"
            isAvailable={false}
          />

          <GameCard
            id="cyber-brick-breaker"
            title="Brick Breaker 3D"
            genre="Action"
            description="Smash multi-tiered brick walls with multi-ball powerups and explosive chain reactions."
            badge="COMING SOON"
            isAvailable={false}
          />
        </div>
      </section>

      {/* Global Leaderboards Section */}
      <section id="leaderboard" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-800 bg-[#121522] p-6 md:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Trophy className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  Global Leaderboard
                </h3>
                <p className="text-xs text-slate-400">
                  Top 10 players in Snake 3D
                </p>
              </div>
            </div>

            <button
              onClick={fetchScores}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-all"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loadingScores ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          <div className="mt-4 overflow-x-auto">
            {loadingScores ? (
              <div className="py-12 text-center text-slate-500 text-sm">
                Loading scores...
              </div>
            ) : leaderboard.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <Trophy className="mx-auto h-10 w-10 text-slate-600 mb-2" />
                <p className="text-sm font-medium text-slate-300">No scores recorded yet!</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Play Snake 3D and submit your run to claim the #1 spot.
                </p>
              </div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-xs font-medium text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Rank</th>
                    <th className="py-3 px-4">Player</th>
                    <th className="py-3 px-4">Score</th>
                    <th className="py-3 px-4">Apples</th>
                    <th className="py-3 px-4">Stars</th>
                    <th className="py-3 px-4 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {leaderboard.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="py-3 px-4 font-semibold">
                        {item.rank === 1 && (
                          <span className="inline-flex items-center gap-1 text-amber-400 font-bold">
                            <Medal className="h-4 w-4 fill-current" /> #1
                          </span>
                        )}
                        {item.rank === 2 && (
                          <span className="inline-flex items-center gap-1 text-slate-300 font-bold">
                            <Medal className="h-4 w-4 fill-current" /> #2
                          </span>
                        )}
                        {item.rank === 3 && (
                          <span className="inline-flex items-center gap-1 text-amber-600 font-bold">
                            <Medal className="h-4 w-4 fill-current" /> #3
                          </span>
                        )}
                        {item.rank > 3 && (
                          <span className="text-slate-500">#{item.rank}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-medium text-white">
                        {item.username}
                      </td>
                      <td className="py-3 px-4 text-emerald-400 font-bold">
                        {item.score.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        🍎 {item.applesEaten}
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        ⭐ {item.starsCollected}
                      </td>
                      <td className="py-3 px-4 text-right text-xs text-slate-500">
                        {new Date(item.playedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
