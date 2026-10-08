'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Utensils, 
  Dumbbell, 
  Bot, 
  LineChart, 
  User, 
  Flame,
  Zap,
  ShieldAlert,
  Trophy
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'AI Meal Planner', href: '/nutrition', icon: Utensils, badge: 'Fuel' },
  { name: 'AI Workouts', href: '/workout', icon: Dumbbell, badge: 'Iron' },
  { name: 'Coach AI Chat', href: '/coach', icon: Bot, badge: 'Mindset' },
  { name: 'Progress & Analytics', href: '/progress', icon: LineChart },
  { name: 'Biometrics & Profile', href: '/onboarding', icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-slate-950/90 backdrop-blur-xl border-r border-slate-800/80 h-screen sticky top-0 z-30 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-flame-500 via-flame-400 to-amber-500 p-0.5 shadow-lg shadow-flame-500/30 flex items-center justify-center animate-pulse">
          <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
            <Flame className="w-5 h-5 text-flame-500 fill-flame-500" />
          </div>
        </div>
        <div>
          <h1 className="font-extrabold text-lg bg-gradient-to-r from-white via-slate-200 to-flame-400 bg-clip-text text-transparent flex items-center gap-1.5 tracking-tight">
            FITMIND AI
          </h1>
          <span className="text-[9px] tracking-widest uppercase text-flame-400 font-extrabold flex items-center gap-1">
            <Zap className="w-3 h-3 fill-flame-400" /> BEAST MODE ENGINE
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-flame-500/20 via-amber-500/10 to-transparent text-white border border-flame-500/40 shadow-lg shadow-flame-500/15 scale-[1.02]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/80 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-flame-500/20 text-flame-400' 
                    : 'bg-slate-900 text-slate-400 group-hover:text-flame-400 group-hover:bg-slate-800'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-extrabold tracking-wider uppercase border ${
                  item.badge === 'Fuel' 
                    ? 'bg-nutrition-500/10 text-nutrition-400 border-nutrition-500/20' 
                    : item.badge === 'Iron'
                    ? 'bg-workout-500/10 text-workout-400 border-workout-500/20'
                    : 'bg-flame-500/10 text-flame-400 border-flame-500/20'
                }`}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Motivational Mindset Card */}
      <div className="p-4 m-3 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-flame-500/30 text-center relative overflow-hidden shadow-lg shadow-flame-500/10">
        <div className="absolute top-0 right-0 w-24 h-24 bg-flame-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="w-8 h-8 rounded-lg bg-flame-500/20 text-flame-400 flex items-center justify-center mx-auto mb-2 border border-flame-500/30">
          <Trophy className="w-4 h-4 text-flame-400" />
        </div>
        <h4 className="text-xs font-black text-white uppercase tracking-wider">Unstoppable Mindset</h4>
        <p className="text-[11px] text-amber-200/90 mt-1 italic font-medium">
          &ldquo;Discipline is choosing between what you want now and what you want most.&rdquo;
        </p>
      </div>
    </aside>
  );
}
