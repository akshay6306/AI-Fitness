'use client';

import React, { useState, useEffect } from 'react';
import { 
  Dumbbell, 
  Sparkles, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  AlertCircle,
  Flame,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { getStoredProfile, getStoredWorkoutPlan, saveStoredWorkoutPlan } from '@/utils/storage';
import { WorkoutPlan, WorkoutDay, Exercise, UserProfile } from '@/types';

export default function WorkoutPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const prof = getStoredProfile();
    setProfile(prof);

    const stored = getStoredWorkoutPlan();
    if (stored) {
      setWorkoutPlan(stored);
    } else if (prof) {
      fetchWorkoutPlan(prof);
    }
  }, []);

  const fetchWorkoutPlan = async (prof: UserProfile) => {
    setLoading(true);
    try {
      const res = await fetch('/api/generate-workout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prof)
      });
      const data = await res.json();
      if (data.success && data.workoutPlan) {
        setWorkoutPlan(data.workoutPlan);
        saveStoredWorkoutPlan(data.workoutPlan);
      }
    } catch (e) {
      console.error('Failed to generate workout plan', e);
    } finally {
      setLoading(false);
    }
  };

  const toggleExerciseCheck = (id: string) => {
    setCompletedExercises(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const currentDay: WorkoutDay | undefined = workoutPlan?.schedule[activeDayIndex];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Dumbbell className="w-6 h-6 text-workout-400" />
            AI Workout & Training Planner
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Custom progressive overload routines tailored to your equipment & experience.
          </p>
        </div>

        <button
          onClick={() => profile && fetchWorkoutPlan(profile)}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-bold transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-workout-400 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Generating Routine...' : 'Regenerate Workout Split'}</span>
        </button>
      </div>

      {/* Profile Constraints Summary Bar */}
      {profile && (
        <div className="glass-card rounded-2xl p-4 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Location:</span>
            <span className="font-bold text-workout-400 capitalize">{profile.workoutLocation}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Split:</span>
            <span className="font-bold text-white">{profile.workoutDaysPerWeek} Days / Week</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Level:</span>
            <span className="font-bold text-nutrition-400 capitalize">{profile.experienceLevel}</span>
          </div>
          {profile.injuries.length > 0 && (
            <div className="flex items-center gap-1.5 text-amber-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Adapted for: {profile.injuries.join(', ')}</span>
            </div>
          )}
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="glass-card rounded-3xl p-12 text-center border border-slate-800">
          <Dumbbell className="w-12 h-12 text-workout-400 animate-bounce mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white">Head Coach AI is Structuring Your Program...</h3>
          <p className="text-xs text-slate-400 mt-1">Balancing muscle volume, rest intervals, and joint safety.</p>
        </div>
      )}

      {/* Workout Days Tabs */}
      {!loading && workoutPlan && (
        <div className="space-y-6">
          {/* Day Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800/80">
            {workoutPlan.schedule.map((day, idx) => {
              const isActive = activeDayIndex === idx;
              return (
                <button
                  key={day.dayNumber}
                  onClick={() => setActiveDayIndex(idx)}
                  className={`px-4 py-3 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-2 ${
                    isActive
                      ? 'bg-gradient-to-r from-workout-500/20 to-workout-600/10 text-white border-workout-500 shadow-md shadow-workout-500/10'
                      : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-extrabold ${
                    isActive ? 'bg-workout-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {day.dayNumber}
                  </span>
                  <span>{day.dayTitle}</span>
                </button>
              );
            })}
          </div>

          {/* Current Day Schedule View */}
          {currentDay && (
            <div className="space-y-5">
              {/* Day Header */}
              <div className="glass-card rounded-3xl p-6 border border-slate-800 flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <h2 className="text-xl font-extrabold text-white">{currentDay.dayTitle}</h2>
                  <p className="text-xs text-workout-400 mt-1 font-medium">Focus: {currentDay.focusArea}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
                    <Clock className="w-3.5 h-3.5 text-workout-400" />
                    Est. Duration: {currentDay.estimatedMinutes} mins
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    {currentDay.exercises.length} Exercises
                  </span>
                </div>
              </div>

              {/* Exercises List */}
              <div className="grid grid-cols-1 gap-4">
                {currentDay.exercises.map((exercise, idx) => {
                  const isChecked = !!completedExercises[exercise.id];

                  return (
                    <div
                      key={exercise.id}
                      className={`glass-card rounded-3xl p-6 border transition-all duration-200 ${
                        isChecked
                          ? 'border-slate-800/40 bg-slate-950/40 opacity-75'
                          : 'border-slate-800 hover:border-workout-500/30'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-slate-800/60 pb-4">
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => toggleExerciseCheck(exercise.id)}
                            className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 mt-1 transition-all ${
                              isChecked
                                ? 'bg-workout-500 border-workout-500 text-slate-950'
                                : 'border-slate-700 bg-slate-900 text-transparent hover:border-workout-400'
                            }`}
                          >
                            <CheckCircle2 className="w-4 h-4 fill-current" />
                          </button>
                          <div>
                            <span className="text-[10px] uppercase font-extrabold tracking-wider text-workout-400">
                              Exercise #{idx + 1}
                            </span>
                            <h3 className={`text-base font-extrabold ${isChecked ? 'line-through text-slate-400' : 'text-white'}`}>
                              {exercise.name}
                            </h3>
                          </div>
                        </div>

                        {/* Exercise Metrics Badges */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-white">
                            {exercise.sets} Sets
                          </span>
                          <span className="px-3 py-1 rounded-xl bg-workout-500/10 border border-workout-500/20 text-xs font-bold text-workout-400">
                            {exercise.reps} Reps
                          </span>
                          <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-400">
                            Rest: {exercise.restSeconds}s
                          </span>
                        </div>
                      </div>

                      {/* Exercise Technique & Progressive Overload details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4 text-xs">
                        {/* Targeted Muscle & Form Tips */}
                        <div>
                          <h4 className="font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            Targeted Muscles: <span className="text-workout-400 font-semibold">{exercise.targetMuscle}</span>
                          </h4>
                          <ul className="space-y-1 text-slate-300">
                            {exercise.formTips.map((tip, tIdx) => (
                              <li key={tIdx} className="flex items-start gap-1.5">
                                <span className="text-workout-400">•</span>
                                <span className="leading-relaxed">{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Progressive Overload Recommendation */}
                        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                          <h4 className="font-bold text-nutrition-400 uppercase tracking-wider mb-1 flex items-center gap-1.5 text-[11px]">
                            <TrendingUp className="w-3.5 h-3.5 text-nutrition-400" />
                            AI Progressive Overload Recommendation
                          </h4>
                          <p className="text-slate-300 leading-relaxed text-xs">
                            {exercise.progressiveOverloadTip}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
