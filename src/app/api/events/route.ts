import { NextResponse } from 'next/server';
import { getAllEvents, createEvent } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category_id = searchParams.get('category_id') || undefined;
    const department = searchParams.get('department') || undefined;
    const search = searchParams.get('search') || undefined;
    const publicOnly = searchParams.get('publicOnly') !== 'false'; // default true for general browsing

    const events = getAllEvents({
      category_id,
      department,
      search,
      publicOnly,
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

    // Mandatory registration configuration check
    if (typeof eventData.registration_enabled !== 'boolean') {
      return NextResponse.json({ error: 'Registration configuration (ON or OFF) is required before publishing' }, { status: 400 });
    }

    const newEvent = createEvent({
      title: eventData.title,
      slug: eventData.slug || '',
      tagline: eventData.tagline || '',
      short_description: eventData.short_description || '',
      description: eventData.description || '',
      category_id: eventData.category_id || 'cat-1',
      department: eventData.department || 'General College',
      organizer: eventData.organizer || 'College Management',
      poster_url: eventData.poster_url || '/college-logo.jpg',
      cover_image_url: eventData.cover_image_url || eventData.poster_url || '/college-logo.jpg',
      start_date: eventData.start_date,
      end_date: eventData.end_date || eventData.start_date,
      start_time: eventData.start_time || '09:00',
      end_time: eventData.end_time || '17:00',
      venue: eventData.venue,
      registration_enabled: eventData.registration_enabled,
      registration_type: eventData.registration_type || 'builtin',
      registration_url: eventData.registration_url || '',
      registration_deadline: eventData.registration_deadline || '',
      publication_status: eventData.publication_status || 'published',
      highlights: eventData.highlights || [],
      schedule: eventData.schedule || [],
      rules: eventData.rules || [],
      eligibility: eventData.eligibility || 'Open to all college students',
      prizes: eventData.prizes || [],
      coordinators: eventData.coordinators || [],
      sponsors: eventData.sponsors || [],
      created_by: user.id,
    }, themeData);

    return NextResponse.json({ success: true, event: newEvent }, { status: 201 });
  } catch (error) {
    console.error('Failed to create event:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
