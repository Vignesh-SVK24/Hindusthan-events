import { NextResponse } from 'next/server';
import { verifyEmailOtp, createUserSessionToken, USER_SESSION_COOKIE } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and 6-digit verification code are required.' },
        { status: 400 }
      );
    }

    const verification = verifyEmailOtp(email, otp);
    if (!verification.success || !verification.user) {
      return NextResponse.json(
        { error: verification.error || 'Verification failed. Please check your code.' },
        { status: 400 }
      );
    }

    const token = createUserSessionToken(verification.user);

    const response = NextResponse.json({
      success: true,
      message: 'Email successfully verified. Welcome to HICET Events!',
      user: verification.user,
    });

    response.cookies.set({
      name: USER_SESSION_COOKIE,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days session
    });

    return response;
  } catch (err) {
    console.error('Error verifying email OTP:', err);
    return NextResponse.json({ error: 'Verification failed due to an unexpected error.' }, { status: 500 });
  }
}
