'use client';

import React from 'react';
import { Droplet, Footprints, Flame, Plus, RotateCcw, CheckCircle2 } from 'lucide-react';
import { DailyLog } from '@/types';
import { saveDailyLog } from '@/utils/storage';

interface HabitTrackerProps {
  todayLog: DailyLog;
  onLogUpdate: (updatedLog: DailyLog) => void;
}

export default function HabitTracker({ todayLog, onLogUpdate }: HabitTrackerProps) {
  const waterTarget = 3000; // 3L
  const currentWater = todayLog.waterMl || 0;
  const waterPct = Math.min(100, Math.round((currentWater / waterTarget) * 100));

  const stepTarget = 10000;
  const currentSteps = todayLog.steps || 0;
  const stepPct = Math.min(100, Math.round((currentSteps / stepTarget) * 100));

  const addWater = (amount: number) => {
    const updated: DailyLog = {
      ...todayLog,
      waterMl: currentWater + amount
    };
    saveDailyLog(updated);
    onLogUpdate(updated);
  };

  const resetWater = () => {
    const updated: DailyLog = {
      ...todayLog,
      waterMl: 0
    };
    saveDailyLog(updated);
    onLogUpdate(updated);
  };

  const toggleWorkout = () => {
    const updated: DailyLog = {
      ...todayLog,
      workoutCompleted: !todayLog.workoutCompleted
    };
    saveDailyLog(updated);
    onLogUpdate(updated);
  };

  const addSteps = (stepAmount: number) => {
    const updated: DailyLog = {
      ...todayLog,
      steps: currentSteps + stepAmount
    };
    saveDailyLog(updated);
    onLogUpdate(updated);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Water Intake Logger */}
      <div className="glass-card rounded-3xl p-5 border border-slate-800 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-workout-500/20 text-workout-400">
              <Droplet className="w-4 h-4 fill-workout-400/20" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-200">Hydration Logger</h4>
              <span className="text-[10px] text-slate-400">{currentWater} / {waterTarget} ml</span>
            </div>
          </div>
          <button
            onClick={resetWater}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300"
            title="Reset water"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Visual Glass Meter Bar */}
        <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-800">
          <div
            className="bg-gradient-to-r from-workout-500 to-workout-400 h-full rounded-full transition-all duration-300"
            style={{ width: `${waterPct}%` }}
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => addWater(250)}
            className="py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-workout-400 text-xs font-bold transition-all flex items-center justify-center gap-1"
          >
            <Plus className="w-3 h-3" /> 250ml
          </button>
          <button
            onClick={() => addWater(500)}
            className="py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-workout-400 text-xs font-bold transition-all flex items-center justify-center gap-1"
          >
            <Plus className="w-3 h-3" /> 500ml
          </button>
          <button
            onClick={() => addWater(750)}
            className="py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-workout-400 text-xs font-bold transition-all flex items-center justify-center gap-1"
          >
            <Plus className="w-3 h-3" /> 750ml
          </button>
        </div>
      </div>

      {/* Step Counter Integration */}
      <div className="glass-card rounded-3xl p-5 border border-slate-800 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-nutrition-500/20 text-nutrition-400">
              <Footprints className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-200">Daily Step Counter</h4>
              <span className="text-[10px] text-slate-400">{currentSteps.toLocaleString()} / {stepTarget.toLocaleString()} steps</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-800">
          <div
            className="bg-gradient-to-r from-nutrition-500 to-nutrition-400 h-full rounded-full transition-all duration-300"
            style={{ width: `${stepPct}%` }}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => addSteps(1000)}
            className="py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-nutrition-400 text-xs font-bold transition-all flex items-center justify-center gap-1"
          >
            <Plus className="w-3 h-3" /> +1,000 Steps
          </button>
          <button
            onClick={() => addSteps(2500)}
            className="py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-nutrition-400 text-xs font-bold transition-all flex items-center justify-center gap-1"
          >
            <Plus className="w-3 h-3" /> +2,500 Steps
          </button>
        </div>
      </div>

      {/* Workout Completion Check-in & Streak */}
      <div className="glass-card rounded-3xl p-5 border border-slate-800 flex flex-col justify-between">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Flame className="w-4 h-4 fill-amber-400/20" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-200">Workout Check-in</h4>
              <span className="text-[10px] text-amber-400 font-semibold">7 Day Active Streak</span>
            </div>
          </div>
        </div>

        <button
          onClick={toggleWorkout}
          className={`w-full py-3 mt-4 rounded-2xl border font-bold text-xs flex items-center justify-center gap-2 transition-all ${
            todayLog.workoutCompleted
              ? 'bg-nutrition-500/20 border-nutrition-500 text-nutrition-400'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{todayLog.workoutCompleted ? 'Workout Marked Completed! 🔥' : 'Mark Today Workout Completed'}</span>
        </button>
      </div>
    </div>
  );
}
