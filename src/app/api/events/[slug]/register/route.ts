import { NextResponse } from 'next/server';
import { getEventBySlug, registerForEvent } from '@/lib/supabase/dbAdapter';

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

    const event = await getEventBySlug(params.slug);
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // In local or Supabase mode, check existing registration
    const result = await registerForEvent(params.slug, {
      full_name: '',
      email: email || '',
      register_number: register_number || '',
      department: '',
      year: '',
      contact_number: '',
    });

    if (result.alreadyRegistered) {
      return NextResponse.json({
        registered: true,
        registration: result.registration || null,
        message: result.error,
      });
    }

    return NextResponse.json({
      registered: false,
      registration: null,
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
    const event = await getEventBySlug(params.slug);
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
    const { full_name, email, register_number, department, year, contact_number, user_id } = body;

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

    const result = await registerForEvent(params.slug, {
      full_name: full_name.trim(),
      email: email.trim().toLowerCase(),
      register_number: register_number.trim().toUpperCase(),
      department: department.trim(),
      year: year || '1st Year',
      contact_number: contact_number?.trim() || '',
      user_id,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: result.alreadyRegistered ? 409 : 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Registration confirmed successfully!',
      registration: result.registration,
    });
  } catch (error) {
    console.error('Registration processing error:', error);
    return NextResponse.json({ error: 'Internal server error during registration' }, { status: 500 });
  }
}
