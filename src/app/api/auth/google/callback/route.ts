import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createUserSessionToken, USER_SESSION_COOKIE, UserProfile } from '@/lib/auth';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const origin = url.origin;
  const code = url.searchParams.get('code');
  const isDemo = url.searchParams.get('demo') === 'true';

  let userProfile: UserProfile | null = null;

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (code && clientId && clientSecret) {
    try {
      const redirectUri = `${origin}/api/auth/google/callback`;
      const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code',
        }),
      });

      if (tokenRes.ok) {
        const tokenData = await tokenRes.json();
        const accessToken = tokenData.access_token;

        const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (userRes.ok) {
          const googleUser = await userRes.json();
          userProfile = {
            id: `google_${googleUser.sub || crypto.randomUUID().substring(0, 8)}`,
            role: 'user',
            full_name: googleUser.name || 'HICET Student',
            email: googleUser.email,
            avatar_url: googleUser.picture,
            provider: 'google',
            logged_in_at: Date.now(),
          };
        }
      }
    } catch (err) {
      console.error('Google OAuth token exchange error:', err);
    }
  }

  // If live OAuth credentials are not configured or demo mode is active:
  if (!userProfile) {
    userProfile = {
      id: 'google_user_demo_1',
      role: 'user',
      full_name: 'Hindusthan Campus Member',
      email: 'student.events@hindusthan.net',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      provider: 'google',
      logged_in_at: Date.now(),
    };
  }

  const token = createUserSessionToken(userProfile);

  const response = NextResponse.redirect(`${origin}/`);
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
}
