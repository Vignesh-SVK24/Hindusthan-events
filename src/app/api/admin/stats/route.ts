import { NextResponse } from 'next/server';
import { getAdminStats } from '@/lib/supabase/dbAdapter';
import { getCurrentUser, isDeveloperUser } from '@/lib/auth';

export async function GET() {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'admin' && user.role !== 'developer' && !isDeveloperUser(user))) {
    return NextResponse.json({ error: 'Unauthorized: Admin or Developer role required' }, { status: 403 });
  }

  const stats = await getAdminStats();
  return NextResponse.json({ stats });
}
