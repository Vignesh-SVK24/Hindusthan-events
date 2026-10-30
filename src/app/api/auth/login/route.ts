import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  verifyAdminPassword,
  createAdminSessionToken,
  checkRateLimit,
  recordFailedAttempt,
  resetRateLimit,
  SESSION_COOKIE,
} from '@/lib/auth';

export async function POST(request: Request) {
  try {
    // Extract client IP address for brute-force rate limit protection
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: `Too many failed attempts. Login locked for security. Please try again in ${rateCheck.retryAfterSeconds} seconds.`,
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { password } = body;

    if (!password || typeof password !== 'string') {
      recordFailedAttempt(ip);
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }

    const isValid = verifyAdminPassword(password);
    if (!isValid) {
      recordFailedAttempt(ip);
      return NextResponse.json(
        { error: 'Invalid administrator password.' },
        { status: 401 }
      );
    }

    // Reset rate limiter on successful authentication
    resetRateLimit(ip);

    // Create cryptographically signed admin session token
    const token = createAdminSessionToken();

    const cookieStore = cookies();
    cookieStore.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days session
    });

    return NextResponse.json({
      success: true,
      message: 'Authenticated as Administrator',
      user: {
        id: 'admin-root',
        role: 'admin',
        full_name: 'Administrator',
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
