/**
 * HICET Events — Supabase Database Migration & Seeding Script
 * Reads the existing data from data/college_events.json and migrates it to Supabase PostgreSQL.
 *
 * Usage:
 *   node scripts/seed_supabase.js
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load .env.local if present
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^['"](.*)['"]$/, '$1');
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project-id')) {
  console.error('\n❌ ERROR: Supabase credentials not found in environment variables.');
  console.log('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY) in .env.local.\n');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('\n======================================================');
  console.log('🚀 Starting HICET Events Supabase Database Migration');
  console.log(`🔗 Target Supabase URL: ${supabaseUrl}`);
  console.log('======================================================\n');

  const dataFile = path.join(__dirname, '..', 'data', 'college_events.json');
  if (!fs.existsSync(dataFile)) {
    console.error('❌ Data file data/college_events.json not found.');
    process.exit(1);
  }

  const raw = fs.readFileSync(dataFile, 'utf8');
  const dbData = JSON.parse(raw);

  // 1. Categories
  const categoriesList = dbData.event_categories || dbData.categories || [];
  if (categoriesList.length > 0) {
    console.log(`📦 Migrating ${categoriesList.length} categories...`);
    const { error: catErr } = await supabase.from('categories').upsert(categoriesList, { onConflict: 'id' });
    if (catErr) {
      console.warn('⚠️ Categories warning:', catErr.message);
    } else {
      console.log('✅ Categories successfully seeded.');
    }
  }

  // 2. Events
  if (dbData.events && dbData.events.length > 0) {
    console.log(`📦 Migrating ${dbData.events.length} events...`);
    const eventsToInsert = dbData.events.map(ev => {
      const { id, theme, ...rest } = ev;
      return {
        slug: ev.slug,
        title: ev.title,
        tagline: ev.tagline || '',
        short_description: ev.short_description || '',
        description: ev.description || '',
        category_id: ev.category_id || 'cat-1',
        department: ev.department || '',
        organizer: ev.organizer || '',
        event_date: ev.start_date || null,
        end_date: ev.end_date || null,
        start_time: ev.start_time || '09:00',
        end_time: ev.end_time || '17:00',
        venue: ev.venue || '',
        poster_url: ev.poster_url || '',
        cover_image_url: ev.cover_image_url || '',
        registration_enabled: ev.registration_enabled ?? true,
        registration_type: ev.registration_type || 'builtin',
        registration_url: ev.registration_url || '',
        registration_deadline: ev.registration_deadline || null,
        publication_status: ev.publication_status || 'published',
        eligibility: ev.eligibility || '',
        highlights: ev.highlights || [],
        rules: ev.rules || [],
        schedule: ev.schedule || [],
        prizes: ev.prizes || [],
        coordinators: ev.coordinators || [],
        sponsors: ev.sponsors || [],
        theme: theme || (dbData.themes ? dbData.themes.find(t => t.event_id === ev.id) : {}),
      };
    });

    for (const eventItem of eventsToInsert) {
      const { error: evErr } = await supabase.from('events').upsert(eventItem, { onConflict: 'slug' });
      if (evErr) {
        console.warn(`⚠️ Event "${eventItem.title}" warning:`, evErr.message);
      } else {
        console.log(`✅ Event: ${eventItem.title}`);
      }
    }
  }

  // 3. Archives
  const archivesList = dbData.event_archives || dbData.archives || [];
  if (archivesList.length > 0) {
    console.log(`📦 Migrating ${archivesList.length} AIML department archives...`);
    for (const arch of archivesList) {
      const { error: archErr } = await supabase.from('event_archives').upsert(arch, { onConflict: 'slug' });
      if (archErr) {
        console.warn(`⚠️ Archive "${arch.event_name}" warning:`, archErr.message);
      }
    }
    console.log('✅ AIML Archives successfully seeded.');
  }

  console.log('\n======================================================');
  console.log('🎉 Supabase Database Migration Completed Successfully!');
  console.log('======================================================\n');
}

seed().catch(err => {
  console.error('Fatal migration error:', err);
  process.exit(1);
});
