'use client';

import React, { useState } from 'react';
import { X, LogIn, UserPlus, AlertCircle, Loader2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
  onSuccess?: (user: { id: string; username: string }) => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  defaultMode = 'login',
  onSuccess,
}: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      if (onSuccess && data.user) {
        onSuccess(data.user);
      }
      onClose();
      window.location.reload();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-2xl border border-slate-700 bg-[#141724] p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white transition-colors"
          aria-label="Close Modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex border-b border-slate-800 mb-5">
          <button
            onClick={() => { setMode('login'); setError(null); }}
            className={`flex-1 pb-3 text-xs font-semibold tracking-wider transition-all flex items-center justify-center gap-1.5 ${
              mode === 'login'
                ? 'border-b-2 border-emerald-500 text-emerald-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LogIn className="h-3.5 w-3.5" /> LOG IN
          </button>
          <button
            onClick={() => { setMode('register'); setError(null); }}
            className={`flex-1 pb-3 text-xs font-semibold tracking-wider transition-all flex items-center justify-center gap-1.5 ${
              mode === 'register'
                ? 'border-b-2 border-emerald-500 text-emerald-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus className="h-3.5 w-3.5" /> SIGN UP
          </button>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-500/40 bg-red-950/30 p-2.5 text-xs text-red-200">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Username
            </label>
            <input
              type="text"
              required
              minLength={3}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. gamer_pro"
              className="w-full rounded-lg border border-slate-700 bg-[#0b0d14] px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full rounded-lg border border-slate-700 bg-[#0b0d14] px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 rounded-lg bg-emerald-500 py-2.5 text-xs font-semibold text-black hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                {mode === 'login' ? 'Logging In...' : 'Signing Up...'}
              </>
            ) : mode === 'login' ? (
              'Log In'
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <p className="mt-4 text-center text-[11px] text-slate-500">
          Instant guest or player account. No email required.
        </p>
      </div>
    </div>
  );
}
