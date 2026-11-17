import { NextResponse } from 'next/server';
import { getTrashedEvents } from '@/lib/supabase/dbAdapter';
import { getCurrentUser, isDeveloperUser } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || (!isDeveloperUser(user) && user.role !== 'admin' && user.role !== 'developer')) {
      return NextResponse.json({ error: 'Unauthorized: Developer or Admin privileges required' }, { status: 403 });
    }

    const trashed = await getTrashedEvents();
    return NextResponse.json({ events: trashed, count: trashed.length });
  } catch (error) {
    console.error('Error fetching trashed events:', error);
    return NextResponse.json({ error: 'Failed to retrieve trashed events' }, { status: 500 });
  }
}
