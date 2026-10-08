import { GoogleGenerativeAI } from '@google/generative-ai';
import { UserProfile, MealPlan, Recipe, WorkoutPlan, WorkoutDay, Exercise, BiometricResult } from '../types';
import { computeBiometrics } from './biometrics';

const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// ==========================================
// 1. MEAL PLAN GENERATION
// ==========================================

export async function generateAIMealPlan(profile: UserProfile, biometrics: BiometricResult): Promise<MealPlan> {
  const prompt = `
You are FitMind AI's Master Sports Nutritionist.
Generate a structured 1-day meal plan for a user with the following profile:
- Goal: ${profile.goal}
- Target Daily Calories: ${biometrics.targetCalories} kcal
- Target Macros: Protein ${biometrics.macros.proteinGrams}g, Carbs ${biometrics.macros.carbsGrams}g, Fats ${biometrics.macros.fatsGrams}g
- Dietary Preferences: ${profile.dietaryPreferences.join(', ') || 'None'}
- Allergies / Restrictions: ${profile.allergies.join(', ') || 'None'}
- Max Prep Time per meal: ${profile.prepTimeMinutes} minutes
- Budget Level: ${profile.budgetLevel}

OUTPUT RULES:
Return strict valid JSON representing the MealPlan matching this TypeScript interface:
{
  "totalCalories": number,
  "totalProtein": number,
  "totalCarbs": number,
  "totalFat": number,
  "meals": [
    {
      "id": string,
      "name": string,
      "mealType": "breakfast" | "lunch" | "dinner" | "snack",
      "calories": number,
      "proteinGrams": number,
      "carbsGrams": number,
      "fatGrams": number,
      "prepTimeMinutes": number,
      "cookTimeMinutes": number,
      "ingredients": [
        { "item": string, "amount": string, "category": "Produce" | "Protein & Meat" | "Dairy & Eggs" | "Pantry & Spices" | "Grains & Bakery" | "Other" }
      ],
      "instructions": [string],
      "tips": string
    }
  ]
}
Include exactly 4 meals: 1 breakfast, 1 lunch, 1 dinner, and 1 snack. Sum of macros should closely match the targets.
Do not wrap response in markdown codeblock if possible, or use standard JSON format.
`;

  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const response = await model.generateContent(prompt);
      const text = response.response.text();
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      return {
        id: `meal_plan_${Date.now()}`,
        createdAt: new Date().toISOString(),
        ...parsed
      };
    } catch (err) {
      console.warn('Gemini API call failed or unconfigured, using fallback meal generator:', err);
    }
  }

  // Fallback intelligent generator tuned to biometrics
  return generateFallbackMealPlan(profile, biometrics);
}

// ==========================================
// 2. MEAL REGENERATION / SWAP
// ==========================================

export async function regenerateSingleMeal(
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack',
  profile: UserProfile,
  targetMacros: { calories: number; protein: number; carbs: number; fat: number }
): Promise<Recipe> {
  const prompt = `
Generate a single alternative ${mealType} recipe for a fitness user.
Target per-meal stats: ${targetMacros.calories} kcal, ${targetMacros.protein}g protein, ${targetMacros.carbs}g carbs, ${targetMacros.fat}g fat.
Dietary Preferences: ${profile.dietaryPreferences.join(', ') || 'Balanced'}.
Allergies: ${profile.allergies.join(', ') || 'None'}.

Return JSON:
{
  "id": "recipe_${Date.now()}",
  "name": string,
  "mealType": "${mealType}",
  "calories": number,
  "proteinGrams": number,
  "carbsGrams": number,
  "fatGrams": number,
  "prepTimeMinutes": number,
  "cookTimeMinutes": number,
  "ingredients": [{ "item": string, "amount": string, "category": "Produce" | "Protein & Meat" | "Dairy & Eggs" | "Pantry & Spices" | "Grains & Bakery" | "Other" }],
  "instructions": [string],
  "tips": string
}
`;

  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const response = await model.generateContent(prompt);
      const text = response.response.text();
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned);
    } catch (err) {
      console.warn('Gemini API call failed, returning smart fallback recipe:', err);
    }
  }

  return generateFallbackRecipe(mealType, profile, targetMacros);
}

