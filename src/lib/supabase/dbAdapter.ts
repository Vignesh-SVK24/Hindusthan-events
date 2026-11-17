import { getSupabaseServerClient } from './server';
import * as localDb from '@/lib/db';
import { EventItem, EventTheme, EventCategory, EventArchive } from '@/lib/types';

/**
 * Dual-Mode Database Adapter
 * Seamlessly routes queries to Supabase PostgreSQL when credentials exist,
 * and falls back gracefully to local storage when unconfigured.
 */

// ============================================================================
// 1. CATEGORIES
// ============================================================================
export async function getCategories(): Promise<EventCategory[]> {
  const supabase = getSupabaseServerClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('id', { ascending: true });
      if (!error && data && data.length > 0) {
        return data as EventCategory[];
      }
    } catch (err) {
      console.warn('Supabase categories fetch error, falling back to local storage:', err);
    }
  }
  return localDb.getDatabase().event_categories;
}

// ============================================================================
// 2. EVENTS
// ============================================================================
export async function getEvents(options: { publicOnly?: boolean; categoryId?: string; search?: string } = {}): Promise<any[]> {
  const supabase = getSupabaseServerClient();
  if (supabase) {
    try {
      let query = supabase.from('events').select('*');

      if (options.publicOnly) {
        query = query.eq('publication_status', 'published');
      }
      if (options.categoryId && options.categoryId !== 'all') {
        query = query.eq('category_id', options.categoryId);
      }
      if (options.search) {
        query = query.or(`title.ilike.%${options.search}%,description.ilike.%${options.search}%`);
      }

      query = query.order('event_date', { ascending: true });

      const { data, error } = await query;
      if (!error && data) {
        return data.map((ev: any) => ({
          ...ev,
          start_date: ev.event_date || ev.start_date,
          theme: ev.theme || {},
        }));
      }
    } catch (err) {
      console.warn('Supabase events fetch error, falling back to local storage:', err);
    }
  }
  return localDb.getAllEvents({
    publicOnly: options.publicOnly,
    category_id: options.categoryId,
    search: options.search,
  });
}

export async function getEventBySlug(slug: string): Promise<any | null> {
  const supabase = getSupabaseServerClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('slug', slug)
        .single();
      if (!error && data) {
        return {
          ...data,
          start_date: data.event_date || data.start_date,
          theme: data.theme || {},
        };
      }
    } catch (err) {
      console.warn('Supabase event by slug error, falling back to local storage:', err);
    }
  }
  return localDb.getEventBySlug(slug);
}

export async function createEvent(eventData: Partial<EventItem>, themeData?: Partial<EventTheme>, createdBy?: string): Promise<any> {
  const supabase = getSupabaseServerClient(true);
  if (supabase) {
    try {
      const record = {
        slug: eventData.slug || `event-${Date.now()}`,
        title: eventData.title || 'Untitled Event',
        tagline: eventData.tagline || '',
        short_description: eventData.short_description || '',
        description: eventData.description || '',
        category_id: eventData.category_id || 'cat-1',
        department: eventData.department || '',
        organizer: eventData.organizer || '',
        event_date: eventData.start_date || null,
        end_date: eventData.end_date || null,
        start_time: eventData.start_time || '09:00',
        end_time: eventData.end_time || '17:00',
        venue: eventData.venue || '',
        poster_url: eventData.poster_url || '',
        cover_image_url: eventData.cover_image_url || '',
        registration_enabled: eventData.registration_enabled ?? true,
        registration_type: eventData.registration_type || 'builtin',
        registration_url: eventData.registration_url || '',
        registration_deadline: eventData.registration_deadline || null,
        publication_status: eventData.publication_status || 'published',
        eligibility: eventData.eligibility || '',
        highlights: eventData.highlights || [],
        rules: eventData.rules || [],
        schedule: eventData.schedule || [],
        prizes: eventData.prizes || [],
        coordinators: eventData.coordinators || [],
        sponsors: eventData.sponsors || [],
        theme: themeData || {},
        created_by: createdBy || null,
      };

      const { data, error } = await supabase.from('events').insert(record).select().single();
      if (!error && data) {
        await supabase.from('event_history').insert({
          event_id: data.id,
          activity_type: 'CREATED',
          activity_description: `Event "${data.title}" created.`,
          performed_by: createdBy || null,
        });

        return data;
      }
    } catch (err) {
      console.warn('Supabase createEvent error, falling back to local storage:', err);
    }
  }

  return localDb.createEvent({
    title: eventData.title || 'Untitled Event',
    slug: eventData.slug || `event-${Date.now()}`,
    tagline: eventData.tagline || '',
    short_description: eventData.short_description || '',
    description: eventData.description || '',
    category_id: eventData.category_id || 'cat-1',
    department: eventData.department || '',
    organizer: eventData.organizer || '',
    start_date: eventData.start_date || '',
    end_date: eventData.end_date || eventData.start_date || '',
    start_time: eventData.start_time || '09:00',
    end_time: eventData.end_time || '17:00',
    venue: eventData.venue || '',
    poster_url: eventData.poster_url || '/college-logo.jpg',
    cover_image_url: eventData.cover_image_url || eventData.poster_url || '/college-logo.jpg',
    registration_enabled: eventData.registration_enabled ?? true,
    registration_type: eventData.registration_type || 'builtin',
    registration_url: eventData.registration_url || '',
    registration_deadline: eventData.registration_deadline || '',
    publication_status: eventData.publication_status || 'published',
    highlights: eventData.highlights || [],
    rules: eventData.rules || [],
    schedule: eventData.schedule || [],
    prizes: eventData.prizes || [],
    coordinators: eventData.coordinators || [],
    sponsors: eventData.sponsors || [],
    eligibility: eventData.eligibility || '',
    created_by: createdBy || 'admin-root',
  }, themeData);
}

