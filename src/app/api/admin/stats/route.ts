import { NextResponse } from 'next/server';
import { getAdminStats } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const stats = getAdminStats();
  return NextResponse.json({ stats });
}