// ==========================================
// 3. WORKOUT PLAN GENERATION
// ==========================================

export async function generateAIWorkoutPlan(profile: UserProfile): Promise<WorkoutPlan> {
  const prompt = `
You are FitMind AI's Head Strength & Conditioning Coach.
Generate a structured training program for:
- Days per week: ${profile.workoutDaysPerWeek}
- Location: ${profile.workoutLocation}
- Equipment Available: ${profile.availableEquipment.join(', ')}
- Goal: ${profile.goal}
- Experience Level: ${profile.experienceLevel}
- Physical Constraints / Injuries: ${profile.injuries.join(', ') || 'None'}

OUTPUT RULES:
Return strict valid JSON matching:
{
  "splitName": string, // e.g. "Push / Pull / Legs / Upper / Lower"
  "daysPerWeek": number,
  "schedule": [
    {
      "dayNumber": number,
      "dayTitle": string,
      "focusArea": string,
      "estimatedMinutes": number,
      "exercises": [
        {
          "id": string,
          "name": string,
          "targetMuscle": string,
          "secondaryMuscles": [string],
          "sets": number,
          "reps": string,
          "restSeconds": number,
          "equipmentRequired": string,
          "formTips": [string],
          "progressiveOverloadTip": string
        }
      ]
    }
  ]
}
`;

  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const response = await model.generateContent(prompt);
      const text = response.response.text();
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      return {
        id: `workout_plan_${Date.now()}`,
        createdAt: new Date().toISOString(),
        ...parsed
      };
    } catch (err) {
      console.warn('Gemini API failed, using fallback workout generator:', err);
    }
  }

  return generateFallbackWorkoutPlan(profile);
}

// ==========================================
// 4. AI COACH CHATBOT
// ==========================================

export async function getAICoachResponse(
  userQuery: string,
  profile: UserProfile,
  biometrics: BiometricResult,
  chatHistory: { role: 'user' | 'assistant'; content: string }[]
): Promise<string> {
  const systemPrompt = `
You are Coach AI, the world-class lead health, fitness, and nutrition coach at FitMind AI.
You adhere strictly to exercise science, sports biomechanics, and evidence-based clinical nutrition.

USER CONTEXT:
- Name: ${profile.name}
- Age: ${profile.age}, Sex: ${profile.sex}
- Height: ${profile.heightCm}cm, Weight: ${profile.weightKg}kg (Target: ${profile.targetWeightKg}kg)
- Primary Goal: ${profile.goal}
- Calculated BMI: ${biometrics.bmi} (${biometrics.bmiCategory})
- Target Daily Calories: ${biometrics.targetCalories} kcal (Protein: ${biometrics.macros.proteinGrams}g, Carbs: ${biometrics.macros.carbsGrams}g, Fats: ${biometrics.macros.fatsGrams}g)
- Equipment: ${profile.availableEquipment.join(', ')}
- Injuries / Limitations: ${profile.injuries.join(', ') || 'None'}
- Dietary Preferences: ${profile.dietaryPreferences.join(', ') || 'Standard'}

INSTRUCTIONS:
- Give empowering, highly actionable, concise, and structured advice using markdown formatting (bullet points, bold text).
- If answering injury questions, suggest safe exercise variations and emphasize proper biomechanics.
- Always remain encouraging, friendly, and scientifically accurate.
- Maintain a non-intrusive safety boundary if extreme calorie restriction or unsafe overtraining is requested.
`;

  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        systemInstruction: systemPrompt
      });
      const historyFormatted = chatHistory.slice(-6).map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      const chat = model.startChat({ history: historyFormatted });
      const result = await chat.sendMessage(userQuery);
      return result.response.text();
    } catch (err) {
      console.warn('Gemini chat error, returning intelligent fallback chat response:', err);
    }
  }

  return getFallbackCoachResponse(userQuery, profile, biometrics);
}

// ==========================================
// FALLBACK GENERATORS (OFFLINE / NO KEY SUPPORT)
// ==========================================

