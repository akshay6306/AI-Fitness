'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Target, 
  Utensils, 
  Dumbbell, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  ShieldAlert,
  Save
} from 'lucide-react';
import { getStoredProfile, saveStoredProfile, DEFAULT_USER_PROFILE } from '@/utils/storage';
import { computeBiometrics } from '@/utils/biometrics';
import { UserProfile, BiologicalSex, ActivityLevel, FitnessGoal, DietaryPreference, EquipmentOption } from '@/types';
import BiometricsCard from '@/components/biometrics/BiometricsCard';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const stored = getStoredProfile();
    if (stored) setProfile(stored);
  }, []);

  const biometrics = computeBiometrics(profile);

  const handleSave = () => {
    const updated = { ...profile, onboardingCompleted: true };
    saveStoredProfile(updated);
    setIsSaved(true);
    setTimeout(() => {
      router.push('/');
    }, 800);
  };

  const updateProfile = (fields: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...fields }));
  };

  const toggleDietaryPref = (pref: DietaryPreference) => {
    const current = profile.dietaryPreferences;
    const exists = current.includes(pref);
    const updated = exists ? current.filter(p => p !== pref) : [...current, pref];
    updateProfile({ dietaryPreferences: updated });
  };

  const toggleEquipment = (eq: EquipmentOption) => {
    const current = profile.availableEquipment;
    const exists = current.includes(eq);
    const updated = exists ? current.filter(e => e !== eq) : [...current, eq];
    updateProfile({ availableEquipment: updated });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Page Title Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <User className="w-6 h-6 text-nutrition-400" />
            Biometric Onboarding & Profile Setup
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Configure your physical metrics, fitness targets, dietary restrictions, and training equipment.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step === s
                  ? 'bg-nutrition-500 text-slate-950 shadow-lg shadow-nutrition-500/20 scale-110'
                  : step > s
                  ? 'bg-slate-800 text-nutrition-400 border border-nutrition-500/30'
                  : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
            >
              {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
            </div>
          ))}
        </div>
      </div>

      {/* Real-time Biometrics Calculation Card */}
      <div className="bg-slate-900/40 p-4 rounded-3xl border border-slate-800">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-nutrition-400 animate-pulse" />
          Live Calculated Biometrics Engine
        </h3>
        <BiometricsCard biometrics={biometrics} profile={profile} />
      </div>

      {/* Form Wizard Container */}
      <div className="glass-card rounded-3xl p-6 md:p-8 border border-slate-800 relative">
        {/* Step 1: Basic Information */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <User className="w-5 h-5 text-nutrition-400" /> Step 1: Personal Biometrics
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => updateProfile({ name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-nutrition-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Age (Years)</label>
                <input
                  type="number"
                  value={profile.age}
                  onChange={(e) => updateProfile({ age: parseInt(e.target.value) || 25 })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-nutrition-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Biological Sex</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['male', 'female', 'other'] as BiologicalSex[]).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => updateProfile({ sex: s })}
                      className={`py-2.5 rounded-xl text-xs font-bold capitalize transition-all border ${
                        profile.sex === s
                          ? 'bg-nutrition-500/20 text-nutrition-400 border-nutrition-500'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-850'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Height (cm)</label>
                <input
                  type="number"
                  value={profile.heightCm}
                  onChange={(e) => updateProfile({ heightCm: parseFloat(e.target.value) || 175 })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-nutrition-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Current Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={profile.weightKg}
                  onChange={(e) => updateProfile({ weightKg: parseFloat(e.target.value) || 70 })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-nutrition-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Target Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={profile.targetWeightKg}
                  onChange={(e) => updateProfile({ targetWeightKg: parseFloat(e.target.value) || 68 })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-nutrition-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Goal & Activity Level */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-workout-400" /> Step 2: Fitness Goals & Activity
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-3">Primary Goal</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'weight_loss', label: 'Weight Loss', desc: 'Burn fat in healthy calorie deficit' },
                  { id: 'muscle_gain', label: 'Muscle Gain', desc: 'Build lean mass with protein surplus' },
                  { id: 'maintenance', label: 'Maintenance', desc: 'Optimize energy & maintain weight' },
                  { id: 'endurance', label: 'Endurance', desc: 'Fuel athletic performance & stamina' },
                ].map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => updateProfile({ goal: g.id as FitnessGoal })}
                    className={`p-3.5 rounded-xl text-left border transition-all ${
                      profile.goal === g.id
                        ? 'bg-workout-500/20 border-workout-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850'
                    }`}
                  >
                    <div className="font-bold text-xs text-workout-400 mb-1">{g.label}</div>
                    <div className="text-[10px] text-slate-400 leading-tight">{g.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-3">Daily Activity Level</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'sedentary', title: 'Sedentary', sub: 'Desk job, minimal daily movement' },
                  { id: 'lightly_active', title: 'Lightly Active', sub: '1-3 light workouts/week' },
                  { id: 'moderately_active', title: 'Moderately Active', sub: '3-5 moderate workouts/week' },
                  { id: 'very_active', title: 'Very Active', sub: '6-7 intense workouts/week' },
                  { id: 'extra_active', title: 'Extra Active', sub: 'Physical job or 2x training/day' },
                ].map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => updateProfile({ activityLevel: a.id as ActivityLevel })}
                    className={`p-3 rounded-xl text-left border transition-all ${
                      profile.activityLevel === a.id
                        ? 'bg-nutrition-500/20 border-nutrition-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="font-bold text-xs text-nutrition-400">{a.title}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{a.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Training Experience</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['beginner', 'intermediate', 'advanced'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => updateProfile({ experienceLevel: lvl })}
                      className={`py-2 rounded-xl text-xs font-bold capitalize border ${
                        profile.experienceLevel === lvl
                          ? 'bg-workout-500/20 text-workout-400 border-workout-500'
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Workout Days Per Week ({profile.workoutDaysPerWeek} Days)</label>
                <input
                  type="range"
                  min="3"
                  max="6"
                  value={profile.workoutDaysPerWeek}
                  onChange={(e) => updateProfile({ workoutDaysPerWeek: parseInt(e.target.value) })}
                  className="w-full accent-nutrition-500 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>3 Days (Full Body)</span>
                  <span>4 Days (Upper/Lower)</span>
                  <span>6 Days (PPL Split)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Dietary Preferences & Filters */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Utensils className="w-5 h-5 text-nutrition-400" /> Step 3: Dietary Preferences & Filters
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-3">Dietary Style (Select all that apply)</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'balanced', label: 'Balanced' },
                  { id: 'high_protein', label: 'High Protein' },
                  { id: 'vegetarian', label: 'Vegetarian' },
                  { id: 'vegan', label: 'Vegan' },
                  { id: 'keto', label: 'Keto' },
                  { id: 'paleo', label: 'Paleo' },
                  { id: 'mediterranean', label: 'Mediterranean' },
                  { id: 'low_carb', label: 'Low Carb' },
                ].map((d) => {
                  const selected = profile.dietaryPreferences.includes(d.id as DietaryPreference);
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => toggleDietaryPref(d.id as DietaryPreference)}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-between ${
                        selected
                          ? 'bg-nutrition-500/20 text-nutrition-400 border-nutrition-500'
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      <span>{d.label}</span>
                      {selected && <CheckCircle2 className="w-3.5 h-3.5 text-nutrition-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Allergies / Exclusions (Comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Peanuts, Dairy, Gluten, Shellfish"
                  value={profile.allergies.join(', ')}
                  onChange={(e) => updateProfile({ allergies: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-nutrition-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Max Cooking Prep Time (Minutes)</label>
                <input
                  type="number"
                  value={profile.prepTimeMinutes}
                  onChange={(e) => updateProfile({ prepTimeMinutes: parseInt(e.target.value) || 30 })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-nutrition-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Physical Constraints & Equipment */}
        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-workout-400" /> Step 4: Physical Constraints & Equipment
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Workout Location</label>
                <div className="grid grid-cols-2 gap-3">
                  {(['gym', 'home'] as const).map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => updateProfile({ workoutLocation: loc })}
                      className={`py-3 rounded-xl text-xs font-bold uppercase tracking-wider border ${
                        profile.workoutLocation === loc
                          ? 'bg-workout-500/20 text-workout-400 border-workout-500'
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      {loc === 'gym' ? '🏋️ Full Gym' : '🏠 Home Workout'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Injuries / Medical Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Mild right knee pain, lower back stiffness"
                  value={profile.injuries.join(', ')}
                  onChange={(e) => updateProfile({ injuries: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-workout-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-3">Available Training Equipment</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { id: 'full_gym', label: 'Full Commercial Gym' },
                  { id: 'dumbbells', label: 'Dumbbells' },
                  { id: 'barbell', label: 'Barbell & Plates' },
                  { id: 'kettlebell', label: 'Kettlebells' },
                  { id: 'resistance_bands', label: 'Resistance Bands' },
                  { id: 'bodyweight', label: 'Bodyweight Only' },
                ].map((eq) => {
                  const selected = profile.availableEquipment.includes(eq.id as EquipmentOption);
                  return (
                    <button
                      key={eq.id}
                      type="button"
                      onClick={() => toggleEquipment(eq.id as EquipmentOption)}
                      className={`p-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-between ${
                        selected
                          ? 'bg-workout-500/20 text-workout-400 border-workout-500'
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      <span>{eq.label}</span>
                      {selected && <CheckCircle2 className="w-3.5 h-3.5 text-workout-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="mt-8 pt-5 border-t border-slate-800 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          ) : <div />}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-nutrition-500 hover:bg-nutrition-400 text-slate-950 text-xs font-extrabold transition-all shadow-md shadow-nutrition-500/20"
            >
              Next Step <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-nutrition-500 to-workout-500 hover:opacity-95 text-slate-950 text-xs font-extrabold shadow-lg shadow-nutrition-500/20 transition-all"
            >
              <Save className="w-4 h-4" /> {isSaved ? 'Saving Profile...' : 'Save & Generate AI Plan'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
