import { NextRequest, NextResponse } from 'next/server';
import { getAICoachResponse } from '@/utils/aiGenerators';
import { computeBiometrics } from '@/utils/biometrics';
import { UserProfile } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const { query, profile, chatHistory } = await req.json() as {
      query: string;
      profile: UserProfile;
      chatHistory: { role: 'user' | 'assistant'; content: string }[];
    };

    if (!query || !profile) {
      return NextResponse.json({ success: false, error: 'Query and Profile are required' }, { status: 400 });
    }

    const biometrics = computeBiometrics(profile);
    const reply = await getAICoachResponse(query, profile, biometrics, chatHistory || []);

    return NextResponse.json({ success: true, reply });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Coach AI processing error' },
      { status: 500 }
    );
  }
}
