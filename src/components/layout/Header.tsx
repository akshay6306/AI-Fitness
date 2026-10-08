'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Flame, User, PlusCircle, Trophy, Zap } from 'lucide-react';
import { getStoredProfile } from '@/utils/storage';
import { UserProfile } from '@/types';

const MOTIVATIONAL_QUOTES = [
  "No Excuses. Just Execution.",
  "Pain is Temporary. Pride is Forever.",
  "Don't Stop When You're Tired. Stop When You're Done.",
  "Suffer the Pain of Discipline or Suffer the Pain of Regret."
];

export default function Header() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    setProfile(getStoredProfile());
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3 flex items-center justify-between z-20">
      {/* Mobile Branding */}
      <div className="flex items-center gap-2 md:hidden">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-flame-500 to-amber-500 flex items-center justify-center font-black text-slate-950 text-sm">
          FM
        </div>
        <span className="font-extrabold text-base bg-gradient-to-r from-white via-slate-200 to-flame-400 bg-clip-text text-transparent">
          FitMind AI
        </span>
      </div>

      {/* Greeting & Motivational Ticker */}
      <div className="hidden md:flex items-center gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
            Welcome back, <span className="font-extrabold text-white">{profile?.name || 'Champion'}</span> ⚡
          </h2>
          <p className="text-[11px] text-flame-400 font-semibold italic animate-fade-in flex items-center gap-1 mt-0.5">
            <Zap className="w-3 h-3 text-flame-400 fill-flame-400" />
            &ldquo;{MOTIVATIONAL_QUOTES[quoteIndex]}&rdquo;
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-flame-500/10 border border-flame-500/30 text-flame-400 text-xs font-black shadow-lg shadow-flame-500/10">
          <Flame className="w-4 h-4 fill-flame-400 text-flame-500 animate-bounce" />
          <span>7 DAY BEAST STREAK</span>
        </div>
      </div>

      {/* Right Action Controls */}
      <div className="flex items-center gap-3">
        <Link 
          href="/onboarding"
          className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-bold transition-all"
        >
          <User className="w-3.5 h-3.5 text-flame-400" />
          <span>Edit Profile</span>
        </Link>

        <Link
          href="/onboarding"
          className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-gradient-to-r from-flame-500 via-flame-400 to-amber-500 hover:opacity-95 text-slate-950 text-xs font-black shadow-lg shadow-flame-500/25 transition-all"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Recalculate Macros</span>
        </Link>
      </div>
    </header>
  );
}
