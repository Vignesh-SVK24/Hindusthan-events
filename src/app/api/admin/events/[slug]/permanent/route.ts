import { NextResponse } from 'next/server';
import { permanentDeleteEvent, getEventBySlug, logAdminAction } from '@/lib/supabase/dbAdapter';
import { getCurrentUser, isDeveloperUser } from '@/lib/auth';

export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user || (!isDeveloperUser(user) && user.role !== 'developer')) {
      return NextResponse.json(
        { error: 'Forbidden: Permanent event destruction is strictly restricted to verified developer credentials' },
        { status: 403 }
      );
    }

    const { slug } = params;
    const existing = await getEventBySlug(slug, { includeDeleted: true });
    if (!existing) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const deleted = await permanentDeleteEvent(slug);
    if (!deleted) {
      return NextResponse.json({ error: 'Failed to permanently delete event' }, { status: 500 });
    }

    await logAdminAction(
      user.id,
      'PERMANENT_DELETE_EVENT',
      'events',
      existing.id,
      { title: existing.title, slug: existing.slug, deleted_by: user.email }
    );

    return NextResponse.json({
      success: true,
      message: `Event "${existing.title}" and its associated records have been permanently erased.`,
    });
  } catch (error) {
    console.error('Error in permanent delete event API:', error);
    return NextResponse.json({ error: 'Internal server error while permanently deleting event' }, { status: 500 });
  }
}
