import { NextRequest, NextResponse } from 'next/server';
import { computeBiometrics } from '@/utils/biometrics';
import { UserProfile } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const profile: UserProfile = await req.json();
    const result = computeBiometrics(profile);
    return NextResponse.json({ success: true, biometrics: result });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to compute biometrics' },
      { status: 400 }
    );
  }
}
