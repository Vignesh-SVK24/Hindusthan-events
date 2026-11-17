import { cookies } from 'next/headers';
import crypto from 'crypto';

export const ADMIN_SESSION_COOKIE = 'college_hub_admin_session';
export const USER_SESSION_COOKIE = 'college_hub_user_session';
// Backwards-compatible alias for existing imports
export const SESSION_COOKIE = ADMIN_SESSION_COOKIE;

export type UserRole = 'admin' | 'user' | 'developer';

export interface UserProfile {
  id: string;
  role: UserRole;
  full_name: string;
  email: string;
  avatar_url?: string;
  provider?: 'google' | 'email_otp' | 'admin' | 'developer';
  logged_in_at: number;
}

export interface AdminSession {
  id: string;
  role: 'admin' | 'developer';
  full_name: string;
  email: string;
  logged_in_at: number;
}

export function isDeveloperUser(user?: { role?: string; email?: string } | null): boolean {
  if (!user) return false;
  if (user.role === 'developer') return true;
  const email = user.email?.toLowerCase().trim();
  return email === 'admin@hindusthan.net' || (email ? email.includes('vignesh') : false);
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

export function createUserSessionToken(user: {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  provider?: 'google' | 'email_otp' | 'admin' | 'developer';
}): string {
  const payload: UserProfile & { exp: number } = {
    id: user.id,
    role: 'user',
    full_name: user.full_name,
    email: user.email,
    avatar_url: user.avatar_url,
    provider: user.provider || 'email_otp',
    logged_in_at: Date.now(),
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days expiration
  };
  const json = JSON.stringify(payload);
  const hmac = crypto.createHmac('sha256', SESSION_SECRET).update(json).digest('hex');
  return Buffer.from(`${json}.${hmac}`).toString('base64');
}

export function verifyUserSessionToken(token: string): UserProfile | null {
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
    if (data.role !== 'user') {
      return null;
    }

    return {
      id: data.id,
      role: 'user',
      full_name: data.full_name,
      email: data.email,
      avatar_url: data.avatar_url,
      provider: data.provider,
      logged_in_at: data.logged_in_at,
    };
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<UserProfile | null> {
  try {
    const cookieStore = cookies();

    // 1. Check for Admin session
    const adminToken = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
    if (adminToken) {
      const admin = verifyAdminSessionToken(adminToken);
      if (admin) {
        return {
          id: admin.id,
          role: 'admin',
          full_name: admin.full_name,
          email: admin.email,
          avatar_url: '/hindusthan-emblem.jpg',
          provider: 'admin',
          logged_in_at: admin.logged_in_at,
        };
      }
    }

    // 2. Check for Normal User session
    const userToken = cookieStore.get(USER_SESSION_COOKIE)?.value;
    if (userToken) {
      const user = verifyUserSessionToken(userToken);
      if (user) {
        return user;
      }
    }

    return null;
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
    crypto.timingSafeEqual(submittedBuf, submittedBuf);
    return false;
  }

  return crypto.timingSafeEqual(submittedBuf, actualBuf);
}

// ============================================================================
// PASSWORDLESS EMAIL OTP AUTHENTICATION SYSTEM
// ============================================================================

interface OtpRecord {
  code: string;
  expiresAt: number;
  attempts: number;
  lastRequestedAt: number;
}

// In-memory OTP storage: normalized email -> OtpRecord
const otpStore = new Map<string, OtpRecord>();

export function generateNumericOtp(): string {
  // Generates a cryptographically strong 6-digit number between 100000 and 999999
  return crypto.randomInt(100000, 1000000).toString();
}

export function createEmailOtp(email: string): {
  success: boolean;
  otp?: string;
  expiresAt?: number;
  error?: string;
  cooldownSeconds?: number;
} {
  const normalizedEmail = email.trim().toLowerCase();
  const now = Date.now();

  const existing = otpStore.get(normalizedEmail);
  if (existing && now - existing.lastRequestedAt < 60 * 1000) {
    const cooldown = Math.ceil((60 * 1000 - (now - existing.lastRequestedAt)) / 1000);
    return {
      success: false,
      error: `Please wait ${cooldown} seconds before requesting a new code.`,
      cooldownSeconds: cooldown,
    };
  }

  const code = generateNumericOtp();
  const expiresAt = now + 5 * 60 * 1000; // 5 minutes expiry

  otpStore.set(normalizedEmail, {
    code,
    expiresAt,
    attempts: 0,
    lastRequestedAt: now,
  });

  // Diagnostic log without recording OTP secrets
  console.log(`[HICET Auth OTP] Verification request initialized for ${normalizedEmail} (valid for 5 minutes).`);

  return {
    success: true,
    otp: code,
    expiresAt,
  };
}

export function verifyEmailOtp(
  email: string,
  submittedCode: string
): { success: boolean; user?: UserProfile; error?: string } {
  const normalizedEmail = email.trim().toLowerCase();
  const trimmedCode = submittedCode.trim();

  const record = otpStore.get(normalizedEmail);
  if (!record) {
    return {
      success: false,
      error: 'No active verification code found for this email. Please request a new code.',
    };
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(normalizedEmail);
    return {
      success: false,
      error: 'The verification code has expired. Please request a new code.',
    };
  }

  if (record.attempts >= 5) {
    otpStore.delete(normalizedEmail);
    return {
      success: false,
      error: 'Too many incorrect attempts. Please request a new verification code.',
    };
  }

  record.attempts += 1;

  const codeBuf = Buffer.from(trimmedCode);
  const actualBuf = Buffer.from(record.code);

  if (codeBuf.length !== actualBuf.length || !crypto.timingSafeEqual(codeBuf, actualBuf)) {
    return {
      success: false,
      error: 'Incorrect verification code. Please check and try again.',
    };
  }

  // Verification successful: remove used OTP
  otpStore.delete(normalizedEmail);

  // Derive a user name from email
  const namePart = normalizedEmail.split('@')[0];
  const formattedName = namePart
    .replace(/[._-]/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const userId = 'usr_' + crypto.createHash('md5').update(normalizedEmail).digest('hex').substring(0, 10);

  const user: UserProfile = {
    id: userId,
    role: 'user',
    full_name: formattedName || 'HICET Student',
    email: normalizedEmail,
    provider: 'email_otp',
    logged_in_at: Date.now(),
  };

  return { success: true, user };
}
