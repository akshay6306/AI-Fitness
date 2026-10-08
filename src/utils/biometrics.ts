import { ActivityLevel, BiologicalSex, BiometricResult, BMICategory, FitnessGoal, MacroDistribution, UserProfile } from '../types';

export function calculateBMI(weightKg: number, heightCm: number): { bmi: number; category: BMICategory } {
  if (heightCm <= 0 || weightKg <= 0) {
    return { bmi: 0, category: 'Normal' };
  }
  
  const heightMeters = heightCm / 100;
  const bmi = parseFloat((weightKg / (heightMeters * heightMeters)).toFixed(1));

  let category: BMICategory = 'Normal';
  if (bmi < 18.5) {
    category = 'Underweight';
  } else if (bmi < 25.0) {
    category = 'Normal';
  } else if (bmi < 30.0) {
    category = 'Overweight';
  } else {
    category = 'Obese';
  }

  return { bmi, category };
}

export function calculateBMR(weightKg: number, heightCm: number, age: number, sex: BiologicalSex): number {
  if (weightKg <= 0 || heightCm <= 0 || age <= 0) return 1800;

  // Mifflin-St Jeor Equation
  if (sex === 'male') {
    return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age + 5);
  } else if (sex === 'female') {
    return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age - 161);
  } else {
    // Average for other
    return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age - 78);
  }
}

export function getActivityMultiplier(activityLevel: ActivityLevel): number {
  switch (activityLevel) {
    case 'sedentary':
      return 1.2;
    case 'lightly_active':
      return 1.375;
    case 'moderately_active':
      return 1.55;
    case 'very_active':
      return 1.725;
    case 'extra_active':
      return 1.9;
    default:
      return 1.375;
  }
}

export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  const multiplier = getActivityMultiplier(activityLevel);
  return Math.round(bmr * multiplier);
}

export function calculateMacros(targetCalories: number, goal: FitnessGoal): MacroDistribution {
  let proteinPct = 0.30;
  let carbsPct = 0.40;
  let fatsPct = 0.30;

  switch (goal) {
    case 'weight_loss':
      proteinPct = 0.35;
      carbsPct = 0.35;
      fatsPct = 0.30;
      break;
    case 'muscle_gain':
      proteinPct = 0.30;
      carbsPct = 0.50;
      fatsPct = 0.20;
      break;
    case 'maintenance':
      proteinPct = 0.25;
      carbsPct = 0.45;
      fatsPct = 0.30;
      break;
    case 'endurance':
      proteinPct = 0.20;
      carbsPct = 0.60;
      fatsPct = 0.20;
      break;
  }

  const proteinCalories = Math.round(targetCalories * proteinPct);
  const carbsCalories = Math.round(targetCalories * carbsPct);
  const fatsCalories = Math.round(targetCalories * fatsPct);

  const proteinGrams = Math.round(proteinCalories / 4);
  const carbsGrams = Math.round(carbsCalories / 4);
  const fatsGrams = Math.round(fatsCalories / 9);

  return {
    proteinGrams,
    proteinCalories,
    carbsGrams,
    carbsCalories,
    fatsGrams,
    fatsCalories,
    proteinPct: Math.round(proteinPct * 100),
    carbsPct: Math.round(carbsPct * 100),
    fatsPct: Math.round(fatsPct * 100)
  };
}

export function computeBiometrics(profile: Partial<UserProfile>): BiometricResult {
  const age = profile.age || 25;
  const sex = profile.sex || 'male';
  const heightCm = profile.heightCm || 175;
  const weightKg = profile.weightKg || 70;
  const activityLevel = profile.activityLevel || 'moderately_active';
  const goal = profile.goal || 'weight_loss';

  const { bmi, category: bmiCategory } = calculateBMI(weightKg, heightCm);
  const bmr = calculateBMR(weightKg, heightCm, age, sex);
  const tdee = calculateTDEE(bmr, activityLevel);

  let rawTargetCalories = tdee;
  if (goal === 'weight_loss') {
    rawTargetCalories = tdee - 500;
  } else if (goal === 'muscle_gain') {
    rawTargetCalories = tdee + 350;
  } else if (goal === 'endurance') {
    rawTargetCalories = tdee + 150;
  }

  // Safety Boundary: women < 1,200 kcal/day, men < 1,500 kcal/day
  const minSafeCalories = sex === 'female' ? 1200 : 1500;
  let isUnsafeCalorieDeficit = false;
  let targetCalories = Math.round(rawTargetCalories);
  let safetyWarningMessage: string | undefined = undefined;

  if (rawTargetCalories < minSafeCalories) {
    isUnsafeCalorieDeficit = true;
    targetCalories = minSafeCalories;
    safetyWarningMessage = `Your projected intake of ${Math.round(rawTargetCalories)} kcal/day falls below the medically recommended safety threshold (${minSafeCalories} kcal/day for ${sex === 'female' ? 'women' : 'men'}). FitMind AI has automatically adjusted your daily target to ${minSafeCalories} kcal to ensure safe, sustainable metabolism.`;
  }

  const macros = calculateMacros(targetCalories, goal);

  return {
    bmi,
    bmiCategory,
    bmr,
    tdee,
    targetCalories,
    isUnsafeCalorieDeficit,
    safetyWarningMessage,
    macros
  };
}
