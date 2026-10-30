import { cookies } from 'next/headers';
import crypto from 'crypto';

export const SESSION_COOKIE = 'college_hub_admin_session';

export interface AdminSession {
  id: string;
  role: 'admin';
  full_name: string;
  email: string;
  logged_in_at: number;
}

// In-memory brute force protection tracking: IP -> { count, lastAttempt }
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();

export function checkRateLimit(ip: string): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  const record = loginAttempts.get(ip);
  if (!record) return { allowed: true };

  // Reset window after 15 minutes of inactivity
  if (now - record.lastAttempt > 15 * 60 * 1000) {
    loginAttempts.delete(ip);
    return { allowed: true };
  }

  // Maximum 5 failed attempts allowed within 15 minutes
  if (record.count >= 5) {
    const remaining = Math.ceil((15 * 60 * 1000 - (now - record.lastAttempt)) / 1000);
    return { allowed: false, retryAfterSeconds: remaining };
  }

  return { allowed: true };
}

export function recordFailedAttempt(ip: string): void {
  const now = Date.now();
  const record = loginAttempts.get(ip) || { count: 0, lastAttempt: now };
  record.count += 1;
  record.lastAttempt = now;
  loginAttempts.set(ip, record);
}

export function resetRateLimit(ip: string): void {
  loginAttempts.delete(ip);
}

// Server-only HMAC signing key for secure session tokens
const SESSION_SECRET = process.env.SESSION_SECRET || 'hindusthan-events-secure-hmac-key-2026';

export function createAdminSessionToken(): string {
  const payload: AdminSession & { exp: number } = {
    id: 'admin-root',
    role: 'admin',
    full_name: 'Administrator',
    email: 'admin@hindusthan.net',
    logged_in_at: Date.now(),
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days expiration
  };
  const json = JSON.stringify(payload);
  const hmac = crypto.createHmac('sha256', SESSION_SECRET).update(json).digest('hex');
  return Buffer.from(`${json}.${hmac}`).toString('base64');
}

export function verifyAdminSessionToken(token: string): AdminSession | null {
  try {
    const raw = Buffer.from(token, 'base64').toString('utf-8');
    const lastDotIndex = raw.lastIndexOf('.');
    if (lastDotIndex === -1) return null;

    const json = raw.substring(0, lastDotIndex);
    const signature = raw.substring(lastDotIndex + 1);

    const expectedSig = crypto.createHmac('sha256', SESSION_SECRET).update(json).digest('hex');
    const sigBuf = Buffer.from(signature);
    const expBuf = Buffer.from(expectedSig);

    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return null;
    }

    const data = JSON.parse(json);
    if (data.exp && Date.now() > data.exp) {
      return null;
    }
    if (data.role !== 'admin') {
      return null;
    }

    return {
      id: data.id,
      role: 'admin',
      full_name: data.full_name,
      email: data.email,
      logged_in_at: data.logged_in_at,
    };
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<AdminSession | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    if (!token) return null;
    return verifyAdminSessionToken(token);
  } catch {
    return null;
  }
}

/**
 * Constant-time comparison to verify the submitted admin password.
 * Backend only.
 */
export function verifyAdminPassword(submittedPassword: string): boolean {
  const actualPassword = process.env.ADMIN_PASSWORD || 'hiceteventz';
  if (!submittedPassword || typeof submittedPassword !== 'string') {
    return false;
  }

  const submittedBuf = Buffer.from(submittedPassword.trim());
  const actualBuf = Buffer.from(actualPassword.trim());

  if (submittedBuf.length !== actualBuf.length) {
    // Constant-time dummy comparison to prevent timing leak
    crypto.timingSafeEqual(submittedBuf, submittedBuf);
    return false;
  }

  return crypto.timingSafeEqual(submittedBuf, actualBuf);
}
