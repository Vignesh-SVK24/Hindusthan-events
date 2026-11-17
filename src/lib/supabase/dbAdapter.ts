import { getSupabaseServerClient } from './server';
import * as localDb from '@/lib/db';
import { EventItem, EventTheme, EventCategory, EventArchive } from '@/lib/types';

/**
 * HICET Events — Unified Supabase Database Adapter
 * Authoritative Supabase PostgreSQL persistence with fault-tolerant schema adaptation.
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
      console.warn('Supabase categories fetch error:', err);
    }
  }
  return localDb.getDatabase().event_categories;
}

// ============================================================================
// 2. EVENTS RETRIEVAL
// ============================================================================
export async function getEvents(options: {
  publicOnly?: boolean;
  categoryId?: string;
  search?: string;
  includeDeleted?: boolean;
} = {}): Promise<any[]> {
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
        // Fetch registration counts in one batch from Supabase
        const { data: allRegs } = await supabase
          .from('registrations')
          .select('event_id')
          .neq('registration_status', 'cancelled');

        const regCountMap: Record<string, number> = {};
        if (allRegs) {
          allRegs.forEach((r: any) => {
            regCountMap[r.event_id] = (regCountMap[r.event_id] || 0) + 1;
          });
        }

        const filtered = data
          .map((ev: any) => {
            const isDeleted = ev.is_deleted === true || ev.theme?.is_deleted === true;
            const eventStatus = ev.event_status || ev.theme?.event_status || (isDeleted ? 'trash' : ev.publication_status);
            return {
              ...ev,
              start_date: ev.event_date || ev.start_date,
              is_deleted: isDeleted,
              deleted_at: ev.deleted_at || ev.theme?.deleted_at || null,
              deleted_by: ev.deleted_by || ev.theme?.deleted_by || null,
              restored_at: ev.restored_at || ev.theme?.restored_at || null,
              restored_by: ev.restored_by || ev.theme?.restored_by || null,
              event_status: eventStatus,
              registration_count: regCountMap[ev.id] || 0,
              theme: ev.theme || {},
            };
          })
          .filter((ev: any) => {
            if (options.includeDeleted) return true;
            return !ev.is_deleted;
          });

        return filtered;
      }
    } catch (err) {
      console.warn('Supabase events fetch error, using local database:', err);
    }
  }

  return localDb.getAllEvents({
    publicOnly: options.publicOnly,
    category_id: options.categoryId,
    search: options.search,
    includeDeleted: options.includeDeleted,
  });
}

export async function getEventBySlug(
  slug: string,
  options: { includeDeleted?: boolean } = {}
): Promise<any | null> {
  const supabase = getSupabaseServerClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (!error && data) {
        const isDeleted = data.is_deleted === true || data.theme?.is_deleted === true;
        const eventStatus = data.event_status || data.theme?.event_status || (isDeleted ? 'trash' : data.publication_status);

        // Fetch exact registration count for this event
        const { count } = await supabase
          .from('registrations')
          .select('*', { count: 'exact', head: true })
          .eq('event_id', data.id)
          .neq('registration_status', 'cancelled');

        const eventObj = {
          ...data,
          start_date: data.event_date || data.start_date,
          is_deleted: isDeleted,
          deleted_at: data.deleted_at || data.theme?.deleted_at || null,
          deleted_by: data.deleted_by || data.theme?.deleted_by || null,
          restored_at: data.restored_at || data.theme?.restored_at || null,
          restored_by: data.restored_by || data.theme?.restored_by || null,
          event_status: eventStatus,
          registration_count: count || 0,
          theme: data.theme || {},
        };

        if (!options.includeDeleted && isDeleted) {
          return {
            ...eventObj,
            is_deleted: true,
          };
        }

        return eventObj;
      }
    } catch (err) {
      console.warn('Supabase event by slug error, using local database:', err);
    }
  }

  return localDb.getEventBySlug(slug, options);
}

// ============================================================================
// 3. EVENT CREATION & PERSISTENCE
// ============================================================================
export async function createEvent(
  eventData: Partial<EventItem>,
  themeData?: Partial<EventTheme>,
  createdBy?: string
): Promise<any> {
  const supabase = getSupabaseServerClient(true);
  if (supabase) {
    try {
      // 1. Generate guaranteed unique slug
      let baseSlug = (eventData.slug || eventData.title || `event-${Date.now()}`)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      if (!baseSlug) baseSlug = `event-${Date.now()}`;

      // Check slug collision in Supabase
      const { data: existingSlug } = await supabase
        .from('events')
        .select('slug')
        .eq('slug', baseSlug)
        .maybeSingle();

      const finalSlug = existingSlug
        ? `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`
        : baseSlug;

      const themeWithMeta = {
        ...(themeData || {}),
        is_deleted: false,
        event_status: eventData.event_status || 'published',
        deleted_at: null,
        deleted_by: null,
      };

      const record: any = {
        slug: finalSlug,
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
        maximum_participants: eventData.maximum_participants || null,
        publication_status: eventData.publication_status || 'published',
        eligibility: eventData.eligibility || '',
        highlights: eventData.highlights || [],
        rules: eventData.rules || [],
        schedule: eventData.schedule || [],
        prizes: eventData.prizes || [],
        coordinators: eventData.coordinators || [],
        sponsors: eventData.sponsors || [],
        theme: themeWithMeta,
        created_by: createdBy && createdBy.length === 36 ? createdBy : null,
      };

      const { data, error } = await supabase.from('events').insert(record).select().single();
      if (!error && data) {
        // Record event history audit
        await supabase.from('event_history').insert({
          event_id: data.id,
          activity_type: 'CREATED',
          activity_description: `Event "${data.title}" created.`,
          performed_by: createdBy || null,
        });

        // Mirror to local memory for cache sync
        try {
          localDb.createEvent({
            ...eventData,
            slug: data.slug,
            id: data.id,
            start_date: eventData.start_date || '',
            end_date: eventData.end_date || '',
          } as any, themeData);
        } catch (_) {}

        return {
          ...data,
          start_date: data.event_date || data.start_date,
          is_deleted: false,
          event_status: 'published',
          registration_count: 0,
        };
      } else if (error) {
        console.error('Supabase createEvent error:', error);
        throw new Error(error.message || 'Failed to save event to Supabase');
      }
    } catch (err: any) {
      console.error('Supabase createEvent fatal error:', err);
      throw err;
    }
  }

  // Fallback to local database if Supabase is unconfigured
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
    maximum_participants: eventData.maximum_participants,
    publication_status: eventData.publication_status || 'published',
    event_status: eventData.event_status || 'published',
    is_deleted: false,
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

// ============================================================================
// 4. EVENT UPDATING & PERSISTENCE
// ============================================================================
export async function updateEvent(
  slug: string,
  eventData: Partial<EventItem>,
  themeData?: Partial<EventTheme>
): Promise<any | null> {
  const supabase = getSupabaseServerClient(true);
  if (supabase) {
    try {
      // Find current event in Supabase
      const { data: current, error: findErr } = await supabase
        .from('events')
        .select('*')
        .or(`slug.eq.${slug},id.eq.${slug}`)
        .maybeSingle();

      if (findErr || !current) {
        throw new Error('Event not found in Supabase');
      }

      const updates: any = {};
      if (eventData.title !== undefined) updates.title = eventData.title;
      if (eventData.tagline !== undefined) updates.tagline = eventData.tagline;
      if (eventData.short_description !== undefined) updates.short_description = eventData.short_description;
      if (eventData.description !== undefined) updates.description = eventData.description;
      if (eventData.category_id !== undefined) updates.category_id = eventData.category_id;
      if (eventData.department !== undefined) updates.department = eventData.department;
      if (eventData.organizer !== undefined) updates.organizer = eventData.organizer;
      if (eventData.start_date !== undefined) updates.event_date = eventData.start_date;
      if (eventData.end_date !== undefined) updates.end_date = eventData.end_date;
      if (eventData.start_time !== undefined) updates.start_time = eventData.start_time;
      if (eventData.end_time !== undefined) updates.end_time = eventData.end_time;
      if (eventData.venue !== undefined) updates.venue = eventData.venue;
      if (eventData.poster_url !== undefined) updates.poster_url = eventData.poster_url;
      if (eventData.cover_image_url !== undefined) updates.cover_image_url = eventData.cover_image_url;
      if (eventData.registration_enabled !== undefined) updates.registration_enabled = eventData.registration_enabled;
      if (eventData.registration_type !== undefined) updates.registration_type = eventData.registration_type;
      if (eventData.registration_url !== undefined) updates.registration_url = eventData.registration_url;
      if (eventData.registration_deadline !== undefined) updates.registration_deadline = eventData.registration_deadline || null;
      if (eventData.maximum_participants !== undefined) updates.maximum_participants = eventData.maximum_participants || null;
      if (eventData.publication_status !== undefined) updates.publication_status = eventData.publication_status;
      if (eventData.eligibility !== undefined) updates.eligibility = eventData.eligibility;
      if (eventData.highlights !== undefined) updates.highlights = eventData.highlights;
      if (eventData.rules !== undefined) updates.rules = eventData.rules;
      if (eventData.schedule !== undefined) updates.schedule = eventData.schedule;
      if (eventData.prizes !== undefined) updates.prizes = eventData.prizes;
      if (eventData.coordinators !== undefined) updates.coordinators = eventData.coordinators;
      if (eventData.sponsors !== undefined) updates.sponsors = eventData.sponsors;
      updates.updated_at = new Date().toISOString();

      if (themeData || current.theme) {
        updates.theme = {
          ...(current.theme || {}),
          ...(themeData || {}),
        };
      }

      const { data, error } = await supabase
        .from('events')
        .update(updates)
        .eq('id', current.id)
        .select()
        .single();

      if (!error && data) {
        await supabase.from('event_history').insert({
          event_id: data.id,
          activity_type: 'UPDATED',
          activity_description: `Event "${data.title}" updated.`,
        });

        try {
          localDb.updateEvent(current.slug, eventData, themeData);
        } catch (_) {}

        return {
          ...data,
          start_date: data.event_date || data.start_date,
          theme: data.theme || {},
        };
      } else if (error) {
        console.error('Supabase updateEvent error:', error);
        throw new Error(error.message || 'Failed to update event in Supabase');
      }
    } catch (err: any) {
      console.error('Supabase updateEvent fatal error:', err);
      throw err;
    }
  }

  const existing = localDb.getEventBySlug(slug);
  if (!existing) return null;
  return localDb.updateEvent(existing.id, eventData, themeData);
}

// ============================================================================
// 5. EVENT SOFT-DELETION & RECOVERY PROTOCOL
// ============================================================================
export async function softDeleteEvent(slug: string, deletedBy?: string): Promise<boolean> {
  const supabase = getSupabaseServerClient(true);
  if (supabase) {
    try {
      const now = new Date().toISOString();
      const { data: current } = await supabase
        .from('events')
        .select('id, title, theme')
        .eq('slug', slug)
        .maybeSingle();

      if (!current) return false;

      const updatedTheme = {
        ...(current.theme || {}),
        is_deleted: true,
        deleted_at: now,
        deleted_by: deletedBy || null,
        event_status: 'trash',
      };

      const { data, error } = await supabase
        .from('events')
        .update({
          publication_status: 'unpublished',
          theme: updatedTheme,
          updated_at: now,
        })
        .eq('id', current.id)
        .select()
        .single();

      if (!error && data) {
        await supabase.from('event_history').insert({
          event_id: data.id,
          activity_type: 'TRASHED',
          activity_description: `Event "${data.title}" moved to trash.`,
          performed_by: deletedBy || null,
        });

        try {
          localDb.softDeleteEvent(slug, deletedBy);
        } catch (_) {}

        return true;
      }
    } catch (err) {
      console.error('Supabase softDeleteEvent error:', err);
    }
  }

  return localDb.softDeleteEvent(slug, deletedBy);
}

export const deleteEvent = softDeleteEvent;

export async function restoreEvent(slug: string, restoredBy?: string): Promise<boolean> {
  const supabase = getSupabaseServerClient(true);
  if (supabase) {
    try {
      const now = new Date().toISOString();
      const { data: current } = await supabase
        .from('events')
        .select('id, title, theme')
        .eq('slug', slug)
        .maybeSingle();

      if (!current) return false;

      const updatedTheme = {
        ...(current.theme || {}),
        is_deleted: false,
        restored_at: now,
        restored_by: restoredBy || null,
        event_status: 'published',
      };

      const { data, error } = await supabase
        .from('events')
        .update({
          publication_status: 'published',
          theme: updatedTheme,
          updated_at: now,
        })
        .eq('id', current.id)
        .select()
        .single();

      if (!error && data) {
        await supabase.from('event_history').insert({
          event_id: data.id,
          activity_type: 'RESTORED',
          activity_description: `Event "${data.title}" restored from trash.`,
          performed_by: restoredBy || null,
        });

        try {
          localDb.restoreEvent(slug, restoredBy);
        } catch (_) {}

        return true;
      }
    } catch (err) {
      console.error('Supabase restoreEvent error:', err);
    }
  }

  return localDb.restoreEvent(slug, restoredBy);
}

export async function permanentDeleteEvent(slug: string): Promise<boolean> {
  const supabase = getSupabaseServerClient(true);
  if (supabase) {
    try {
      const { data: ev } = await supabase.from('events').select('id, poster_url, cover_image_url').eq('slug', slug).maybeSingle();
      if (ev) {
        // 1. Remove registrations
        await supabase.from('registrations').delete().eq('event_id', ev.id);
        // 2. Remove event history
        await supabase.from('event_history').delete().eq('event_id', ev.id);
        // 3. Remove event record
        await supabase.from('events').delete().eq('id', ev.id);

        try {
          localDb.permanentDeleteEvent(slug);
        } catch (_) {}

        return true;
      }
    } catch (err) {
      console.error('Supabase permanentDeleteEvent error:', err);
    }
  }

  return localDb.permanentDeleteEvent(slug);
}

export async function getTrashedEvents(): Promise<any[]> {
  const supabase = getSupabaseServerClient(true);
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .filter('theme->>is_deleted', 'eq', 'true')
        .order('updated_at', { ascending: false });

      if (!error && data) {
        // Fetch registration counts
        const { data: regs } = await supabase.from('registrations').select('event_id');
        const regCounts: Record<string, number> = {};
        if (regs) {
          regs.forEach((r: any) => {
            regCounts[r.event_id] = (regCounts[r.event_id] || 0) + 1;
          });
        }

        return data.map((ev: any) => ({
          ...ev,
          start_date: ev.event_date || ev.start_date,
          is_deleted: true,
          deleted_at: ev.deleted_at || ev.theme?.deleted_at,
          deleted_by: ev.deleted_by || ev.theme?.deleted_by,
          registration_count: regCounts[ev.id] || 0,
        }));
      }
    } catch (err) {
      console.warn('Supabase getTrashedEvents error:', err);
    }
  }

  return localDb.getTrashedEvents();
}

// ============================================================================
// 6. REGISTRATIONS & CAPACITY ENFORCEMENT
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
      const { data: event, error: eventErr } = await supabase
        .from('events')
        .select('id, title, registration_enabled, publication_status, maximum_participants, registration_deadline, theme')
        .eq('slug', eventSlug)
        .single();

      if (eventErr || !event) {
        return { success: false, error: 'Event not found.' };
      }

      const isDeleted = event.theme?.is_deleted === true;
      if (isDeleted) {
        return { success: false, error: 'This event is currently unavailable or removed.' };
      }

      if (!event.registration_enabled || event.publication_status !== 'published') {
        return { success: false, error: 'Registrations are currently closed for this event.' };
      }

      if (event.registration_deadline) {
        if (new Date() > new Date(event.registration_deadline)) {
          return { success: false, error: 'The registration deadline for this event has passed.' };
        }
      }

      if (event.maximum_participants && typeof event.maximum_participants === 'number' && event.maximum_participants > 0) {
        const { count, error: countErr } = await supabase
          .from('registrations')
          .select('*', { count: 'exact', head: true })
          .eq('event_id', event.id)
          .neq('registration_status', 'cancelled');

        if (!countErr && typeof count === 'number' && count >= event.maximum_participants) {
          return { success: false, error: `Event registration is full. Maximum participant capacity (${event.maximum_participants}) reached.` };
        }
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
          user_id: registrationData.user_id && registrationData.user_id.length === 36 ? registrationData.user_id : null,
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
        return { success: false, error: regErr.message || 'Registration failed.' };
      }

      // Record in event history (non-blocking)
      try {
        await supabase.from('event_history').insert({
          event_id: event.id,
          activity_type: 'REGISTERED',
          activity_description: `Participant "${registrationData.full_name.trim()}" registered (${regNumber}).`,
        });
      } catch (hErr) {
        console.warn('Non-critical event history insert warning:', hErr);
      }

      return {
        success: true,
        registration: {
          id: reg.id,
          event_id: event.id,
          event_title: event.title,
          register_number: reg.registration_number,
          registration_number: reg.registration_number,
          full_name: reg.participant_name,
          email: reg.participant_email,
          department: reg.department,
          year: reg.year_of_study,
          contact_number: reg.phone_number,
          created_at: reg.created_at,
          registration_status: reg.registration_status,
        },
      };
    } catch (err: any) {
      console.error('Supabase registerForEvent error:', err);
      return { success: false, error: err.message || 'Registration failed.' };
    }
  }

  // Fallback to local DB
  const localResult = localDb.registerUserForEvent({
    event_id: eventSlug,
    ...registrationData,
  });

  return {
    success: localResult.success,
    alreadyRegistered: localResult.alreadyRegistered,
    error: localResult.error || localResult.message,
    registration: localResult.registration,
  };
}

// ============================================================================
// 7. ADMIN STATS & REPORTING
// ============================================================================
export async function getAdminStats(): Promise<{
  total: number;
  published: number;
  drafts: number;
  upcoming: number;
  ongoing: number;
  completed: number;
  regEnabled: number;
  regDisabled: number;
  totalRegistrations: number;
}> {
  const supabase = getSupabaseServerClient(true);
  if (supabase) {
    try {
      const { data: events, error } = await supabase.from('events').select('*');
      const { count: regCount } = await supabase
        .from('registrations')
        .select('*', { count: 'exact', head: true })
        .neq('registration_status', 'cancelled');

      if (!error && events) {
        const activeEvents = events.filter((e: any) => e.theme?.is_deleted !== true && e.is_deleted !== true);
        const total = activeEvents.length;
        const published = activeEvents.filter((e: any) => e.publication_status === 'published').length;
        const drafts = activeEvents.filter((e: any) => e.publication_status === 'draft' || e.publication_status === 'unpublished').length;

        const todayStr = new Date().toISOString().split('T')[0];
        const upcoming = activeEvents.filter((e: any) => e.publication_status === 'published' && (e.event_date || e.start_date) > todayStr).length;
        const ongoing = activeEvents.filter((e: any) => {
          const start = e.event_date || e.start_date;
          const end = e.end_date || start;
          return e.publication_status === 'published' && start <= todayStr && end >= todayStr;
        }).length;
        const completed = activeEvents.filter((e: any) => {
          const end = e.end_date || e.event_date || e.start_date;
          return e.publication_status === 'published' && end < todayStr;
        }).length;

        const regEnabled = activeEvents.filter((e: any) => e.registration_enabled).length;
        const regDisabled = activeEvents.filter((e: any) => !e.registration_enabled).length;

        return {
          total,
          published,
          drafts,
          upcoming,
          ongoing,
          completed,
          regEnabled,
          regDisabled,
          totalRegistrations: regCount || 0,
        };
      }
    } catch (err) {
      console.warn('Supabase getAdminStats error, using local fallback:', err);
    }
  }

  return localDb.getAdminStats();
}

export async function getAdminRegistrations(options: {
  event_id?: string;
  department?: string;
  search?: string;
} = {}): Promise<any[]> {
  const supabase = getSupabaseServerClient(true);
  if (supabase) {
    try {
      let query = supabase.from('registrations').select(`
        id,
        event_id,
        registration_number,
        participant_name,
        participant_email,
        department,
        year_of_study,
        phone_number,
        college_name,
        roll_number,
        registration_status,
        created_at
      `).order('created_at', { ascending: false });

      if (options.event_id && options.event_id !== 'all') {
        query = query.eq('event_id', options.event_id);
      }
      if (options.department && options.department !== 'all') {
        query = query.ilike('department', `%${options.department}%`);
      }
      if (options.search) {
        query = query.or(`participant_name.ilike.%${options.search}%,participant_email.ilike.%${options.search}%,roll_number.ilike.%${options.search}%`);
      }

      const { data: regs, error: regErr } = await query;
      if (!regErr && regs) {
        // Fetch event titles
        const { data: events } = await supabase.from('events').select('id, title, slug');
        const eventMap: Record<string, { title: string; slug: string }> = {};
        if (events) {
          events.forEach((e: any) => {
            eventMap[e.id] = { title: e.title, slug: e.slug };
          });
        }

        return regs.map((r: any) => ({
          id: r.id,
          event_id: r.event_id,
          event_title: eventMap[r.event_id]?.title || 'Unknown Event',
          event_slug: eventMap[r.event_id]?.slug || '',
          registration_number: r.registration_number,
          register_number: r.roll_number || r.registration_number,
          full_name: r.participant_name,
          email: r.participant_email,
          department: r.department,
          year: r.year_of_study,
          contact_number: r.phone_number,
          college_name: r.college_name,
          registration_status: r.registration_status,
          created_at: r.created_at,
        }));
      }
    } catch (err) {
      console.warn('Supabase getAdminRegistrations error:', err);
    }
  }

  // Fallback
  const db = localDb.getDatabase();
  let registrations = [...db.event_registrations];

  if (options.event_id && options.event_id !== 'all') {
    registrations = registrations.filter((r) => r.event_id === options.event_id);
  }
  if (options.department && options.department !== 'all') {
    registrations = registrations.filter((r) =>
      r.department.toLowerCase().includes((options.department || '').toLowerCase())
    );
  }
  if (options.search) {
    const q = options.search.toLowerCase();
    registrations = registrations.filter(
      (r) =>
        r.full_name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.register_number.toLowerCase().includes(q)
    );
  }

  return registrations.map((r) => {
    const event = db.events.find((e) => e.id === r.event_id);
    return {
      ...r,
      event_title: event?.title || 'Unknown Event',
      event_slug: event?.slug || '',
    };
  });
}

// ============================================================================
// 8. AUDIT LOGGING
// ============================================================================
export async function logAdminAction(
  adminId: string,
  action: string,
  targetType: string,
  targetId: string,
  details: any = {}
): Promise<void> {
  const supabase = getSupabaseServerClient(true);
  if (supabase) {
    try {
      await supabase.from('admin_logs').insert({
        admin_id: adminId && adminId.length === 36 ? adminId : null,
        action,
        target_type: targetType,
        target_id: targetId,
        details,
      });
    } catch (err) {
      console.warn('Supabase admin log error:', err);
    }
  }
}
