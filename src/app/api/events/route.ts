import { NextResponse } from 'next/server';
import { getEvents, createEvent, logAdminAction } from '@/lib/supabase/dbAdapter';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category_id = searchParams.get('category_id') || undefined;
    const search = searchParams.get('search') || undefined;
    const publicOnly = searchParams.get('publicOnly') !== 'false';

    const events = await getEvents({
      publicOnly,
      categoryId: category_id,
      search,
    });

    return NextResponse.json({ events });
  } catch (error) {
    console.error('Failed to fetch events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    // Security check: Only Admin can create events
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Admin privileges required' }, { status: 403 });
    }

    const body = await request.json();
    const { eventData, themeData } = body;

    if (!eventData || !eventData.title || !eventData.venue || !eventData.start_date) {
      return NextResponse.json({ error: 'Missing mandatory fields: title, venue, and start_date are required' }, { status: 400 });
    }

    if (typeof eventData.registration_enabled !== 'boolean') {
      return NextResponse.json({ error: 'Registration configuration (ON or OFF) is required before publishing' }, { status: 400 });
    }

    const newEvent = await createEvent(eventData, themeData, user.id);

    await logAdminAction(user.id, 'CREATE_EVENT', 'events', newEvent.id, { title: newEvent.title });

    return NextResponse.json({ success: true, event: newEvent }, { status: 201 });
  } catch (error) {
    console.error('Failed to create event:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
