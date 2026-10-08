'use client';

import React, { useState, useEffect } from 'react';
import { LineChart as LineIcon, Scale, Flame, Droplet, Plus, Calendar } from 'lucide-react';
import { getStoredProfile, getStoredLogs, saveDailyLog } from '@/utils/storage';
import { computeBiometrics } from '@/utils/biometrics';
import { DailyLog, UserProfile } from '@/types';
import WeightChart from '@/components/progress/WeightChart';
import MacroRingChart from '@/components/progress/MacroRingChart';
import HabitTracker from '@/components/progress/HabitTracker';

export default function ProgressPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [todayLog, setTodayLog] = useState<DailyLog | null>(null);
  const [logWeightModal, setLogWeightModal] = useState(false);
  const [newWeightInput, setNewWeightInput] = useState(78.0);

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const prof = getStoredProfile();
    setProfile(prof);

    const storedLogs = getStoredLogs();
    setLogs(storedLogs);

    const foundToday = storedLogs.find(l => l.date === todayStr);
    if (foundToday) {
      setTodayLog(foundToday);
    } else {
      const initialToday: DailyLog = {
        date: todayStr,
        weightKg: prof?.weightKg || 78,
        waterMl: 1250,
        steps: 6400,
        caloriesConsumed: 1450,
        proteinConsumed: 110,
        carbsConsumed: 130,
        fatConsumed: 45,
        workoutCompleted: false
      };
      setTodayLog(initialToday);
    }
  }, []);

  const biometrics = profile ? computeBiometrics(profile) : null;

  const handleLogUpdate = (updated: DailyLog) => {
    setTodayLog(updated);
    const newLogs = getStoredLogs();
    setLogs(newLogs);
  };

  const handleSaveWeight = () => {
    if (!todayLog) return;
    const updated: DailyLog = {
      ...todayLog,
      weightKg: newWeightInput
    };
    saveDailyLog(updated);
    handleLogUpdate(updated);
    setLogWeightModal(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <LineIcon className="w-6 h-6 text-nutrition-400" />
            Progress & Analytics Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time weight trends, daily macro adherence, and hydration logs over time.
          </p>
        </div>

        <button
          onClick={() => setLogWeightModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-nutrition-500 to-workout-500 hover:opacity-95 text-slate-950 text-xs font-extrabold shadow-md shadow-nutrition-500/20 transition-all"
        >
          <Scale className="w-4 h-4" />
          <span>Log Scale Weight</span>
        </button>
      </div>

      {/* Habit & Hydration Tracker */}
      {todayLog && (
        <HabitTracker todayLog={todayLog} onLogUpdate={handleLogUpdate} />
      )}

      {/* Daily Macro Ring Tracker */}
      {biometrics && todayLog && (
        <MacroRingChart biometrics={biometrics} todayLog={todayLog} onLogUpdate={handleLogUpdate} />
      )}

      {/* Recharts Weight Trend Graph */}
      {profile && logs.length > 0 && (
        <WeightChart logs={logs} targetWeightKg={profile.targetWeightKg} />
      )}

      {/* Log Weight Scale Modal */}
      {logWeightModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-sm rounded-3xl p-6 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-nutrition-400" /> Log Today&apos;s Scale Weight
            </h3>
            <div>
              <label className="block text-xs text-slate-300 mb-1">Weight in Kilograms (kg)</label>
              <input
                type="number"
                step="0.1"
                value={newWeightInput}
                onChange={(e) => setNewWeightInput(parseFloat(e.target.value) || 75)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-nutrition-500"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setLogWeightModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveWeight}
                className="px-5 py-2 rounded-xl bg-nutrition-500 text-slate-950 text-xs font-extrabold shadow-md shadow-nutrition-500/20"
              >
                Save Weight
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
