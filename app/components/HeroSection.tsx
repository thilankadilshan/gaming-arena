'use client';

import React from 'react';
import Link from 'next/link';
import { Play, Trophy, Sparkles } from 'lucide-react';

export default function HeroSection() {
  return (
    <div className="relative pt-12 pb-16 md:pt-20 md:pb-24 border-b border-slate-800/80 bg-gradient-to-b from-[#111422] to-[#0b0d14]">
      <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        {/* Subtle pill badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs text-emerald-400 font-medium mb-6">
          <Sparkles className="h-3.5 w-3.5" />
          <span>New Release: Snake 3D</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-white">
          Play Instant Games in Your Browser
        </h1>

        {/* Hero Subtitle */}
        <p className="mx-auto mt-4 max-w-2xl text-base text-slate-400 sm:text-lg">
          No downloads, no installations, no waiting. Jump straight into the action as a guest or create a free profile to compete on the global leaderboards.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <Link
            href="/games/snake-3d"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-7 py-3.5 text-sm font-semibold text-black hover:bg-emerald-400 transition-all duration-150 shadow-lg shadow-emerald-500/20"
          >
            <Play className="h-4 w-4 fill-current" />
            Play Snake 3D
          </Link>

          <Link
            href="#leaderboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/60 px-7 py-3.5 text-sm font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-all"
          >
            <Trophy className="h-4 w-4 text-amber-400" />
            View Leaderboard
          </Link>
        </div>
      </div>
    </div>
  );
}