function generateFallbackMealPlan(profile: UserProfile, biometrics: BiometricResult): MealPlan {
  const targetCals = biometrics.targetCalories;
  const isVeg = profile.dietaryPreferences.includes('vegetarian') || profile.dietaryPreferences.includes('vegan');
  const isKeto = profile.dietaryPreferences.includes('keto');

  const bCal = Math.round(targetCals * 0.25);
  const lCal = Math.round(targetCals * 0.35);
  const dCal = Math.round(targetCals * 0.30);
  const sCal = Math.round(targetCals * 0.10);

  const meals: Recipe[] = [
    {
      id: 'meal_1',
      name: isKeto ? 'Avocado & Spinach Omelette with Feta' : isVeg ? 'High-Protein Oats with Berries & Almond Butter' : 'Egg White & Whole Egg Scramble with Avocado Toast',
      mealType: 'breakfast',
      calories: bCal,
      proteinGrams: Math.round((bCal * 0.3) / 4),
      carbsGrams: Math.round((bCal * (isKeto ? 0.05 : 0.45)) / 4),
      fatGrams: Math.round((bCal * (isKeto ? 0.65 : 0.25)) / 9),
      prepTimeMinutes: 10,
      cookTimeMinutes: 10,
      ingredients: [
        { item: isVeg ? 'Rolled Oats' : 'Large Eggs', amount: isVeg ? '80g' : '3 whole', category: isVeg ? 'Grains & Bakery' : 'Dairy & Eggs' },
        { item: 'Fresh Spinach', amount: '50g', category: 'Produce' },
        { item: 'Avocado', amount: '1/2 medium', category: 'Produce' },
        { item: 'Whey / Plant Protein Powder', amount: '1 scoop (30g)', category: 'Pantry & Spices' },
        { item: 'Blueberries', amount: '50g', category: 'Produce' }
      ],
      instructions: [
        'Whisk eggs/oats with protein powder and water or almond milk.',
        'Sauté spinach in olive oil until wilted.',
        'Cook on medium heat for 4-5 minutes.',
        'Top with sliced avocado and fresh berries.'
      ],
      tips: 'Prep the ingredients the night before for a fast 5-minute morning routine.'
    },
    {
      id: 'meal_2',
      name: isVeg ? 'Grilled Tofu & Quinoa Power Bowl' : 'Grilled Herb Chicken Breast with Quinoa & Roasted Veggies',
      mealType: 'lunch',
      calories: lCal,
      proteinGrams: Math.round((lCal * 0.35) / 4),
      carbsGrams: Math.round((lCal * 0.40) / 4),
      fatGrams: Math.round((lCal * 0.25) / 9),
      prepTimeMinutes: 15,
      cookTimeMinutes: 20,
      ingredients: [
        { item: isVeg ? 'Firm Tofu' : 'Chicken Breast', amount: '200g', category: isVeg ? 'Dairy & Eggs' : 'Protein & Meat' },
        { item: 'Quinoa (cooked)', amount: '150g', category: 'Grains & Bakery' },
        { item: 'Broccoli florets', amount: '100g', category: 'Produce' },
        { item: 'Olive Oil', amount: '1 tbsp (15ml)', category: 'Pantry & Spices' },
        { item: 'Garlic Powder & Herbs', amount: 'To taste', category: 'Pantry & Spices' }
      ],
      instructions: [
        'Season chicken/tofu with olive oil, garlic powder, salt, and black pepper.',
        'Grill on high heat for 6-8 minutes per side until internal temp reaches 165°F (74°C).',
        'Steam broccoli for 4 minutes.',
        'Assemble in a bowl over fluffy warm quinoa.'
      ],
      tips: 'Double the batch for easy mid-week meal prep.'
    },
    {
      id: 'meal_3',
      name: isVeg ? 'Lentil & Sweet Potato Curry' : 'Pan-Seared Salmon with Sweet Potato & Asparagus',
      mealType: 'dinner',
      calories: dCal,
      proteinGrams: Math.round((dCal * 0.32) / 4),
      carbsGrams: Math.round((dCal * 0.38) / 4),
      fatGrams: Math.round((dCal * 0.30) / 9),
      prepTimeMinutes: 15,
      cookTimeMinutes: 25,
      ingredients: [
        { item: isVeg ? 'Brown Lentils' : 'Atlantic Salmon Fillet', amount: isVeg ? '180g' : '180g', category: isVeg ? 'Pantry & Spices' : 'Protein & Meat' },
        { item: 'Sweet Potato', amount: '150g', category: 'Produce' },
        { item: 'Fresh Asparagus spears', amount: '100g', category: 'Produce' },
        { item: 'Lemon Juice & Dill', amount: '1 tbsp', category: 'Pantry & Spices' }
      ],
      instructions: [
        'Cube sweet potato and roast at 400°F (200°C) for 20 minutes.',
        'Sear salmon skin-side down in a hot skillet for 4 minutes, flip and cook 3 minutes.',
        'Toss asparagus with lemon juice and sear in remaining skillet juices.'
      ],
      tips: 'Salmon provides rich Omega-3 fatty acids essential for joint recovery.'
    },
    {
      id: 'meal_4',
      name: 'Greek Yogurt with Honey, Chia & Walnuts',
      mealType: 'snack',
      calories: sCal,
      proteinGrams: Math.round((sCal * 0.40) / 4),
      carbsGrams: Math.round((sCal * 0.35) / 4),
      fatGrams: Math.round((sCal * 0.25) / 9),
      prepTimeMinutes: 5,
      cookTimeMinutes: 0,
      ingredients: [
        { item: 'Non-Fat Greek Yogurt', amount: '200g', category: 'Dairy & Eggs' },
        { item: 'Chia Seeds', amount: '1 tbsp (10g)', category: 'Pantry & Spices' },
        { item: 'Raw Walnuts', amount: '15g', category: 'Pantry & Spices' },
        { item: 'Raw Honey', amount: '1 tsp (7g)', category: 'Pantry & Spices' }
      ],
      instructions: [
        'Scoop Greek yogurt into a small bowl.',
        'Stir in chia seeds and allow to hydrate for 2 minutes.',
        'Top with crushed walnuts and drizzle with honey.'
      ],
      tips: 'Great post-workout or evening snack for slow-digesting casein protein.'
    }
  ];

  return {
    id: `meal_plan_${Date.now()}`,
    createdAt: new Date().toISOString(),
    totalCalories: targetCals,
    totalProtein: biometrics.macros.proteinGrams,
    totalCarbs: biometrics.macros.carbsGrams,
    totalFat: biometrics.macros.fatsGrams,
    meals
  };
}

