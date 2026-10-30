import { NextResponse } from 'next/server';
import { getEventBySlug, registerUserForEvent, getDatabase } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const register_number = searchParams.get('register_number');

    if (!email && !register_number) {
      return NextResponse.json({ registered: false, registration: null });
    }

    const event = getEventBySlug(params.slug);
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const db = getDatabase();
    const reg = db.event_registrations.find(
      (r) =>
        r.event_id === event.id &&
        ((email && r.email.toLowerCase() === email.toLowerCase().trim()) ||
          (register_number && r.register_number.toLowerCase() === register_number.toLowerCase().trim()))
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

    // Server-side validation
    if (!full_name || typeof full_name !== 'string' || full_name.trim().length < 2) {
      return NextResponse.json({ error: 'Full name is required (minimum 2 characters).' }, { status: 400 });
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 });
    }

    if (!register_number || typeof register_number !== 'string' || register_number.trim().length < 2) {
      return NextResponse.json({ error: 'College register / roll number is required.' }, { status: 400 });
    }

    if (!department || typeof department !== 'string') {
      return NextResponse.json({ error: 'Department name is required.' }, { status: 400 });
    }

    const result = registerUserForEvent({
      event_id: event.id,
      full_name: full_name.trim(),
      email: email.trim().toLowerCase(),
      register_number: register_number.trim().toUpperCase(),
      department: department.trim(),
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
    console.error('Registration processing error:', error);
    return NextResponse.json({ error: 'Internal server error during registration' }, { status: 500 });
  }
}
