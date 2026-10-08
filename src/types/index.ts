export type BiologicalSex = 'male' | 'female' | 'other';

export type ActivityLevel = 
  | 'sedentary'
  | 'lightly_active'
  | 'moderately_active'
  | 'very_active'
  | 'extra_active';

export type FitnessGoal = 
  | 'weight_loss'
  | 'muscle_gain'
  | 'maintenance'
  | 'endurance';

export type DietaryPreference = 
  | 'balanced'
  | 'vegetarian'
  | 'vegan'
  | 'keto'
  | 'paleo'
  | 'mediterranean'
  | 'low_carb'
  | 'high_protein';

export type EquipmentOption = 
  | 'full_gym'
  | 'dumbbells'
  | 'barbell'
  | 'kettlebell'
  | 'resistance_bands'
  | 'bodyweight';

export interface UserProfile {
  name: string;
  age: number;
  sex: BiologicalSex;
  heightCm: number;
  weightKg: number;
  targetWeightKg: number;
  activityLevel: ActivityLevel;
  goal: FitnessGoal;
  dietaryPreferences: DietaryPreference[];
  allergies: string[];
  budgetLevel: 'budget' | 'moderate' | 'premium';
  prepTimeMinutes: number;
  injuries: string[];
  workoutLocation: 'home' | 'gym';
  availableEquipment: EquipmentOption[];
  workoutDaysPerWeek: number;
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  onboardingCompleted: boolean;
}

export type BMICategory = 'Underweight' | 'Normal' | 'Overweight' | 'Obese';

export interface MacroDistribution {
  proteinGrams: number;
  proteinCalories: number;
  carbsGrams: number;
  carbsCalories: number;
  fatsGrams: number;
  fatsCalories: number;
  proteinPct: number;
  carbsPct: number;
  fatsPct: number;
}

export interface BiometricResult {
  bmi: number;
  bmiCategory: BMICategory;
  bmr: number; // Mifflin-St Jeor equation
  tdee: number; // Total Daily Energy Expenditure
  targetCalories: number;
  isUnsafeCalorieDeficit: boolean;
  safetyWarningMessage?: string;
  macros: MacroDistribution;
}

export interface Ingredient {
  item: string;
  amount: string;
  category: 'Produce' | 'Protein & Meat' | 'Dairy & Eggs' | 'Pantry & Spices' | 'Grains & Bakery' | 'Other';
}

export interface Recipe {
  id: string;
  name: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  ingredients: Ingredient[];
  instructions: string[];
  tips?: string;
  imageUrl?: string;
}

export interface MealPlan {
  id: string;
  createdAt: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  meals: Recipe[];
}

export interface Exercise {
  id: string;
  name: string;
  targetMuscle: string;
  secondaryMuscles?: string[];
  sets: number;
  reps: string;
  restSeconds: number;
  equipmentRequired: string;
  formTips: string[];
  progressiveOverloadTip: string;
}

export interface WorkoutDay {
  dayNumber: number;
  dayTitle: string; // e.g. "Day 1: Push (Chest, Shoulders & Triceps)"
  focusArea: string;
  estimatedMinutes: number;
  exercises: Exercise[];
  isCompleted?: boolean;
}

export interface WorkoutPlan {
  id: string;
  createdAt: string;
  splitName: string; // e.g. "Push / Pull / Legs (PPL) - 6 Days"
  daysPerWeek: number;
  schedule: WorkoutDay[];
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  weightKg?: number;
  waterMl: number;
  steps: number;
  caloriesConsumed: number;
  proteinConsumed: number;
  carbsConsumed: number;
  fatConsumed: number;
  workoutCompleted: boolean;
  workoutName?: string;
  notes?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  suggestedActions?: string[];
}