function generateFallbackRecipe(
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack',
  profile: UserProfile,
  target: { calories: number; protein: number; carbs: number; fat: number }
): Recipe {
  const swaps: Record<string, Recipe> = {
    breakfast: {
      id: `recipe_swap_${Date.now()}`,
      name: 'High-Protein Cottage Cheese Pancake Stack',
      mealType: 'breakfast',
      calories: target.calories,
      proteinGrams: target.protein,
      carbsGrams: target.carbs,
      fatGrams: target.fat,
      prepTimeMinutes: 8,
      cookTimeMinutes: 10,
      ingredients: [
        { item: 'Low-Fat Cottage Cheese', amount: '150g', category: 'Dairy & Eggs' },
        { item: 'Oat Flour', amount: '60g', category: 'Grains & Bakery' },
        { item: 'Egg Whites', amount: '100ml', category: 'Dairy & Eggs' },
        { item: 'Maple Syrup (sugar-free)', amount: '2 tbsp', category: 'Pantry & Spices' }
      ],
      instructions: [
        'Blend cottage cheese, oat flour, and egg whites until smooth batter forms.',
        'Pour onto medium-hot non-stick griddle.',
        'Flip when bubbles appear and cook until golden brown.',
        'Serve warm with sugar-free syrup.'
      ],
      tips: 'Cottage cheese gives pancakes a light, fluffy texture with max protein.'
    },
    lunch: {
      id: `recipe_swap_${Date.now()}`,
      name: 'Mediterranean Turkey & Chickpea Power Wrap',
      mealType: 'lunch',
      calories: target.calories,
      proteinGrams: target.protein,
      carbsGrams: target.carbs,
      fatGrams: target.fat,
      prepTimeMinutes: 10,
      cookTimeMinutes: 5,
      ingredients: [
        { item: 'Whole Wheat Tortilla', amount: '1 large', category: 'Grains & Bakery' },
        { item: 'Lean Ground Turkey Breast', amount: '180g', category: 'Protein & Meat' },
        { item: 'Hummus', amount: '2 tbsp', category: 'Pantry & Spices' },
        { item: 'Cucumbers & Tomatoes', amount: '50g each', category: 'Produce' }
      ],
      instructions: [
        'Cook ground turkey with Mediterranean oregano and garlic.',
        'Spread hummus evenly over whole wheat wrap.',
        'Fill with warm turkey, diced cucumber, tomato, and roll tightly.'
      ],
      tips: 'Easy to wrap in foil and take to work or school.'
    },
    dinner: {
      id: `recipe_swap_${Date.now()}`,
      name: 'Lean Beef Sirloin Stir-Fry with Rice Noodles',
      mealType: 'dinner',
      calories: target.calories,
      proteinGrams: target.protein,
      carbsGrams: target.carbs,
      fatGrams: target.fat,
      prepTimeMinutes: 12,
      cookTimeMinutes: 12,
      ingredients: [
        { item: 'Lean Top Sirloin Steak', amount: '180g', category: 'Protein & Meat' },
        { item: 'Rice Noodles / Brown Rice', amount: '120g cooked', category: 'Grains & Bakery' },
        { item: 'Snap Peas & Bell Peppers', amount: '100g', category: 'Produce' },
        { item: 'Low-Sodium Soy Sauce & Sesame Oil', amount: '1 tbsp each', category: 'Pantry & Spices' }
      ],
      instructions: [
        'Slice sirloin into thin strips.',
        'Stir-fry in sesame oil on high heat for 3-4 minutes.',
        'Add veggies and soy sauce, toss with cooked rice noodles.'
      ],
      tips: 'High iron and zinc content supporting athletic performance.'
    },
    snack: {
      id: `recipe_swap_${Date.now()}`,
      name: 'Whey Protein Crisp Bowl with Rice Cakes & Almond Butter',
      mealType: 'snack',
      calories: target.calories,
      proteinGrams: target.protein,
      carbsGrams: target.carbs,
      fatGrams: target.fat,
      prepTimeMinutes: 3,
      cookTimeMinutes: 0,
      ingredients: [
        { item: 'Brown Rice Cakes', amount: '2 cakes', category: 'Grains & Bakery' },
        { item: 'Natural Almond Butter', amount: '15g', category: 'Pantry & Spices' },
        { item: 'Whey Isolate', amount: '1 scoop', category: 'Pantry & Spices' }
      ],
      instructions: [
        'Mix whey isolate with 50ml water to make a protein pudding.',
        'Spread almond butter onto rice cakes and top with protein pudding.'
      ],
      tips: 'Crunchy, satisfying pre-workout snack.'
    }
  };

  return swaps[mealType] || swaps.lunch;
}

