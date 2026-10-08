'use client';

import React from 'react';
import { Activity, Flame, ShieldAlert, Heart, TrendingUp, Info } from 'lucide-react';
import { BiometricResult, UserProfile } from '@/types';

interface BiometricsCardProps {
  biometrics: BiometricResult;
  profile: UserProfile;
}

export default function BiometricsCard({ biometrics, profile }: BiometricsCardProps) {
  const { bmi, bmiCategory, bmr, tdee, targetCalories, isUnsafeCalorieDeficit, safetyWarningMessage, macros } = biometrics;

  const categoryColor = {
    Underweight: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    Normal: 'text-nutrition-400 bg-nutrition-500/10 border-nutrition-500/20',
    Overweight: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    Obese: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  }[bmiCategory];

  return (
    <div className="space-y-4">
      {/* Safety Warning Banner if deficit is unsafe */}
      {isUnsafeCalorieDeficit && (
        <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-3 shadow-lg shadow-rose-950/50">
          <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5 animate-bounce" />
          <div>
            <h4 className="font-bold text-rose-300 text-sm mb-1">Unsafe Calorie Deficit Prevented</h4>
            <p className="leading-relaxed">{safetyWarningMessage}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* BMI Card */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">BMI Analytics</span>
            <div className="p-2 rounded-xl bg-slate-900 text-slate-300">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{bmi}</span>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${categoryColor}`}>
              {bmiCategory}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Normal range: 18.5 - 24.9
          </p>
        </div>

        {/* BMR Card */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">BMR (Metabolism)</span>
            <div className="p-2 rounded-xl bg-slate-900 text-accent-rose">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-white">{bmr.toLocaleString()}</span>
            <span className="text-xs text-slate-400 ml-1">kcal/day</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Basal calories burned at complete rest
          </p>
        </div>

        {/* TDEE Card */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">TDEE Energy Expenditure</span>
            <div className="p-2 rounded-xl bg-slate-900 text-workout-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-white">{tdee.toLocaleString()}</span>
            <span className="text-xs text-slate-400 ml-1">kcal/day</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Includes {profile.activityLevel.replace('_', ' ')} activity
          </p>
        </div>

        {/* Target Calories Card */}
        <div className="glass-card rounded-2xl p-5 border border-nutrition-500/30 bg-gradient-to-br from-nutrition-500/10 via-slate-900 to-slate-950 relative overflow-hidden shadow-lg shadow-nutrition-500/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-nutrition-400 uppercase tracking-wider">Target Daily Goal</span>
            <div className="p-2 rounded-xl bg-nutrition-500/20 text-nutrition-400">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-white">{targetCalories.toLocaleString()}</span>
            <span className="text-xs text-nutrition-300 ml-1">kcal/day</span>
          </div>
          <p className="text-[11px] text-nutrition-400/90 font-medium mt-2 capitalize flex items-center gap-1">
            Goal: {profile.goal.replace('_', ' ')}
          </p>
        </div>
      </div>

      {/* Target Macro Breakdown Distribution */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800">
        <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-nutrition-400" />
          Target Daily Macro Distribution
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Protein */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-200">Protein</span>
              <span className="text-xs font-semibold text-nutrition-400">{macros.proteinPct}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
              <div className="bg-nutrition-500 h-full rounded-full" style={{ width: `${macros.proteinPct}%` }} />
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">{macros.proteinGrams}g</span>
              <span className="text-slate-400">{macros.proteinCalories} kcal</span>
            </div>
          </div>

          {/* Carbohydrates */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-200">Carbohydrates</span>
              <span className="text-xs font-semibold text-workout-400">{macros.carbsPct}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
              <div className="bg-workout-500 h-full rounded-full" style={{ width: `${macros.carbsPct}%` }} />
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">{macros.carbsGrams}g</span>
              <span className="text-slate-400">{macros.carbsCalories} kcal</span>
            </div>
          </div>

          {/* Healthy Fats */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-200">Healthy Fats</span>
              <span className="text-xs font-semibold text-amber-400">{macros.fatsPct}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: `${macros.fatsPct}%` }} />
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">{macros.fatsGrams}g</span>
              <span className="text-slate-400">{macros.fatsCalories} kcal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
