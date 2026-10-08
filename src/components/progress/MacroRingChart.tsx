'use client';

import React, { useState } from 'react';
import { Flame, PieChart, Plus, Check } from 'lucide-react';
import { BiometricResult, DailyLog } from '@/types';
import { saveDailyLog } from '@/utils/storage';

interface MacroRingChartProps {
  biometrics: BiometricResult;
  todayLog: DailyLog;
  onLogUpdate: (updatedLog: DailyLog) => void;
}

export default function MacroRingChart({ biometrics, todayLog, onLogUpdate }: MacroRingChartProps) {
  const [logModal, setLogModal] = useState(false);
  const [addCals, setAddCals] = useState(450);
  const [addProtein, setAddProtein] = useState(35);
  const [addCarbs, setAddCarbs] = useState(45);
  const [addFat, setAddFat] = useState(15);

  const targetCals = biometrics.targetCalories;
  const consumedCals = todayLog.caloriesConsumed || 0;
  const remainingCals = Math.max(0, targetCals - consumedCals);
  const calsPct = Math.min(100, Math.round((consumedCals / targetCals) * 100));

  const pTarget = biometrics.macros.proteinGrams;
  const cTarget = biometrics.macros.carbsGrams;
  const fTarget = biometrics.macros.fatsGrams;

  const pConsumed = todayLog.proteinConsumed || 0;
  const cConsumed = todayLog.carbsConsumed || 0;
  const fConsumed = todayLog.fatConsumed || 0;

  const handleAddMealLog = () => {
    const updated: DailyLog = {
      ...todayLog,
      caloriesConsumed: consumedCals + addCals,
      proteinConsumed: pConsumed + addProtein,
      carbsConsumed: cConsumed + addCarbs,
      fatConsumed: fConsumed + addFat,
    };
    saveDailyLog(updated);
    onLogUpdate(updated);
    setLogModal(false);
  };

  return (
    <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-5">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Flame className="w-4 h-4 text-nutrition-400" />
            Daily Energy & Macro Tracker
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Consumed vs Remaining Calories & Macros</p>
        </div>

        <button
          onClick={() => setLogModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-nutrition-500 hover:bg-nutrition-400 text-slate-950 text-xs font-extrabold shadow-md shadow-nutrition-500/20 transition-all"
        >
          <Plus className="w-3.5 h-3.5" /> Log Meal Intake
        </button>
      </div>

      {/* Main Calorie Ring / Progress Gauge */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <div className="md:col-span-1 flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
          <div className="relative w-28 h-28 flex items-center justify-center">
            {/* SVG Progress Circle */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="56"
                cy="56"
                r="48"
                className="stroke-slate-800"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="56"
                cy="56"
                r="48"
                className="stroke-nutrition-500 transition-all duration-500"
                strokeWidth="8"
                strokeDasharray={301.59}
                strokeDashoffset={301.59 - (301.59 * calsPct) / 100}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-xl font-extrabold text-white">{consumedCals}</span>
              <span className="text-[10px] text-slate-400 uppercase">kcal</span>
            </div>
          </div>
          <span className="text-xs font-bold text-slate-300 mt-2">
            {remainingCals} kcal remaining
          </span>
        </div>

        {/* Individual Macro Progress Bars */}
        <div className="md:col-span-3 space-y-3">
          {/* Protein */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="font-bold text-slate-200">Protein</span>
              <span className="text-nutrition-400 font-semibold">
                {pConsumed}g / {pTarget}g ({Math.min(100, Math.round((pConsumed / pTarget) * 100))}%)
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-nutrition-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (pConsumed / pTarget) * 100)}%` }}
              />
            </div>
          </div>

          {/* Carbs */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="font-bold text-slate-200">Carbohydrates</span>
              <span className="text-workout-400 font-semibold">
                {cConsumed}g / {cTarget}g ({Math.min(100, Math.round((cConsumed / cTarget) * 100))}%)
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-workout-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (cConsumed / cTarget) * 100)}%` }}
              />
            </div>
          </div>

          {/* Fats */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="font-bold text-slate-200">Fats</span>
              <span className="text-amber-400 font-semibold">
                {fConsumed}g / {fTarget}g ({Math.min(100, Math.round((fConsumed / fTarget) * 100))}%)
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (fConsumed / fTarget) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Log Modal */}
      {logModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-md rounded-3xl p-6 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white">Log Meal Intake</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Calories (kcal)</label>
                <input
                  type="number"
                  value={addCals}
                  onChange={(e) => setAddCals(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1">Protein (g)</label>
                  <input
                    type="number"
                    value={addProtein}
                    onChange={(e) => setAddProtein(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Carbs (g)</label>
                  <input
                    type="number"
                    value={addCarbs}
                    onChange={(e) => setAddCarbs(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Fat (g)</label>
                  <input
                    type="number"
                    value={addFat}
                    onChange={(e) => setAddFat(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setLogModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMealLog}
                className="px-5 py-2 rounded-xl bg-nutrition-500 text-slate-950 text-xs font-extrabold"
              >
                Add Intake
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
