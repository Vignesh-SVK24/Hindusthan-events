import { NextResponse } from 'next/server';
import { getEventBySlug, registerUserForEvent, getDatabase } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ registered: false, registration: null });
    }

    const event = getEventBySlug(params.slug);
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const db = getDatabase();
    const reg = db.event_registrations.find(
      (r) => r.event_id === event.id && (r.user_id === user.id || r.email.toLowerCase() === user.email.toLowerCase())
    );

    return NextResponse.json({
      registered: !!reg,
      registration: reg || null,
    });
  } catch (error) {
    console.error('Error checking registration status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required. Please sign in to register.' }, { status: 401 });
    }

    const event = getEventBySlug(params.slug);
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // STRICT BACKEND ENFORCEMENT OF REGISTRATION ON/OFF
    if (!event.registration_enabled) {
      return NextResponse.json(
        { error: 'Registration is closed or unavailable for this event.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { full_name, email, register_number, department, year, contact_number } = body;

    const result = registerUserForEvent({
      event_id: event.id,
      user_id: user.id,
      full_name: full_name?.trim() || user.full_name,
      email: email?.trim() || user.email,
      register_number: register_number?.trim() || user.register_number || 'N/A',
      department: department?.trim() || user.department || 'N/A',
      year: year || '1st Year',
      contact_number: contact_number?.trim() || '',
    });

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      registration: result.registration,
    });
  } catch (error) {
    console.error('Error processing registration:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
