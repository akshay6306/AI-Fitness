'use client';

import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { TrendingDown, Calendar, Scale } from 'lucide-react';
import { DailyLog } from '@/types';

interface WeightChartProps {
  logs: DailyLog[];
  targetWeightKg: number;
}

export default function WeightChart({ logs, targetWeightKg }: WeightChartProps) {
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | 'all'>('30d');

  // Filter logs based on timeframe
  const filteredLogs = [...logs].filter(l => l.weightKg !== undefined);
  const displayLogs = timeframe === '7d' 
    ? filteredLogs.slice(-7) 
    : timeframe === '30d' 
    ? filteredLogs.slice(-30) 
    : filteredLogs;

  const currentWeight = filteredLogs.length > 0 ? filteredLogs[filteredLogs.length - 1].weightKg : 75;
  const startWeight = filteredLogs.length > 0 ? filteredLogs[0].weightKg : 80;
  const totalChange = (currentWeight || 0) - (startWeight || 0);

  return (
    <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Scale className="w-4 h-4 text-nutrition-400" />
            Body Weight Analytics Trend
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Current: <strong className="text-white">{currentWeight} kg</strong> | Target: <strong className="text-nutrition-400">{targetWeightKg} kg</strong>
          </p>
        </div>

        {/* Timeframe Selector Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 self-start sm:self-auto">
          {(['7d', '30d', 'all'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all ${
                timeframe === tf
                  ? 'bg-nutrition-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Callout */}
      <div className="flex items-center gap-4 text-xs p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80">
        <div className="flex items-center gap-1 text-nutrition-400 font-bold">
          <TrendingDown className="w-4 h-4" />
          <span>{totalChange > 0 ? `+${totalChange.toFixed(1)}` : totalChange.toFixed(1)} kg</span>
        </div>
        <span className="text-slate-500">|</span>
        <span className="text-slate-300">
          Remaining to target: <strong>{Math.abs((currentWeight || 0) - targetWeightKg).toFixed(1)} kg</strong>
        </span>
      </div>

      {/* Recharts Line Chart */}
      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={displayLogs}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
            <XAxis 
              dataKey="date" 
              stroke="#64748b" 
              fontSize={10} 
              tickFormatter={(val) => val.split('-').slice(1).join('/')} 
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={10} 
              domain={['dataMin - 1', 'dataMax + 1']}
              tickFormatter={(val) => `${val}kg`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#0f172a', 
                borderColor: '#1e293b', 
                borderRadius: '12px',
                color: '#f8fafc',
                fontSize: '12px'
              }}
              formatter={(value: any) => [`${value} kg`, 'Weight']}
            />
            <Line 
              type="monotone" 
              dataKey="weightKg" 
              stroke="#10b981" 
              strokeWidth={3} 
              dot={{ fill: '#10b981', r: 4 }}
              activeDot={{ r: 6, fill: '#34d399' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
