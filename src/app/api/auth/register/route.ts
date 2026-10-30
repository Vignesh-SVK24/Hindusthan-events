import { NextResponse } from 'next/server';
import { getDatabase, saveDatabase } from '@/lib/db';
import { createSessionToken } from '@/lib/auth';
import { Profile } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const { full_name, email, password, department, register_number } = await request.json();

    if (!full_name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    const db = getDatabase();
    const existing = db.profiles.find((p) => p.email.toLowerCase() === email.toLowerCase().trim());
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    const newProfile: Profile = {
      id: `usr-${Date.now()}`,
      full_name: full_name.trim(),
      email: email.toLowerCase().trim(),
      password_hash: password, // In production this would be hashed with bcrypt
      role: 'student', // Normal users default to student
      department: department?.trim() || 'General Engineering',
      register_number: register_number?.trim() || `REG-${Date.now().toString().slice(-6)}`,
      created_at: new Date().toISOString(),
    };

    db.profiles.push(newProfile);
    saveDatabase(db);

    const sessionUser = {
      id: newProfile.id,
      full_name: newProfile.full_name,
      email: newProfile.email,
      role: newProfile.role,
      department: newProfile.department,
      register_number: newProfile.register_number,
    };

    const token = createSessionToken(sessionUser);

    const response = NextResponse.json({
      success: true,
      user: sessionUser,
    });

    response.cookies.set({
      name: 'college_hub_session',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
