'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Gamepad2, Trophy, User, LogOut, LogIn, Menu, X } from 'lucide-react';
import AuthModal from './AuthModal';

export default function Navbar() {
  const [currentUser, setCurrentUser] = useState<{ id: string; username: string } | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setCurrentUser(data.user);
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setCurrentUser(null);
    window.location.reload();
  };

  const openAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-[#0e111a]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 transition-all group-hover:bg-emerald-500/20">
              <Gamepad2 className="h-5 w-5" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white">
                Gaming<span className="text-emerald-400">Arena</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/#games"
              className="flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              <Gamepad2 className="h-4 w-4 text-slate-400" />
              Games
            </Link>
            <Link
              href="/#leaderboard"
              className="flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-amber-400 transition-colors"
            >
              <Trophy className="h-4 w-4 text-amber-400" />
              Leaderboard
            </Link>
          </nav>

          {/* User Auth Section */}
          <div className="hidden md:flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-1.5 text-xs text-slate-300">
                  <User className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="font-medium text-white">{currentUser.username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/40 px-3 py-1.5 text-xs font-medium text-slate-400 hover:border-red-500/40 hover:text-red-400 transition-all"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuth('login')}
                  className="rounded-lg border border-slate-700 bg-slate-800/60 px-3.5 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-all"
                >
                  Log In
                </button>
                <button
                  onClick={() => openAuth('register')}
                  className="rounded-lg bg-emerald-500 px-3.5 py-1.5 text-xs font-semibold text-black hover:bg-emerald-400 transition-all"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-slate-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-800 bg-[#121522] px-4 py-4 space-y-3">
            <Link
              href="/#games"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-slate-300 hover:text-white"
            >
              Games
            </Link>
            <Link
              href="/#leaderboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-slate-300 hover:text-amber-400"
            >
              Leaderboard
            </Link>

            <div className="pt-2 border-t border-slate-800">
              {currentUser ? (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-emerald-400 font-medium">
                    {currentUser.username}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-xs text-red-400 hover:underline"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => openAuth('login')}
                    className="flex-1 rounded-lg border border-slate-700 py-2 text-xs font-semibold text-slate-200"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => openAuth('register')}
                    className="flex-1 rounded-lg bg-emerald-500 py-2 text-xs font-semibold text-black"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultMode={authMode}
        onSuccess={(user) => setCurrentUser(user)}
      />
    </>
  );
}
