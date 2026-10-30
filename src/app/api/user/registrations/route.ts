import { NextResponse } from 'next/server';
import { getUserRegistrations } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const registrations = getUserRegistrations(user.id);
    return NextResponse.json({ registrations });
  } catch (error) {
    console.error('Error fetching user registrations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
