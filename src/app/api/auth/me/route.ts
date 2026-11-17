import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
  }

  return NextResponse.json(
    {
      authenticated: true,
      user: {
        id: user.id,
        role: user.role,
        full_name: user.full_name,
        email: user.email,
        avatar_url: user.avatar_url,
        provider: user.provider,
      },
    },
    { status: 200 }
  );
}
