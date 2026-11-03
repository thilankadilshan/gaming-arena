import React from 'react';
import Link from 'next/link';
import { Play, Sparkles } from 'lucide-react';

interface GameCardProps {
  id: string;
  title: string;
  genre: string;
  description: string;
  badge?: 'HOT' | 'COMING SOON';
  isAvailable?: boolean;
  href?: string;
}

export default function GameCard({
  title,
  genre,
  description,
  badge = 'COMING SOON',
  isAvailable = false,
  href = '#',
}: GameCardProps) {
  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-800 bg-[#121522] transition-all duration-200 hover:border-slate-700 hover:shadow-xl">
      {/* Visual Header / Banner */}
      <div className="relative h-44 w-full bg-gradient-to-br from-slate-800/80 to-[#121522] p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">
            {genre}
          </span>
          {badge === 'HOT' ? (
            <span className="inline-flex items-center rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
              Featured
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-slate-800 border border-slate-700 px-2.5 py-0.5 text-[11px] font-medium text-slate-400">
              Coming Soon
            </span>
          )}
        </div>

        {/* Center Graphic */}
        <div className="flex items-center justify-center py-2">
          {title.includes('Snake') ? (
            <div className="flex items-center gap-1.5">
              <div className="h-10 w-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="h-7 w-7 rounded-full bg-emerald-600/50" />
              <div className="h-6 w-6 rounded-full bg-emerald-700/40" />
              <div className="h-5 w-5 rounded-full bg-red-500/80 ml-2 animate-bounce" />
            </div>
          ) : (
            <div className="h-14 w-14 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center text-slate-500 text-xs">
              Preview
            </div>
          )}
        </div>

        <div>
          <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
            {title}
          </h3>
        </div>
      </div>

      {/* Description & Action */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-4">
        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
          {description}
        </p>

        <div>
          {isAvailable ? (
            <Link
              href={href}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 py-2.5 text-xs font-semibold text-black hover:bg-emerald-400 transition-colors"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              Play Now
            </Link>
          ) : (
            <button
              disabled
              className="w-full rounded-lg border border-slate-800 bg-slate-900/60 py-2.5 text-xs font-medium text-slate-500 cursor-not-allowed"
            >
              Coming Soon
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
