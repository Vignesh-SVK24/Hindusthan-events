import { cookies } from 'next/headers';
import { getDatabase } from './db';
import { Profile } from './types';

const SESSION_COOKIE = 'college_hub_session';

export interface SessionUser {
  id: string;
  full_name: string;
  email: string;
  role: 'admin' | 'student';
  department: string;
  register_number: string;
}

export function createSessionToken(user: SessionUser): string {
  const payload = {
    ...user,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

export function parseSessionToken(token: string): SessionUser | null {
  try {
    const raw = Buffer.from(token, 'base64').toString('utf-8');
    const data = JSON.parse(raw);
    if (data.exp && Date.now() > data.exp) {
      return null;
    }
    return {
      id: data.id,
      full_name: data.full_name,
      email: data.email,
      role: data.role,
      department: data.department,
      register_number: data.register_number,
    };
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    if (!token) return null;
    return parseSessionToken(token);
  } catch {
    return null;
  }
}

export function authenticateUser(email: string, password_plain: string): Profile | null {
  const db = getDatabase();
  const user = db.profiles.find(
    (p) => p.email.toLowerCase() === email.toLowerCase().trim() && p.password_hash === password_plain
  );
  return user || null;
}
