import { NextResponse } from 'next/server';
import { createEmailOtp, checkRateLimit, recordFailedAttempt, resetRateLimit } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: `Too many requests. Please wait ${rateCheck.retryAfterSeconds} seconds before requesting a new code.`,
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== 'string' || !email.includes('@') || !email.includes('.')) {
      recordFailedAttempt(ip);
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const otpResult = createEmailOtp(email);
    if (!otpResult.success) {
      return NextResponse.json({ error: otpResult.error }, { status: 429 });
    }

    resetRateLimit(ip);

    // Return clean confirmation without exposing OTP value
    return NextResponse.json({
      success: true,
      message: `A 6-digit verification code has been dispatched to ${email.trim().toLowerCase()}.`,
      email: email.trim().toLowerCase(),
      expiresInMinutes: 5,
    });
  } catch (err) {
    console.error('Error generating email OTP:', err);
    return NextResponse.json({ error: 'Failed to generate verification code. Please try again.' }, { status: 500 });
  }
}
