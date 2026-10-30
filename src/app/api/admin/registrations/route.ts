import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const event_id = searchParams.get('event_id');
    const department = searchParams.get('department');
    const search = searchParams.get('search');
    const format = searchParams.get('format');

    const db = getDatabase();
    let registrations = [...db.event_registrations];

    if (event_id && event_id !== 'all') {
      registrations = registrations.filter((r) => r.event_id === event_id);
    }

    if (department && department !== 'all') {
      registrations = registrations.filter((r) =>
        r.department.toLowerCase().includes(department.toLowerCase())
      );
    }

    if (search) {
      const q = search.toLowerCase();
      registrations = registrations.filter(
        (r) =>
          r.full_name.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q) ||
          r.register_number.toLowerCase().includes(q)
      );
    }

    // Attach event title
    const enriched = registrations.map((r) => {
      const event = db.events.find((e) => e.id === r.event_id);
      return {
        ...r,
        event_title: event?.title || 'Unknown Event',
        event_slug: event?.slug || '',
      };
    });

    if (format === 'csv') {
      const headers = ['ID', 'Event Title', 'Student Name', 'Email', 'Register Number', 'Department', 'Year', 'Contact', 'Status', 'Registered At'];
      const rows = enriched.map((r) => [
        r.id,
        `"${r.event_title.replace(/"/g, '""')}"`,
        `"${r.full_name.replace(/"/g, '""')}"`,
        r.email,
        r.register_number,
        `"${r.department.replace(/"/g, '""')}"`,
        r.year,
        r.contact_number,
        r.registration_status,
        r.created_at,
      ]);

      const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
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
