'use client';

import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  Volume2,
  VolumeX,
  Pause,
  Play,
  RotateCcw,
  HelpCircle,
  ArrowLeft,
  Flame,
  Maximize,
  Minimize,
} from 'lucide-react';
import { soundEngine } from '@/lib/audio/soundEngine';
import PostGameModal from './components/PostGameModal';
import type { GameState } from './components/SnakeCanvas';

// Dynamic import with SSR disabled for Three.js canvas
const SnakeCanvas = dynamic(() => import('./components/SnakeCanvas'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-[#0a0c10] text-amber-500 font-mono text-sm uppercase tracking-widest animate-pulse">
      BOOTING MECH VIPER HYDRAULICS...
    </div>
  ),
});

export default function Snake3DGamePage() {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    applesEaten: 0,
    starsCollected: 0,
    speedLevel: 1,
    isPaused: false,
    isGameOver: false,
  });

  const [highScore, setHighScore] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [resetSignal, setResetSignal] = useState(0);

  const [currentUser, setCurrentUser] = useState<{ id: string; username: string } | null>(null);

  // Load user session & local high score
  useEffect(() => {
    const savedHighScore = localStorage.getItem('snake_3d_highscore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }

    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setCurrentUser(data.user);
      })
      .catch(() => {});
  }, []);

  const handleScoreUpdate = useCallback((state: GameState) => {
    setGameState(state);
    setHighScore((prev) => {
      if (state.score > prev) {
        localStorage.setItem('snake_3d_highscore', state.score.toString());
        return state.score;
      }
      return prev;
    });
  }, []);

  const handleGameOver = useCallback((finalState: GameState) => {
    setGameState(finalState);
  }, []);

  const toggleSound = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  };

  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

  const toggleFullscreen = () => {
    if (typeof document === 'undefined') return;
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const restartGame = () => {
    setResetSignal((prev) => prev + 1);
    setIsPaused(false);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 top-[65px] z-10 flex flex-col overflow-hidden bg-[#0a0c10] select-none touch-none">
      {/* Top Industrial Responsive HUD Bar */}
      <div className="absolute top-2 left-2 right-2 sm:top-3 sm:left-4 sm:right-4 z-20 flex items-center justify-between gap-2 pointer-events-none">
        {/* Left: Back Link */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <Link
            href="/"
            className="flex items-center gap-1 rounded-lg border border-slate-700/80 bg-[#141822]/90 px-2.5 py-1.5 sm:px-3 text-xs font-bold uppercase tracking-wider text-slate-300 hover:border-amber-500 hover:text-amber-400 backdrop-blur-md transition-all shadow-md"
          >
            <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">Arena</span>
          </Link>
        </div>

        {/* Center: Industrial HUD Pill (Responsive) */}
        <div className="flex items-center gap-3 sm:gap-6 rounded-xl border border-slate-700/80 bg-[#141822]/95 px-3 py-1.5 sm:px-5 sm:py-2 backdrop-blur-md shadow-2xl pointer-events-auto font-mono">
          {/* SCORE */}
          <div className="flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-[10px] sm:text-xs uppercase font-extrabold tracking-widest text-slate-400">
              SCORE:
            </span>
            <span className="text-base sm:text-xl font-black text-amber-500 drop-shadow">
              {gameState.score.toLocaleString()}
            </span>
          </div>

          <div className="h-4 sm:h-5 w-[1px] bg-slate-700" />

          {/* HIGH SCORE */}
          <div className="flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-[10px] sm:text-xs uppercase font-extrabold tracking-widest text-slate-400">
              HIGH:
            </span>
            <span className="text-sm sm:text-lg font-black text-amber-400/90">
              {highScore.toLocaleString()}
            </span>
          </div>

          {/* SPEED METER (Visible on sm+) */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="h-4 w-[1px] bg-slate-700" />
            <span className="text-[10px] sm:text-xs uppercase font-extrabold tracking-widest text-slate-400">
              SPD:
            </span>
            <span className="text-xs sm:text-sm font-black text-amber-500">
              x{(1.0 + (gameState.speedLevel - 1) * 0.2).toFixed(1)}
            </span>
            <div className="hidden md:block h-2.5 w-16 rounded border border-slate-600 bg-slate-900 overflow-hidden p-[1px]">
              <div
                className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-sm transition-all duration-300"
                style={{ width: `${Math.min(gameState.speedLevel * 15, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right: Quick Action Toggles */}
        <div className="flex items-center gap-1 sm:gap-1.5 pointer-events-auto">
          <button
            onClick={togglePause}
            className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg border backdrop-blur-md transition-all ${
              isPaused
                ? 'border-amber-500 bg-amber-500/20 text-amber-300'
                : 'border-slate-700/80 bg-[#141822]/90 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
            title={isPaused ? 'Resume' : 'Pause'}
          >
            {isPaused ? <Play className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-current" /> : <Pause className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
          </button>

          <button
            onClick={toggleSound}
            className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg border backdrop-blur-md transition-all ${
              isMuted
                ? 'border-red-500/50 bg-red-950/20 text-red-400'
                : 'border-slate-700/80 bg-[#141822]/90 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <Volume2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
          </button>

          <button
            onClick={toggleFullscreen}
            className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg border border-slate-700/80 bg-[#141822]/90 text-slate-300 hover:border-amber-500 hover:text-amber-400 backdrop-blur-md transition-all"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <Maximize className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
          </button>

          <button
            onClick={restartGame}
            className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg border border-slate-700/80 bg-[#141822]/90 text-slate-300 hover:border-amber-500 hover:text-amber-400 backdrop-blur-md transition-all"
            title="Restart Mech"
          >
            <RotateCcw className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>

          <button
            onClick={() => setShowHelp(!showHelp)}
            className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg border border-slate-700/80 bg-[#141822]/90 text-slate-300 hover:border-amber-500 hover:text-amber-400 backdrop-blur-md transition-all"
            title="Help & Controls"
          >
            <HelpCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
        </div>
      </div>

      {/* 3D Canvas Area */}
      <div className="relative flex-1 w-full h-full">
        <SnakeCanvas
          onScoreUpdate={handleScoreUpdate}
          onGameOver={handleGameOver}
          isPaused={isPaused}
          resetSignal={resetSignal}
        />

        {/* Pause Overlay */}
        {isPaused && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-xs">
            <div className="rounded-2xl border-2 border-amber-500/60 bg-[#141822] p-7 text-center shadow-2xl font-mono">
              <h3 className="text-xl font-black text-amber-400 uppercase tracking-widest mb-1">
                SYSTEM PAUSED
              </h3>
              <p className="text-xs text-slate-400 mb-5">Press Spacebar or button to resume</p>
              <button
                onClick={togglePause}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-2.5 text-xs font-bold text-black uppercase hover:bg-amber-400"
              >
                <Play className="h-4 w-4 fill-current" />
                Resume Hydraulics
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Controls Help Dialog */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm font-mono">
          <div className="w-full max-w-sm rounded-2xl border-2 border-amber-600/60 bg-[#141822] p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700 mb-4">
              <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <HelpCircle className="h-4 w-4" /> Controls & Rules
              </h3>
              <button
                onClick={() => setShowHelp(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                [ESC]
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex justify-between items-center py-1 border-b border-slate-800">
                <span className="text-slate-400">Desktop Turns:</span>
                <span className="font-bold text-white">W, A, S, D / Arrows</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800">
                <span className="text-slate-400">Touch Controls:</span>
                <span className="font-bold text-white">Swipe or On-Screen Pad</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800">
                <span className="text-slate-400">Target Apples:</span>
                <span className="font-bold text-red-400">+100 pts</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800">
                <span className="text-slate-400">Tachyon Cores:</span>
                <span className="font-bold text-amber-400">+300 pts</span>
              </div>
            </div>

            <button
              onClick={() => setShowHelp(false)}
              className="w-full mt-5 rounded-lg bg-amber-500 py-2.5 text-xs font-bold uppercase tracking-wider text-black hover:bg-amber-400"
            >
              Resume Deployment
            </button>
          </div>
        </div>
      )}

      {/* Post Game Score Persistence Modal */}
      <PostGameModal
        isOpen={gameState.isGameOver}
        score={gameState.score}
        applesEaten={gameState.applesEaten}
        starsCollected={gameState.starsCollected}
        currentUser={currentUser}
        onRestart={restartGame}
      />
    </div>
  );
}
