import { NextResponse } from 'next/server';
import { getAdminRegistrations } from '@/lib/supabase/dbAdapter';
import { getCurrentUser, isDeveloperUser } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'admin' && user.role !== 'developer' && !isDeveloperUser(user))) {
      return NextResponse.json({ error: 'Unauthorized: Admin or Developer role required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const event_id = searchParams.get('event_id') || undefined;
    const department = searchParams.get('department') || undefined;
    const search = searchParams.get('search') || undefined;
    const format = searchParams.get('format');

    const enriched = await getAdminRegistrations({
      event_id,
      department,
      search,
    });

    if (format === 'csv') {
      const headers = ['ID', 'Event Title', 'Student Name', 'Email', 'Register Number', 'Department', 'Year', 'Contact', 'Status', 'Registered At'];
      const rows = enriched.map((r: any) => [
        r.id,
        `"${(r.event_title || '').replace(/"/g, '""')}"`,
        `"${(r.full_name || '').replace(/"/g, '""')}"`,
        r.email,
        r.register_number,
        `"${(r.department || '').replace(/"/g, '""')}"`,
        r.year,
        r.contact_number,
        r.registration_status,
        r.created_at,
      ]);

      const csvContent = [headers.join(','), ...rows.map((row: any) => row.join(','))].join('\n');
      return new Response(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="event_registrations_${Date.now()}.csv"`,
        },
      });
    }

    return NextResponse.json({ registrations: enriched });
  } catch (error) {
    console.error('Error fetching admin registrations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