function generateFallbackWorkoutPlan(profile: UserProfile): WorkoutPlan {
  const isHome = profile.workoutLocation === 'home';
  const isBodyweightOnly = profile.availableEquipment.includes('bodyweight') && profile.availableEquipment.length === 1;

  const pushPullLegs: WorkoutDay[] = [
    {
      dayNumber: 1,
      dayTitle: 'Day 1: Push (Chest, Shoulders & Triceps)',
      focusArea: 'Upper Body Pushing Muscles',
      estimatedMinutes: 50,
      exercises: [
        {
          id: 'ex_1',
          name: isBodyweightOnly ? 'Decline / Feet-Elevated Push-Ups' : 'Incline Dumbbell / Barbell Bench Press',
          targetMuscle: 'Upper Chest',
          secondaryMuscles: ['Front Deltoids', 'Triceps'],
          sets: 4,
          reps: '8-10',
          restSeconds: 90,
          equipmentRequired: isBodyweightOnly ? 'Bodyweight / Chair' : 'Bench & Dumbbells / Barbell',
          formTips: [
            'Retract and depress scapula prior to unracking.',
            'Maintain a 45-degree angle with elbows to protect rotator cuff.'
          ],
          progressiveOverloadTip: 'Increase weight by 2.5kg when all sets hit 10 clean reps.'
        },
        {
          id: 'ex_2',
          name: isHome ? 'Pike Push-Ups / Overhead Dumbbell Press' : 'Seated Dumbbell Shoulder Press',
          targetMuscle: 'Anterior & Lateral Deltoids',
          secondaryMuscles: ['Triceps', 'Upper Chest'],
          sets: 3,
          reps: '10-12',
          restSeconds: 75,
          equipmentRequired: isHome ? 'Dumbbells / Chair' : 'Dumbbells & Bench',
          formTips: ['Press straight overhead without excessive lumbar arching.'],
          progressiveOverloadTip: 'Aim for 12 reps on the first set before upping dumbbell weight.'
        },
        {
          id: 'ex_3',
          name: 'Lateral Raises (Dumbbell or Band)',
          targetMuscle: 'Side Deltoids',
          sets: 4,
          reps: '12-15',
          restSeconds: 60,
          equipmentRequired: 'Dumbbells or Resistance Band',
          formTips: ['Lead with elbows and pause at shoulder height for 1 second.'],
          progressiveOverloadTip: 'Focus on time-under-tension (3-second negative down).'
        },
        {
          id: 'ex_4',
          name: 'Triceps Overhead Extension',
          targetMuscle: 'Triceps Long Head',
          sets: 3,
          reps: '10-12',
          restSeconds: 60,
          equipmentRequired: 'Dumbbell / Cable / Band',
          formTips: ['Keep elbows tucked in close to temples throughout full extension.'],
          progressiveOverloadTip: 'Add 1 rep per set each week.'
        }
      ]
    },
    {
      dayNumber: 2,
      dayTitle: 'Day 2: Pull (Back, Rear Delts & Biceps)',
      focusArea: 'Upper Body Pulling & Back Width',
      estimatedMinutes: 55,
      exercises: [
        {
          id: 'ex_5',
          name: isBodyweightOnly ? 'Pull-Ups / Bodyweight Rows' : 'Lat Pulldown / Weighted Pull-Ups',
          targetMuscle: 'Latissimus Dorsi',
          secondaryMuscles: ['Biceps', 'Rhomboids'],
          sets: 4,
          reps: '8-10',
          restSeconds: 90,
          equipmentRequired: 'Pull-Up Bar / Cable Pulldown',
          formTips: [
            'Pull elbows down toward hip pockets rather than pulling with biceps.',
            'Squeeze latissimus dorsi at bottom contraction.'
          ],
          progressiveOverloadTip: 'Use a weight belt or accent load when bodyweight exceeds 10 reps.'
        },
        {
          id: 'ex_6',
          name: 'Single-Arm Dumbbell / Bent-Over Row',
          targetMuscle: 'Mid-Back & Rhomboids',
          secondaryMuscles: ['Lats', 'Post Delts'],
          sets: 3,
          reps: '10-12',
          restSeconds: 75,
          equipmentRequired: 'Dumbbell & Bench / Barbell',
          formTips: ['Keep spine neutral and pull weight toward lower hip.'],
          progressiveOverloadTip: 'Focus on full stretch at bottom position.'
        },
        {
          id: 'ex_7',
          name: 'Face Pulls / Band Pull-Aparts',
          targetMuscle: 'Rear Deltoids & External Rotators',
          sets: 4,
          reps: '15-20',
          restSeconds: 60,
          equipmentRequired: 'Cable Rope or Resistance Band',
          formTips: ['Pull rope toward nose level and squeeze shoulder blades together.'],
          progressiveOverloadTip: 'Essential for shoulder health and posture alignment.'
        },
        {
          id: 'ex_8',
          name: 'Incline Dumbbell Biceps Curls',
          targetMuscle: 'Biceps Brachii',
          sets: 3,
          reps: '10-12',
          restSeconds: 60,
          equipmentRequired: 'Dumbbells',
          formTips: ['Supinate wrists at top of curl to maximize peak biceps contraction.'],
          progressiveOverloadTip: 'Strict form—no momentum or body swing.'
        }
      ]
    },
    {
      dayNumber: 3,
      dayTitle: 'Day 3: Legs & Core (Quads, Hamstrings & Glutes)',
      focusArea: 'Lower Body Strength & Posterior Chain',
      estimatedMinutes: 50,
      exercises: [
        {
          id: 'ex_9',
          name: profile.injuries.some(i => i.toLowerCase().includes('knee')) ? 'Goblet Box Squat / Bulgarian Split Squat' : 'Barbell / Goblet Squat',
          targetMuscle: 'Quadriceps & Glutes',
          secondaryMuscles: ['Hamstrings', 'Core'],
          sets: 4,
          reps: '8-10',
          restSeconds: 120,
          equipmentRequired: 'Barbell / Dumbbell / Bodyweight',
          formTips: [
            'Distribute load across mid-foot.',
            'Keep knees tracking in line with toes.'
          ],
          progressiveOverloadTip: 'Increase load by 2.5kg once all 4 sets reach 10 reps.'
        },
        {
          id: 'ex_10',
          name: 'Romanian Deadlift (RDL)',
          targetMuscle: 'Hamstrings & Glutes',
          secondaryMuscles: ['Erector Spinae'],
          sets: 3,
          reps: '10-12',
          restSeconds: 90,
          equipmentRequired: 'Barbell or Dumbbells',
          formTips: ['Hinge at hips pushing glutes backward while keeping spine straight.'],
          progressiveOverloadTip: 'Maintain slight knee bend and feel deep hamstring stretch.'
        },
        {
          id: 'ex_11',
          name: 'Walking Lunges',
          targetMuscle: 'Quads & Glutes',
          sets: 3,
          reps: '12 steps per leg',
          restSeconds: 60,
          equipmentRequired: 'Dumbbells or Bodyweight',
          formTips: ['Keep torso upright and drop back knee gently toward floor.'],
          progressiveOverloadTip: 'Hold dumbbells for added resistance as strength improves.'
        },
        {
          id: 'ex_12',
          name: 'Hanging Leg Raises / Lying Hollow Hold',
          targetMuscle: 'Rectus Abdominis & Core',
          sets: 3,
          reps: '15 reps / 45s hold',
          restSeconds: 45,
          equipmentRequired: 'Pull-Up Bar / Mat',
          formTips: ['Control hip flexion without using momentum.'],
          progressiveOverloadTip: 'Add toe-to-bar progression.'
        }
      ]
    },
    {
      dayNumber: 4,
      dayTitle: 'Day 4: Upper Body Conditioning & Hypertrophy',
      focusArea: 'Upper Body Pump & Endurance',
      estimatedMinutes: 45,
      exercises: [
        {
          id: 'ex_13',
          name: 'Dumbbell Shoulder Press superset with Lat Pulldowns',
          targetMuscle: 'Deltoids & Lats',
          sets: 4,
          reps: '12-15',
          restSeconds: 60,
          equipmentRequired: 'Dumbbells / Cables',
          formTips: ['Keep continuous tension on muscles without resting at top.'],
          progressiveOverloadTip: 'Minimize rest between supersets.'
        },
        {
          id: 'ex_14',
          name: 'Dips / Cable Chest Flyes',
          targetMuscle: 'Lower Chest & Triceps',
          sets: 3,
          reps: '12-15',
          restSeconds: 60,
          equipmentRequired: 'Parallel Bars / Cables / Bands',
          formTips: ['Lean torso slightly forward to bias chest engagement.'],
          progressiveOverloadTip: 'Add resistance band or weight belt.'
        }
      ]
    }
  ];

  return {
    id: `workout_plan_${Date.now()}`,
    createdAt: new Date().toISOString(),
    splitName: `${profile.workoutDaysPerWeek}-Day ${profile.workoutLocation === 'gym' ? 'Gym Power Hypertrophy' : 'Home Performance'} Split`,
    daysPerWeek: profile.workoutDaysPerWeek,
    schedule: pushPullLegs.slice(0, profile.workoutDaysPerWeek)
  };
}

