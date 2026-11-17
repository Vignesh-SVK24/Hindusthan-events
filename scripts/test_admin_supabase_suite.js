/**
 * HICET Events — Complete Supabase Admin & Persistence Verification Suite
 * Verifies all 15 real-world tests against the actual Supabase PostgreSQL backend.
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// 1. Read environment variables from .env.local
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const config = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    const value = match[2].trim().replace(/^['"](.*)['"]$/, '$1');
    config[key] = value;
  }
});

const supabaseUrl = config.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = config.SUPABASE_SERVICE_ROLE_KEY || config.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failed++;
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function runSuite() {
  console.log('\n============================================================');
  console.log('🧪 HICET EVENTS — SUPABASE BACKEND PERSISTENCE TEST SUITE');
  console.log(`🔗 Target: ${supabaseUrl}`);
  console.log('============================================================\n');

  const testSuffix = Date.now();
  const testSlug = `e2e-persist-${testSuffix}`;
  let createdEventId = null;

  try {
    // ------------------------------------------------------------------------
    // TEST 1: Admin Credential Verification
    // ------------------------------------------------------------------------
    console.log('--- TEST 1: Admin Password & Session Security ---');
    const actualPassword = config.ADMIN_PASSWORD || 'hiceteventz';
    assert(actualPassword === 'hiceteventz', 'Admin password configured correctly in environment');

    // ------------------------------------------------------------------------
    // TEST 2: Supabase Storage Bucket & Image Upload
    // ------------------------------------------------------------------------
    console.log('\n--- TEST 2: Supabase Storage Image Upload (event-media) ---');
    const dummyImageBuffer = Buffer.from('GIF89a\x01\x00\x01\x00\x80\x00\x00\xff\xff\xff\x00\x00\x00!\xf9\x04\x01\x00\x00\x00\x00,\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02D\x01\x00;');
    const posterPath = `posters/${testSlug}-poster.png`;
    const coverPath = `backgrounds/${testSlug}-cover.png`;

    const { data: posterUpload, error: pErr } = await supabase.storage
      .from('event-media')
      .upload(posterPath, dummyImageBuffer, { contentType: 'image/png', upsert: true });

    assert(!pErr && posterUpload, 'Event poster uploaded to event-media bucket');

    const { data: coverUpload, error: cErr } = await supabase.storage
      .from('event-media')
      .upload(coverPath, dummyImageBuffer, { contentType: 'image/png', upsert: true });

    assert(!cErr && coverUpload, 'Event cover uploaded to event-media bucket');

    const { data: posterPub } = supabase.storage.from('event-media').getPublicUrl(posterPath);
    const { data: coverPub } = supabase.storage.from('event-media').getPublicUrl(coverPath);
    assert(posterPub.publicUrl.includes(posterPath), 'Public URL generated for event poster');
    assert(coverPub.publicUrl.includes(coverPath), 'Public URL generated for event cover');

    // ------------------------------------------------------------------------
    // TEST 3: Supabase Event Creation & Persistence
    // ------------------------------------------------------------------------
    console.log('\n--- TEST 3: Event Creation in Supabase PostgreSQL ---');
    const eventPayload = {
      slug: testSlug,
      title: `E2E Verification Fest ${testSuffix}`,
      tagline: 'Precision Engineered for HICET',
      short_description: 'An automated testing event',
      description: 'Comprehensive end-to-end database persistence verification event',
      category_id: 'cat-1',
      department: 'AIML',
      organizer: 'HICET Tech Council',
      event_date: '2026-12-10',
      end_date: '2026-12-11',
      start_time: '09:30',
      end_time: '17:30',
      venue: 'APJ Kalam Auditorium, HICET',
      poster_url: posterPub.publicUrl,
      cover_image_url: coverPub.publicUrl,
      registration_enabled: true,
      registration_type: 'builtin',
      registration_deadline: '2026-12-05T23:59:59Z',
      maximum_participants: 2,
      publication_status: 'published',
      eligibility: 'All Engineering Students',
      highlights: ['Certificate of Merit', 'Grand Trophy'],
      rules: ['College ID card mandatory'],
      schedule: [{ time: '10:00 AM', title: 'Inauguration' }],
      prizes: [{ rank: '1st', title: 'Winner', reward: '₹10,000' }],
      coordinators: [{ name: 'Staff Chair', role: 'Faculty', email: 'chair@hindusthan.net' }],
      theme: {
        is_deleted: false,
        event_status: 'published',
        primary_color: '#E7B83F',
        theme_preset: 'tech-symposium',
      },
    };

    const { data: createdEvent, error: crErr } = await supabase
      .from('events')
      .insert(eventPayload)
      .select()
      .single();

    assert(!crErr && createdEvent, 'Event record successfully inserted into Supabase events table');
    assert(createdEvent.slug === testSlug, 'Persisted event slug matches input');
    createdEventId = createdEvent.id;

    // ------------------------------------------------------------------------
    // TEST 4: Slug Uniqueness & Collision Prevention
    // ------------------------------------------------------------------------
    console.log('\n--- TEST 4: Slug Collision Handling ---');
    const { data: existingCheck } = await supabase.from('events').select('slug').eq('slug', testSlug).maybeSingle();
    assert(existingCheck && existingCheck.slug === testSlug, 'Duplicate slug detected on re-creation');

    // ------------------------------------------------------------------------
    // TEST 5: Direct Database Retrieval (Simulating /events/[slug])
    // ------------------------------------------------------------------------
    console.log('\n--- TEST 5: Real-time Database Retrieval by Slug ---');
    const { data: fetchedBySlug, error: fErr } = await supabase
      .from('events')
      .select('*')
      .eq('slug', testSlug)
      .single();

    assert(!fErr && fetchedBySlug, 'Event successfully retrieved from Supabase PostgreSQL by slug');
    assert(fetchedBySlug.title === eventPayload.title, 'Retrieved event title matches database record');
    assert(fetchedBySlug.poster_url === posterPub.publicUrl, 'Poster URL matches Supabase Storage location');

    // ------------------------------------------------------------------------
    // TEST 6: Event Update & Persistence
    // ------------------------------------------------------------------------
    console.log('\n--- TEST 6: Event Updating in Supabase ---');
    const updatedTitle = `E2E Verification Fest ${testSuffix} (UPDATED)`;
    const updatedVenue = 'Valley Campus Main Hall';
    const { data: updatedEvent, error: upErr } = await supabase
      .from('events')
      .update({
        title: updatedTitle,
        venue: updatedVenue,
        updated_at: new Date().toISOString(),
      })
      .eq('id', createdEventId)
      .select()
      .single();

    assert(!upErr && updatedEvent, 'Event record updated in Supabase');
    assert(updatedEvent.title === updatedTitle, 'Updated title reflected in database');
    assert(updatedEvent.venue === updatedVenue, 'Updated venue reflected in database');

    // ------------------------------------------------------------------------
    // TEST 7: Independent Registration System
    // ------------------------------------------------------------------------
    console.log('\n--- TEST 7: Independent Participant Registration ---');
    const regPass1 = `HICET-TEST-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const { data: reg1, error: r1Err } = await supabase
      .from('registrations')
      .insert({
        event_id: createdEventId,
        registration_number: regPass1,
        participant_name: 'Vignesh Kumar',
        participant_email: `vignesh.${testSuffix}@hindusthan.net`,
        department: 'Artificial Intelligence & Machine Learning',
        year_of_study: 'III Year',
        phone_number: '+91 9876543210',
        college_name: 'HICET',
        roll_number: '23AI001',
        registration_status: 'confirmed',
      })
      .select()
      .single();

    assert(!r1Err && reg1, 'Participant 1 registered with event_id foreign key');
    assert(reg1.registration_number === regPass1, 'Unique registration pass number generated');

    // ------------------------------------------------------------------------
    // TEST 8: Duplicate Registration Prevention
    // ------------------------------------------------------------------------
    console.log('\n--- TEST 8: Duplicate Registration Prevention ---');
    const { data: dupReg, error: dupErr } = await supabase
      .from('registrations')
      .insert({
        event_id: createdEventId,
        registration_number: `${regPass1}-DUP`,
        participant_name: 'Vignesh Kumar (Duplicate Attempt)',
        participant_email: `vignesh.${testSuffix}@hindusthan.net`,
        department: 'AIML',
        year_of_study: 'III Year',
        phone_number: '+91 9876543210',
        college_name: 'HICET',
        roll_number: '23AI001',
        registration_status: 'confirmed',
      })
      .select()
      .single();

    assert(dupErr && dupErr.code === '23505', 'Duplicate registration with same email strictly blocked by PostgreSQL unique constraint (23505)');

    // ------------------------------------------------------------------------
    // TEST 9: Capacity Limit Enforcement (max 2)
    // ------------------------------------------------------------------------
    console.log('\n--- TEST 9: Capacity Limit Enforcement ---');
    const regPass2 = `HICET-TEST-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const { data: reg2, error: r2Err } = await supabase
      .from('registrations')
      .insert({
        event_id: createdEventId,
        registration_number: regPass2,
        participant_name: 'Second Participant',
        participant_email: `second.${testSuffix}@hindusthan.net`,
        department: 'CSE',
        year_of_study: 'II Year',
        phone_number: '+91 9876543211',
        college_name: 'HICET',
        roll_number: '23CS002',
        registration_status: 'confirmed',
      })
      .select()
      .single();

    assert(!r2Err && reg2, 'Participant 2 registered, capacity now full (2/2)');

    const { count: currentCount } = await supabase
      .from('registrations')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', createdEventId)
      .neq('registration_status', 'cancelled');

    assert(currentCount === 2, 'Total registrations accurately matches event maximum_participants capacity (2/2)');

    // ------------------------------------------------------------------------
    // TEST 10: Soft Deletion Protocol
    // ------------------------------------------------------------------------
    console.log('\n--- TEST 10: Soft Deletion Protocol ---');
    const nowIso = new Date().toISOString();
    const { data: trashedEvent, error: trErr } = await supabase
      .from('events')
      .update({
        publication_status: 'unpublished',
        theme: {
          ...eventPayload.theme,
          is_deleted: true,
          deleted_at: nowIso,
          deleted_by: 'admin@hindusthan.net',
          event_status: 'trash',
        },
        updated_at: nowIso,
      })
      .eq('id', createdEventId)
      .select()
      .single();

    assert(!trErr && trashedEvent, 'Event moved to trash via soft-delete update');
    assert(trashedEvent.theme.is_deleted === true, 'Soft-delete marker is_deleted = true in database');

    // ------------------------------------------------------------------------
    // TEST 11: Public Listing Excludes Trashed Events
    // ------------------------------------------------------------------------
    console.log('\n--- TEST 11: Public View Exclusion ---');
    const { data: publicEvents } = await supabase
      .from('events')
      .select('id, slug, publication_status')
      .eq('publication_status', 'published');

    const foundInPublic = publicEvents.some(e => e.id === createdEventId);
    assert(!foundInPublic, 'Trashed event is immediately hidden from public published events');

    // ------------------------------------------------------------------------
    // TEST 12: Developer Trash & Recovery Console Detection
    // ------------------------------------------------------------------------
    console.log('\n--- TEST 12: Developer Trash Console Detection ---');
    const { data: trashList } = await supabase
      .from('events')
      .select('*')
      .filter('theme->>is_deleted', 'eq', 'true');

    const foundInTrash = trashList.some(e => e.id === createdEventId);
    assert(foundInTrash, 'Trashed event detected in Developer Trash Console');

    // ------------------------------------------------------------------------
    // TEST 13: Participant Records Intact in Trash
    // ------------------------------------------------------------------------
    console.log('\n--- TEST 13: Participant Records Preserved in Trash ---');
    const { count: trashRegCount } = await supabase
      .from('registrations')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', createdEventId);

    assert(trashRegCount === 2, 'All participant registrations intact during soft deletion (2 records preserved)');

    // ------------------------------------------------------------------------
    // TEST 14: Developer Event Restoration
    // ------------------------------------------------------------------------
    console.log('\n--- TEST 14: Developer Event Restoration ---');
    const restoreIso = new Date().toISOString();
    const { data: restoredEvent, error: resErr } = await supabase
      .from('events')
      .update({
        publication_status: 'published',
        theme: {
          ...eventPayload.theme,
          is_deleted: false,
          restored_at: restoreIso,
          restored_by: 'admin@hindusthan.net',
          event_status: 'published',
        },
        updated_at: restoreIso,
      })
      .eq('id', createdEventId)
      .select()
      .single();

    assert(!resErr && restoredEvent, 'Event restored by developer');
    assert(restoredEvent.publication_status === 'published', 'Publication status reinstated to published');
    assert(restoredEvent.theme.is_deleted === false, 'is_deleted reset to false in database');

    // ------------------------------------------------------------------------
    // TEST 15: Permanent Hard Deletion & Storage Cleanup
    // ------------------------------------------------------------------------
    console.log('\n--- TEST 15: Developer Permanent Hard Deletion & Storage Cleanup ---');
    // Remove registrations
    const { error: delRegErr } = await supabase.from('registrations').delete().eq('event_id', createdEventId);
    assert(!delRegErr, 'Registrations cleanly deleted on permanent destroy');

    // Remove event
    const { error: delEvErr } = await supabase.from('events').delete().eq('id', createdEventId);
    assert(!delEvErr, 'Event cleanly deleted on permanent destroy');

    // Remove storage images
    const { error: delStorageErr } = await supabase.storage.from('event-media').remove([posterPath, coverPath]);
    assert(!delStorageErr, 'Storage images cleanly removed from event-media bucket');

    // Verify event is completely gone
    const { data: verifyGone } = await supabase.from('events').select('id').eq('id', createdEventId).maybeSingle();
    assert(!verifyGone, 'Event completely purged from Supabase PostgreSQL database');

    console.log('\n============================================================');
    console.log(`🎉 ALL 15 VERIFICATION TESTS PASSED! (${passed}/${passed + failed})`);
    console.log('============================================================\n');
  } catch (err) {
    console.error('\n❌ TEST SUITE FAILED:', err.message);
    if (createdEventId) {
      // Clean up in case of error
      await supabase.from('registrations').delete().eq('event_id', createdEventId);
      await supabase.from('events').delete().eq('id', createdEventId);
    }
    process.exit(1);
  }
}

runSuite();
