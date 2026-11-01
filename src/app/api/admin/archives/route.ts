import { NextRequest, NextResponse } from 'next/server';
import { getAllEventArchives, createEventArchive } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || undefined;
  const archives = getAllEventArchives({ search });
  return NextResponse.json({ archives });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const body = await request.json();
    if (!body.event_name || !body.event_date_original) {
      return NextResponse.json({ error: 'Event name and original date are required' }, { status: 400 });
    }

    const slug = body.slug || body.event_name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const newArchive = createEventArchive({
      original_serial_number: body.original_serial_number || '',
      event_name: body.event_name,
      slug: slug || `arch-${Date.now()}`,
      resource_person: body.resource_person || '',
      resource_person_name: body.resource_person_name || '',
      resource_person_designation: body.resource_person_designation || '',
      event_coordinators: body.event_coordinators || '',
      event_date_original: body.event_date_original,
      event_date_parsed: body.event_date_parsed || '',
      photo_url: body.photo_url || null,
      geo_tag: body.geo_tag || null,
      academic_year: body.academic_year || '2025-2026',
      source_document: body.source_document || '2025-2026 AIML EVENT DETAILS CONSOLIDATED.docx',
      notes: body.notes || '',
    });

    return NextResponse.json({ archive: newArchive }, { status: 201 });
  } catch (error) {
    console.error('Error creating archive record:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