function getFallbackCoachResponse(
  query: string,
  profile: UserProfile,
  biometrics: BiometricResult
): string {
  const q = query.toLowerCase();

  if (q.includes('substitut') || q.includes('replace') || q.includes('swap') || q.includes('chicken') || q.includes('egg')) {
    return `### 💡 Smart Protein Substitutions for ${profile.goal.replace('_', ' ')}

Here are scientifically matched substitutions preserving your target macros (~${biometrics.macros.proteinGrams}g daily protein):

1. **Chicken Breast (100g = 31g protein, 165 kcal)**
   - 🔄 **Turkey Breast**: 100g (30g protein, 140 kcal)
   - 🔄 **Firm Tofu (Marinated)**: 150g (24g protein, 160 kcal)
   - 🔄 **Egg Whites**: 200ml (22g protein, 100 kcal)

2. **Whole Eggs (1 Egg = 6g protein, 5g fat)**
   - 🔄 **Egg Whites + 10g Avocado**: Keeps high protein with healthy monounsaturated fats.
   - 🔄 **Cottage Cheese (Low Fat)**: 100g (12g protein, 2g fat).

> **Coach Tip:** When swapping protein sources, ensure you match both total protein grams and fat content to maintain your target ${biometrics.targetCalories} kcal budget!`;
  }

  if (q.includes('knee') || q.includes('injury') || q.includes('pain') || q.includes('hurt')) {
    return `### 🛡️ Joint Safety & Workout Modifications

Since your profile lists: *"${profile.injuries.join(', ') || 'Mild sensitivity'}"*, here is how we protect your joints while maximizing gains:

- ❌ **Avoid**: Deep heavy barbell squats past 90 degrees if experiencing sharp knee pain.
- ✅ **Safer Alternative**: **Box Squats to Parallel** or **Goblet Bulgarian Split Squats** (allows vertical shin angle to reduce anterior shear force on the patellar tendon).
- 🦵 **Hamstring Balance**: Strengthen the posterior chain with **Romanian Deadlifts (RDLs)**—a strong hamstring-to-quad ratio reduces ACL strain!

> **Warning:** Never push through sharp joint pain. If discomfort persists, consult a physical therapist before adding load.`;
  }

  if (q.includes('weight') || q.includes('plateau') || q.includes('loss') || q.includes('stuck')) {
    return `### 📈 Breaking Through Weight Loss Plateaus

Your current target is **${biometrics.targetCalories} kcal/day** for **${profile.goal.replace('_', ' ')}**. If weight loss has stalled for >14 days:

1. **Audit Hidden Calories**: Cooking oils, salad dressings, and coffee creamers add 150-300 unrecorded calories daily.
2. **Increase NEAT (Non-Exercise Activity Thermogenesis)**: Aim for 8,000–10,000 daily steps. Non-exercise movement accounts for more energy burn than a 45-min gym workout!
3. **Refeed Day**: Have 1 day at maintenance calories (${biometrics.tdee} kcal) with higher carbs to restore leptin levels and thyroid hormone activity.`;
  }

  return `### ⚡ Coach AI Guidance

Hello **${profile.name}**! I'm tracking your progress toward your **${profile.goal.replace('_', ' ')}** goal.

- **Current Calorie Target**: \`${biometrics.targetCalories} kcal/day\`
- **Target Macros**: \`${biometrics.macros.proteinGrams}g Protein\` | \`${biometrics.macros.carbsGrams}g Carbs\` | \`${biometrics.macros.fatsGrams}g Fat\`
- **BMI Status**: \`${biometrics.bmi} (${biometrics.bmiCategory})\`

How can I assist your training or nutrition today? You can ask me about:
- 🥗 **Meal swaps** & recipe adjustments
- 🏋️ **Form tips & injury modifications**
- 📊 **Calorie & macro breakdown support**
- 🔥 **Motivation & workout recovery advice**`;
}
