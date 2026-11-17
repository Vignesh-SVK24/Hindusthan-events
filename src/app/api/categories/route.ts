import { NextResponse } from 'next/server';
import { getCategories } from '@/lib/supabase/dbAdapter';
import { getCurrentUser } from '@/lib/auth';
import { getDatabase, saveDatabase } from '@/lib/db';
import { EventCategory } from '@/lib/types';

export async function GET() {
  const categories = await getCategories();
  return NextResponse.json({ categories });
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { category_name, category_description } = await request.json();
    if (!category_name) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    const db = getDatabase();
    const newCat: EventCategory = {
      id: `cat-${Date.now()}`,
      category_name: category_name.trim(),
      category_description: category_description?.trim() || '',
      created_at: new Date().toISOString(),
    };

    db.event_categories.push(newCat);
    saveDatabase(db);

    return NextResponse.json({ success: true, category: newCat }, { status: 201 });
  } catch (error) {
    console.error('Error adding category:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
