'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Utensils, 
  Dumbbell, 
  Bot, 
  LineChart 
} from 'lucide-react';

const navItems = [
  { name: 'Home', href: '/', icon: LayoutDashboard },
  { name: 'Meals', href: '/nutrition', icon: Utensils },
  { name: 'Workout', href: '/workout', icon: Dumbbell },
  { name: 'Coach', href: '/coach', icon: Bot },
  { name: 'Progress', href: '/progress', icon: LineChart },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/80 z-40 px-2 py-1.5 flex justify-around items-center">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
              isActive
                ? 'text-nutrition-400 font-semibold scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-nutrition-400' : ''}`} />
            <span className="text-[10px]">{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
