'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Flame, 
  Utensils, 
  Dumbbell, 
  Bot, 
  LineChart, 
  Sparkles, 
  ArrowRight, 
  Zap,
  Trophy,
  Activity,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { getStoredProfile, getStoredMealPlan, getStoredWorkoutPlan, getStoredLogs } from '@/utils/storage';
import { computeBiometrics } from '@/utils/biometrics';
import { UserProfile, MealPlan, WorkoutPlan, DailyLog } from '@/types';
import BiometricsCard from '@/components/biometrics/BiometricsCard';

export default function DashboardPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [todayLog, setTodayLog] = useState<DailyLog | null>(null);

  useEffect(() => {
    const prof = getStoredProfile();
    setProfile(prof);

    const mp = getStoredMealPlan();
    if (mp) setMealPlan(mp);

    const wp = getStoredWorkoutPlan();
    if (wp) setWorkoutPlan(wp);

    const logs = getStoredLogs();
    const todayStr = new Date().toISOString().split('T')[0];
    const log = logs.find(l => l.date === todayStr);
    if (log) setTodayLog(log);
  }, []);

  const biometrics = profile ? computeBiometrics(profile) : null;

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* High-Energy Motivational Hero Banner with Gym Imagery */}
      <div className="relative rounded-3xl p-6 md:p-10 motivational-hero border border-flame-500/40 overflow-hidden shadow-2xl glow-flame">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/60 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="max-w-2xl">
            <span className="text-xs px-3.5 py-1.5 rounded-full bg-gradient-to-r from-flame-500/20 to-amber-500/20 text-flame-400 border border-flame-500/40 font-extrabold tracking-widest uppercase inline-flex items-center gap-2 mb-3 shadow-md shadow-flame-500/10">
              <Flame className="w-4 h-4 text-flame-400 fill-flame-400 animate-bounce" /> BECOME UNSTOPPABLE
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight uppercase tracking-tight">
              Transform Your Body & Mind With <span className="bg-gradient-to-r from-flame-400 via-amber-400 to-white bg-clip-text text-transparent">AI Precision</span>
            </h1>
            <p className="text-sm md:text-base text-slate-300 mt-3 leading-relaxed font-medium">
              No excuses. No guesswork. Personalized Mifflin-St Jeor metabolic calculations, targeted macro meal planning, progressive overload splits, and real-time Coach AI mindset.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
            <Link
              href="/workout"
              className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-flame-500 via-flame-400 to-amber-500 hover:opacity-95 text-slate-950 text-xs font-black uppercase tracking-wider shadow-xl shadow-flame-500/30 transition-all scale-105"
            >
              <Dumbbell className="w-4 h-4" /> Start Workout Split
            </Link>
            <Link
              href="/nutrition"
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-850 border border-slate-700 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md transition-all"
            >
              <Utensils className="w-4 h-4 text-nutrition-400" /> View Meal Fuel
            </Link>
          </div>
        </div>
      </div>

      {/* Introductory Gym Visual Cards Gallery */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Heavy Strength & Conditioning */}
        <div className="gym-card-bg-1 rounded-3xl p-5 border border-slate-800 flex flex-col justify-end min-h-[190px] relative overflow-hidden group hover:border-flame-500/50 transition-all duration-300 shadow-lg">
          <div className="relative z-10">
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-flame-500/30 text-flame-300 font-extrabold uppercase tracking-wider mb-2 inline-block border border-flame-500/40">
              Iron & Strength
            </span>
            <h3 className="text-base font-black text-white uppercase tracking-tight">Progressive Overload</h3>
            <p className="text-[11px] text-slate-300 mt-0.5">3-6 day custom splits with rep & set AI recommendations.</p>
          </div>
        </div>

        {/* Card 2: Precision Fuel & Nutrition */}
        <div className="gym-card-bg-2 rounded-3xl p-5 border border-slate-800 flex flex-col justify-end min-h-[190px] relative overflow-hidden group hover:border-nutrition-500/50 transition-all duration-300 shadow-lg">
          <div className="relative z-10">
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-nutrition-500/30 text-nutrition-300 font-extrabold uppercase tracking-wider mb-2 inline-block border border-nutrition-500/40">
              Macro Fuel
            </span>
            <h3 className="text-base font-black text-white uppercase tracking-tight">Tailored Nutrition</h3>
            <p className="text-[11px] text-slate-300 mt-0.5">Exact protein, carb, & fat meals matched to your BMR.</p>
          </div>
        </div>

        {/* Card 3: Coach AI Mindset */}
        <div className="gym-card-bg-3 rounded-3xl p-5 border border-slate-800 flex flex-col justify-end min-h-[190px] relative overflow-hidden group hover:border-workout-500/50 transition-all duration-300 shadow-lg">
          <div className="relative z-10">
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-workout-500/30 text-workout-300 font-extrabold uppercase tracking-wider mb-2 inline-block border border-workout-500/40">
              AI Mindset
            </span>
            <h3 className="text-base font-black text-white uppercase tracking-tight">Real-Time Coach</h3>
            <p className="text-[11px] text-slate-300 mt-0.5">Sports science answers, meal subs, & injury adaptations.</p>
          </div>
        </div>

        {/* Card 4: Sprints & Conditioning */}
        <div className="gym-card-bg-4 rounded-3xl p-5 border border-slate-800 flex flex-col justify-end min-h-[190px] relative overflow-hidden group hover:border-amber-500/50 transition-all duration-300 shadow-lg">
          <div className="relative z-10">
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/30 text-amber-300 font-extrabold uppercase tracking-wider mb-2 inline-block border border-amber-500/40">
              Peak Performance
            </span>
            <h3 className="text-base font-black text-white uppercase tracking-tight">Transformation Tracking</h3>
            <p className="text-[11px] text-slate-300 mt-0.5">Visual weight trend lines, hydration, & daily habits.</p>
          </div>
        </div>
      </div>

      {/* Biometric Engine Live Status */}
      {profile && biometrics && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-xs font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
              <Zap className="w-4 h-4 text-flame-400" /> Live Calculated Biometrics & Target Macros
            </h2>
            <Link href="/onboarding" className="text-xs text-flame-400 font-bold hover:underline">
              Recalculate Biometrics →
            </Link>
          </div>
          <BiometricsCard biometrics={biometrics} profile={profile} />
        </div>
      )}

      {/* Today at a Glance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nutrition Overview Card */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 hover:border-nutrition-500/40 transition-all flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-black text-nutrition-400 uppercase tracking-wider flex items-center gap-2">
                <Utensils className="w-4 h-4" /> Today&apos;s Fuel Plan
              </span>
              <Link href="/nutrition" className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-bold">
                Full Plan <ArrowRight className="w-3.5 h-3.5 text-nutrition-400" />
              </Link>
            </div>

            {mealPlan ? (
              <div className="space-y-3">
                {mealPlan.meals.slice(0, 3).map((meal) => (
                  <div key={meal.id} className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex justify-between items-center text-xs">
                    <div>
                      <span className="text-[10px] font-extrabold text-nutrition-400 uppercase tracking-wider block">{meal.mealType}</span>
                      <span className="font-bold text-slate-200">{meal.name}</span>
                    </div>
                    <span className="font-extrabold text-white shrink-0 ml-2">{meal.calories} kcal</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-400">
                No active meal plan generated yet.
                <div className="mt-3">
                  <Link href="/nutrition" className="px-4 py-2 rounded-xl bg-nutrition-500 text-slate-950 font-extrabold">
                    Generate AI Meal Fuel
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
            <span>Target Daily Intake: <strong className="text-white">{biometrics?.targetCalories} kcal</strong></span>
            <span className="text-nutrition-400 font-extrabold">{biometrics?.macros.proteinGrams}g Protein</span>
          </div>
        </div>

        {/* Workout Routine Overview Card */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 hover:border-workout-500/40 transition-all flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-black text-workout-400 uppercase tracking-wider flex items-center gap-2">
                <Dumbbell className="w-4 h-4" /> Today&apos;s Workout Split
              </span>
              <Link href="/workout" className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-bold">
                View Split <ArrowRight className="w-3.5 h-3.5 text-workout-400" />
              </Link>
            </div>

            {workoutPlan ? (
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <span className="text-xs font-bold text-white block">{workoutPlan.schedule[0]?.dayTitle}</span>
                  <span className="text-[11px] text-workout-400 block mt-0.5 font-semibold">Focus: {workoutPlan.schedule[0]?.focusArea}</span>
                </div>
                <div className="space-y-2">
                  {workoutPlan.schedule[0]?.exercises.slice(0, 3).map((ex) => (
                    <div key={ex.id} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60 flex justify-between items-center text-xs">
                      <span className="text-slate-300 font-medium">{ex.name}</span>
                      <span className="text-workout-400 font-bold text-[11px]">{ex.sets} sets × {ex.reps}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-400">
                No active workout routine set up.
                <div className="mt-3">
                  <Link href="/workout" className="px-4 py-2 rounded-xl bg-workout-500 text-slate-950 font-extrabold">
                    Build Workout Plan
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
            <span>Training Location: <strong className="text-white">{profile?.workoutLocation.toUpperCase()}</strong></span>
            <span className="text-workout-400 font-extrabold">{profile?.workoutDaysPerWeek} Days / Week</span>
          </div>
        </div>
      </div>

      {/* Coach AI Mindset Callout Widget */}
      <div className="glass-card rounded-3xl p-6 border border-flame-500/30 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl shadow-flame-500/10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-flame-500/20 text-flame-400 border border-flame-500/30 flex items-center justify-center shrink-0">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-black text-white uppercase tracking-tight">Need Pre-Workout Motivation or Meal Swaps?</h3>
            <p className="text-xs text-slate-300 mt-0.5">Coach AI is online and trained on elite exercise biomechanics & nutrition science.</p>
          </div>
        </div>

        <Link
          href="/coach"
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-flame-500 to-amber-500 hover:opacity-95 text-slate-950 text-xs font-black uppercase tracking-wider shadow-lg shadow-flame-500/20 transition-all shrink-0"
        >
          <Bot className="w-4 h-4" /> Ask Coach AI
        </Link>
      </div>
    </div>
  );
}
