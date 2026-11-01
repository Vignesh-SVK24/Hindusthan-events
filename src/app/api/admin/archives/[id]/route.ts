import { NextRequest, NextResponse } from 'next/server';
import { updateEventArchive, deleteEventArchive, getEventArchiveById } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const archive = getEventArchiveById(params.id);
  if (!archive) {
    return NextResponse.json({ error: 'Record not found' }, { status: 404 });
  }

  return NextResponse.json({ archive });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const updated = updateEventArchive(params.id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Record not found or failed to update' }, { status: 404 });
    }

    return NextResponse.json({ archive: updated });
  } catch (error) {
    console.error('Error updating archive record:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const success = deleteEventArchive(params.id);
    if (!success) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting archive record:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