export async function updateEvent(slug: string, eventData: Partial<EventItem>, themeData?: Partial<EventTheme>): Promise<any | null> {
  const supabase = getSupabaseServerClient(true);
  if (supabase) {
    try {
      const updates: any = { ...eventData };
      if (eventData.start_date) updates.event_date = eventData.start_date;
      if (themeData) updates.theme = themeData;

      const { data, error } = await supabase
        .from('events')
        .update(updates)
        .eq('slug', slug)
        .select()
        .single();

      if (!error && data) {
        await supabase.from('event_history').insert({
          event_id: data.id,
          activity_type: 'UPDATED',
          activity_description: `Event "${data.title}" updated.`,
        });
        return data;
      }
    } catch (err) {
      console.warn('Supabase updateEvent error, falling back to local storage:', err);
    }
  }

  const existing = localDb.getEventBySlug(slug);
  if (!existing) return null;
  return localDb.updateEvent(existing.id, eventData, themeData);
}

export async function deleteEvent(slug: string): Promise<boolean> {
  const supabase = getSupabaseServerClient(true);
  if (supabase) {
    try {
      const { error } = await supabase.from('events').delete().eq('slug', slug);
      if (!error) return true;
    } catch (err) {
      console.warn('Supabase deleteEvent error, falling back to local storage:', err);
    }
  }

  const existing = localDb.getEventBySlug(slug);
  if (!existing) return false;
  return localDb.deleteEvent(existing.id);
}

