import { NextRequest, NextResponse } from 'next/server';
import { getAllEventArchives } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const academic_year = searchParams.get('academic_year') || undefined;
    const year = searchParams.get('year') || undefined;
    const month = searchParams.get('month') || undefined;
    const search = searchParams.get('search') || undefined;

    const archives = getAllEventArchives({
      academic_year,
      year,
      month,
      search,
    });

    return NextResponse.json({
      archives,
      total: archives.length,
      source_document: '2025-2026 AIML EVENT DETAILS CONSOLIDATED.docx',
    });
  } catch (error) {
    console.error('Error fetching event archives:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
