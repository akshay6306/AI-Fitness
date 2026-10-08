import { UserProfile, DailyLog, MealPlan, WorkoutPlan } from '../types';

const STORAGE_KEYS = {
  PROFILE: 'fitmind_user_profile',
  MEAL_PLAN: 'fitmind_meal_plan',
  WORKOUT_PLAN: 'fitmind_workout_plan',
  DAILY_LOGS: 'fitmind_daily_logs',
  GROCERY_CHECKLIST: 'fitmind_grocery_checklist',
};

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: 'Alex Vance',
  age: 28,
  sex: 'male',
  heightCm: 178,
  weightKg: 78,
  targetWeightKg: 72,
  activityLevel: 'moderately_active',
  goal: 'weight_loss',
  dietaryPreferences: ['high_protein'],
  allergies: ['Peanuts'],
  budgetLevel: 'moderate',
  prepTimeMinutes: 30,
  injuries: ['Mild right knee pain'],
  workoutLocation: 'gym',
  availableEquipment: ['full_gym', 'dumbbells', 'barbell'],
  workoutDaysPerWeek: 4,
  experienceLevel: 'intermediate',
  onboardingCompleted: true,
};

export function getStoredProfile(): UserProfile {
  if (typeof window === 'undefined') return DEFAULT_USER_PROFILE;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!data) return DEFAULT_USER_PROFILE;
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to parse stored profile', e);
    return DEFAULT_USER_PROFILE;
  }
}

export function saveStoredProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile', e);
  }
}

export function getStoredMealPlan(): MealPlan | null {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.MEAL_PLAN);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
}

export function saveStoredMealPlan(mealPlan: MealPlan): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.MEAL_PLAN, JSON.stringify(mealPlan));
  } catch (e) {
    console.error('Failed to save meal plan', e);
  }
}

export function getStoredWorkoutPlan(): WorkoutPlan | null {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.WORKOUT_PLAN);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
}

export function saveStoredWorkoutPlan(workoutPlan: WorkoutPlan): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.WORKOUT_PLAN, JSON.stringify(workoutPlan));
  } catch (e) {
    console.error('Failed to save workout plan', e);
  }
}

export function getStoredLogs(): DailyLog[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEYS.DAILY_LOGS);
    if (!data) {
      // Seed default logs for past 7 days to showcase dynamic progress graphs out-of-the-box
      const seedLogs: DailyLog[] = generateSeedLogs();
      localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(seedLogs));
      return seedLogs;
    }
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

export function saveDailyLog(log: DailyLog): void {
  if (typeof window === 'undefined') return;
  try {
    const logs = getStoredLogs();
    const index = logs.findIndex(l => l.date === log.date);
    if (index >= 0) {
      logs[index] = { ...logs[index], ...log };
    } else {
      logs.push(log);
    }
    localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(logs));
  } catch (e) {
    console.error('Failed to save daily log', e);
  }
}

function generateSeedLogs(): DailyLog[] {
  const logs: DailyLog[] = [];
  const today = new Date();
  
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    
    // Gradual weight loss curve from 80.5kg down to 78.0kg
    const weightVal = parseFloat((80.5 - (13 - i) * 0.18 + (Math.sin(i) * 0.15)).toFixed(1));
    
    logs.push({
      date: dateStr,
      weightKg: weightVal,
      waterMl: 2000 + (i % 3) * 250,
      steps: 7500 + (i % 4) * 1200,
      caloriesConsumed: 2050 + (i % 2) * 100,
      proteinConsumed: 160 + (i % 3) * 5,
      carbsConsumed: 180 + (i % 4) * 10,
      fatConsumed: 60 + (i % 2) * 4,
      workoutCompleted: i % 2 === 0,
      workoutName: i % 2 === 0 ? (i % 4 === 0 ? 'Push Hypertrophy' : 'Pull & Biceps') : undefined
    });
  }
  
  return logs;
}