// ============================================================================
// 3. REGISTRATIONS & DUPLICATE PREVENTION
// ============================================================================
export async function registerForEvent(
  eventSlug: string,
  registrationData: {
    full_name: string;
    email: string;
    register_number: string;
    department: string;
    year: string;
    contact_number: string;
    college_name?: string;
    user_id?: string;
  }
): Promise<{ success: boolean; registration?: any; error?: string; alreadyRegistered?: boolean }> {
  const supabase = getSupabaseServerClient(true);
  if (supabase) {
    try {
      // Find event
      const { data: event, error: eventErr } = await supabase
        .from('events')
        .select('id, title, registration_enabled, publication_status')
        .eq('slug', eventSlug)
        .single();

      if (eventErr || !event) {
        return { success: false, error: 'Event not found.' };
      }

      if (!event.registration_enabled || event.publication_status !== 'published') {
        return { success: false, error: 'Registrations are currently closed for this event.' };
      }

      const normalizedEmail = registrationData.email.trim().toLowerCase();

      // Check duplicate registration
      const { data: existing } = await supabase
        .from('registrations')
        .select('id, registration_number')
        .eq('event_id', event.id)
        .eq('participant_email', normalizedEmail)
        .maybeSingle();

      if (existing) {
        return {
          success: false,
          alreadyRegistered: true,
          error: `You are already registered for this event with Pass #${existing.registration_number}.`,
        };
      }

      const regNumber = `HICET-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      const { data: reg, error: regErr } = await supabase
        .from('registrations')
        .insert({
          event_id: event.id,
          user_id: registrationData.user_id || null,
          registration_number: regNumber,
          participant_name: registrationData.full_name.trim(),
          participant_email: normalizedEmail,
          department: registrationData.department.trim(),
          year_of_study: registrationData.year,
          phone_number: registrationData.contact_number,
          college_name: registrationData.college_name || 'HICET',
          roll_number: registrationData.register_number,
          registration_status: 'confirmed',
        })
        .select()
        .single();

      if (regErr) {
        if (regErr.code === '23505') {
          return {
            success: false,
            alreadyRegistered: true,
            error: 'A registration with this email already exists for this event.',
          };
        }
        throw regErr;
      }

      return { success: true, registration: reg };
    } catch (err: any) {
      console.warn('Supabase register error, falling back to local storage:', err);
    }
  }

  // Fallback to local DB logic
  try {
    const existingEv = localDb.getEventBySlug(eventSlug);
    if (!existingEv) return { success: false, error: 'Event not found.' };

    const reg = localDb.registerUserForEvent({
      event_id: existingEv.id,
      full_name: registrationData.full_name,
      email: registrationData.email,
      register_number: registrationData.register_number,
      department: registrationData.department,
      year: registrationData.year,
      contact_number: registrationData.contact_number,
    });
    return { success: true, registration: reg };
  } catch (err: any) {
    if (err.message && err.message.includes('Already registered')) {
      return { success: false, alreadyRegistered: true, error: err.message };
    }
    return { success: false, error: err.message || 'Registration failed.' };
  }
}

export async function getRegistrations(eventId?: string): Promise<any[]> {
  const supabase = getSupabaseServerClient(true);
  if (supabase) {
    try {
      let query = supabase.from('registrations').select('*, events(title, slug)');
      if (eventId && eventId !== 'all') {
        query = query.eq('event_id', eventId);
      }
      query = query.order('created_at', { ascending: false });
      const { data, error } = await query;
      if (!error && data) return data;
    } catch (err) {
      console.warn('Supabase getRegistrations error, falling back to local storage:', err);
    }
  }
  const db = localDb.getDatabase();
  let list = [...db.event_registrations];
  if (eventId && eventId !== 'all') {
    list = list.filter((r) => r.event_id === eventId);
  }
  return list;
}

// ============================================================================
// 4. EVENT ARCHIVES (AIML DEPARTMENT)
// ============================================================================
export async function getEventArchives(): Promise<EventArchive[]> {
  const supabase = getSupabaseServerClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('event_archives')
        .select('*')
        .order('original_serial_number', { ascending: true });
      if (!error && data && data.length > 0) {
        return data as EventArchive[];
      }
    } catch (err) {
      console.warn('Supabase archives error, falling back to local storage:', err);
    }
  }
  return localDb.getAllEventArchives();
}

export async function getEventArchiveBySlug(slug: string): Promise<EventArchive | null> {
  const supabase = getSupabaseServerClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('event_archives')
        .select('*')
        .eq('slug', slug)
        .single();
      if (!error && data) return data as EventArchive;
    } catch (err) {
      console.warn('Supabase archive by slug error, falling back to local storage:', err);
    }
  }
  return localDb.getEventArchiveBySlug(slug);
}

export async function logAdminAction(adminUserId: string, action: string, targetType: string, targetId?: string, metadata: any = {}) {
  const supabase = getSupabaseServerClient(true);
  if (supabase) {
    try {
      await supabase.from('admin_logs').insert({
        admin_user_id: adminUserId.startsWith('admin-') ? null : adminUserId,
        action,
        target_type: targetType,
        target_id: targetId || null,
        metadata,
      });
    } catch (err) {
      console.warn('Failed to insert admin log in Supabase:', err);
    }
  }
}
