import { NextResponse } from 'next/server';
import { getEventBySlug, updateEvent, deleteEvent, logAdminAction } from '@/lib/supabase/dbAdapter';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    const event = await getEventBySlug(slug);

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ event });
  } catch (error) {
    console.error('Error fetching event by slug:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'admin' && user.role !== 'developer')) {
      return NextResponse.json({ error: 'Unauthorized: Admin privileges required' }, { status: 403 });
    }

    const currentEvent = await getEventBySlug(params.slug, { includeDeleted: true });
    if (!currentEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const body = await request.json();
    const { eventData, themeData } = body;

    const updated = await updateEvent(params.slug, eventData, themeData);
    if (!updated) {
      return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
    }

    await logAdminAction(user.id, 'UPDATE_EVENT', 'events', currentEvent.id, { slug: params.slug });

    return NextResponse.json({ success: true, event: updated });
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'admin' && user.role !== 'developer')) {
      return NextResponse.json({ error: 'Unauthorized: Admin privileges required' }, { status: 403 });
    }

    const currentEvent = await getEventBySlug(params.slug, { includeDeleted: true });
    if (!currentEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const success = await deleteEvent(params.slug, user.id);
    if (success) {
      await logAdminAction(user.id, 'MOVE_TO_TRASH', 'events', currentEvent.id, { slug: params.slug, title: currentEvent.title });
    }

    return NextResponse.json({ success, message: 'Event successfully moved to trash.' });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
