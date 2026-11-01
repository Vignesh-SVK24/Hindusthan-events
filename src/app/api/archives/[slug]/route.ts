import { NextRequest, NextResponse } from 'next/server';
import { getEventArchiveBySlug } from '@/lib/db';

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const archive = getEventArchiveBySlug(params.slug);
    if (!archive) {
      return NextResponse.json({ error: 'Archived event record not found' }, { status: 404 });
    }

    return NextResponse.json({ archive });
  } catch (error) {
    console.error('Error fetching archive by slug:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
