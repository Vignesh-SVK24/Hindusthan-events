import { NextResponse } from 'next/server';
import { restoreEvent, getEventBySlug, logAdminAction } from '@/lib/supabase/dbAdapter';
import { getCurrentUser, isDeveloperUser } from '@/lib/auth';

export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user || (!isDeveloperUser(user) && user.role !== 'developer')) {
      return NextResponse.json(
        { error: 'Forbidden: Event recovery is strictly reserved for developer authorization' },
        { status: 403 }
      );
    }

    const { slug } = params;
    const existing = await getEventBySlug(slug, { includeDeleted: true });
    if (!existing) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const restored = await restoreEvent(slug, user.email || user.id);
    if (!restored) {
      return NextResponse.json({ error: 'Failed to restore event' }, { status: 500 });
    }

    await logAdminAction(
      user.id,
      'RESTORE_EVENT',
      'events',
      existing.id,
      { title: existing.title, slug: existing.slug, restored_by: user.email }
    );

    return NextResponse.json({
      success: true,
      message: `Event "${existing.title}" successfully restored from trash. Public visibility has been reinstated.`,
      event: { ...existing, is_deleted: false, event_status: 'published' },
    });
  } catch (error) {
    console.error('Error in restore event API:', error);
    return NextResponse.json({ error: 'Internal server error while restoring event' }, { status: 500 });
  }
}
