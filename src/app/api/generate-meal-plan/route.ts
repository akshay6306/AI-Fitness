import { NextRequest, NextResponse } from 'next/server';
import { generateAIMealPlan, regenerateSingleMeal } from '@/utils/aiGenerators';
import { computeBiometrics } from '@/utils/biometrics';
import { UserProfile } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { profile, swapMealType, targetMacros } = body as {
      profile: UserProfile;
      swapMealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
      targetMacros?: { calories: number; protein: number; carbs: number; fat: number };
    };

    if (!profile) {
      return NextResponse.json({ success: false, error: 'Profile is required' }, { status: 400 });
    }

    if (swapMealType && targetMacros) {
      const newMeal = await regenerateSingleMeal(swapMealType, profile, targetMacros);
      return NextResponse.json({ success: true, meal: newMeal });
    }

    const biometrics = computeBiometrics(profile);
    const mealPlan = await generateAIMealPlan(profile, biometrics);
    return NextResponse.json({ success: true, mealPlan });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to generate meal plan' },
      { status: 500 }
    );
  }
}
