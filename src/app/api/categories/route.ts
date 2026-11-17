import { NextResponse } from 'next/server';
import { getCategories } from '@/lib/supabase/dbAdapter';
import { getCurrentUser, isDeveloperUser } from '@/lib/auth';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { getDatabase, saveDatabase } from '@/lib/db';
import { EventCategory } from '@/lib/types';

export async function GET() {
  const categories = await getCategories();
  return NextResponse.json({ categories });
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'admin' && user.role !== 'developer' && !isDeveloperUser(user))) {
      return NextResponse.json({ error: 'Unauthorized: Admin or Developer role required' }, { status: 403 });
    }

    const { category_name, category_description } = await request.json();
    if (!category_name || !category_name.trim()) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    const newCat: EventCategory = {
      id: `cat-${Date.now()}`,
      category_name: category_name.trim(),
      category_description: category_description?.trim() || '',
      created_at: new Date().toISOString(),
    };

    const supabase = getSupabaseServerClient(true);
    if (supabase) {
      await supabase.from('categories').insert(newCat);
    }

    try {
      const db = getDatabase();
      db.event_categories.push(newCat);
      saveDatabase(db);
    } catch (_) {}

    return NextResponse.json({ success: true, category: newCat }, { status: 201 });
  } catch (error) {
    console.error('Error adding category:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
