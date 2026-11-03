'use client';

import React, { useState } from 'react';
import { Trophy, RotateCcw, LogIn, UserPlus, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import AuthModal from '@/app/components/AuthModal';

interface PostGameModalProps {
  isOpen: boolean;
  score: number;
  applesEaten: number;
  starsCollected: number;
  currentUser: { id: string; username: string } | null;
  onRestart: () => void;
  onScoreSaved?: () => void;
}

export default function PostGameModal({
  isOpen,
  score,
  applesEaten,
  starsCollected,
  currentUser,
  onRestart,
  onScoreSaved,
}: PostGameModalProps) {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSaveScore = async () => {
    setSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          score,
          applesEaten,
          starsCollected,
          gameName: 'snake_3d',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit score');
      }

      setSubmitted(true);
      setStatusMsg(
        data.score?.isNewPersonalBest
          ? '🌟 New Personal Best recorded to the global leaderboard!'
          : 'Score saved to the global leaderboard!'
      );
      if (onScoreSaved) onScoreSaved();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Error submitting score');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 font-mono">
        <div className="relative w-full max-w-md rounded-2xl border-2 border-amber-600/70 bg-[#161a22] p-6 sm:p-7 shadow-2xl text-center">
          {/* Header Trophy */}
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-amber-500/10 border-2 border-amber-500/40 text-amber-400">
            <Trophy className="h-7 w-7" />
          </div>

          <h2 className="text-2xl font-black uppercase text-white tracking-wider">
            MISSION TERMINATED
          </h2>

          {/* Score Summary Box */}
          <div className="my-5 rounded-xl border border-slate-700 bg-[#0e1117] p-4">
            <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">
              FINAL SCORE
            </p>
            <p className="text-4xl font-black text-amber-400 my-1 drop-shadow">
              {score.toLocaleString()}
            </p>
            <div className="flex items-center justify-center gap-5 mt-2 text-xs text-slate-300">
              <span>
                🍎 Apples: <strong className="text-red-400">{applesEaten}</strong>
              </span>
              <span>
                ⭐ Cores: <strong className="text-amber-400">{starsCollected}</strong>
              </span>
            </div>
          </div>

          {/* Submission status or Auth Prompt */}
          {submitted ? (
            <div className="mb-5 flex items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-3.5 text-emerald-300 text-xs">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>{statusMsg}</span>
            </div>
          ) : errorMsg ? (
            <div className="mb-5 flex items-center justify-center gap-2 rounded-xl border border-red-500/40 bg-red-950/30 p-3 text-red-300 text-xs">
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          ) : currentUser ? (
            <div className="mb-5">
              <p className="text-xs text-slate-400 mb-2.5">
                Pilot Profile: <strong className="text-amber-400">{currentUser.username}</strong>
              </p>
              <button
                onClick={handleSaveScore}
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 py-3 text-xs font-black uppercase tracking-wider text-black hover:bg-amber-400 disabled:opacity-50 transition-colors shadow-lg"
              >
                <Send className="h-3.5 w-3.5" />
                {submitting ? 'RECORDING TELEMETRY...' : 'SAVE RUN TO LEADERBOARD'}
              </button>
            </div>
          ) : (
            <div className="mb-5 rounded-xl border border-slate-700 bg-[#0e1117]/80 p-4 text-left">
              <p className="text-xs font-bold text-white uppercase tracking-wider">
                SAVE RUN OF {score.toLocaleString()} TO LEADERBOARD?
              </p>
              <p className="text-[11px] text-slate-400 mt-1 mb-3">
                Log in or register in 5 seconds to claim your rank.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setAuthMode('login');
                    setAuthModalOpen(true);
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-600 bg-slate-800 py-2 text-xs font-bold uppercase text-slate-200 hover:bg-slate-700 transition-colors"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  LOG IN
                </button>
                <button
                  onClick={() => {
                    setAuthMode('register');
                    setAuthModalOpen(true);
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-amber-500 py-2 text-xs font-bold uppercase text-black hover:bg-amber-400 transition-colors shadow"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  SIGN UP
                </button>
              </div>
            </div>
          )}

          {/* Action Row */}
          <div>
            <button
              onClick={onRestart}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-800 border border-slate-700 py-3.5 text-xs font-black uppercase tracking-wider text-white hover:bg-slate-700 transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              DEPLOY AGAIN (SPACE)
            </button>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultMode={authMode}
        onSuccess={() => {
          handleSaveScore();
        }}
      />
    </>
  );
}
