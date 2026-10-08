import { NextRequest, NextResponse } from 'next/server';
import { generateAIWorkoutPlan } from '@/utils/aiGenerators';
import { UserProfile } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const profile: UserProfile = await req.json();
    if (!profile) {
      return NextResponse.json({ success: false, error: 'Profile is required' }, { status: 400 });
    }

    const workoutPlan = await generateAIWorkoutPlan(profile);
    return NextResponse.json({ success: true, workoutPlan });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to generate workout plan' },
      { status: 500 }
    );
  }
}
