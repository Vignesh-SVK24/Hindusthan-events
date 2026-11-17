import { NextResponse } from 'next/server';
import { createUserSessionToken, USER_SESSION_COOKIE } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user } = body;

    if (!user || !user.id || !user.email) {
      return NextResponse.json({ error: 'Valid user session required' }, { status: 400 });
    }

    const token = createUserSessionToken({
      id: user.id,
      full_name: user.full_name || 'HICET Student',
      email: user.email,
      avatar_url: user.avatar_url,
      provider: user.provider || 'email_otp',
    });

    const response = NextResponse.json({ success: true, message: 'Session established' });
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
    console.error('Session sync error:', err);
    return NextResponse.json({ error: 'Session synchronization failed' }, { status: 500 });
  }
}
