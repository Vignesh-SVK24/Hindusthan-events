const http = require('http');

const BASE_URL = 'http://localhost:3000';

function fetchUrl(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const reqOptions = {
      method: options.method || 'GET',
      headers: options.headers || {},
    };

    const req = http.request(url, reqOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch (_) {}
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data,
          json,
        });
      });
    });

    req.on('error', reject);
    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('====================================================');
  console.log('🧪 RUNNING AIML EVENT ARCHIVES ACCEPTANCE TEST SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ ${message}`);
      passed++;
    } else {
      console.error(`❌ FAILED: ${message}`);
      failed++;
    }
  }

  // TEST 1: Homepage Navigation & Attribution
  const homeRes = await fetchUrl('/');
  assert(homeRes.status === 200, 'Homepage loaded with HTTP 200 OK');
  assert(homeRes.data.includes('AIML Event Archives'), 'Navbar contains "AIML Event Archives"');
  assert(homeRes.data.includes('Department of Artificial Intelligence and Machine Learning (AIML)'), 'Homepage includes "Department of Artificial Intelligence and Machine Learning (AIML)" attribution');
  assert(homeRes.data.includes('Website Developed and managed by Vignesh S - AIML'), 'Homepage includes "Website Developed and managed by Vignesh S - AIML" developer credit');

  // TEST 2: Dedicated Archives Page
  const archRes = await fetchUrl('/event-archives');
  assert(archRes.status === 200, 'Archive listing page (/event-archives) loaded with HTTP 200 OK');
  assert(archRes.data.includes('AIML EVENT ARCHIVES'), 'Archive page includes exact heading "AIML EVENT ARCHIVES"');
  assert(archRes.data.includes('Explore the events, workshops, technical sessions, seminars and departmental activities conducted by the Department of Artificial Intelligence and Machine Learning.'), 'Archive page includes exact introductory subtitle');

  // TEST 3: Public API /api/archives Record Count
  const apiRes = await fetchUrl('/api/archives');
  assert(apiRes.status === 200, 'API /api/archives returned HTTP 200 OK');
  assert(apiRes.json && apiRes.json.total === 20, `API returned exactly 20 historical archive records (got ${apiRes.json?.total})`);

  // TEST 4: Integrity of Specific Historical Records
  const records = apiRes.json.archives;
  const rec1 = records[0];
  assert(rec1.original_serial_number === '1', 'Record 1 has original S.No 1');
  assert(rec1.event_name === 'Career Guidance Program titled “AI to the World: Unlocking Global Education & Career Pathways', 'Record 1 title matches authoritative source');
  assert(rec1.event_date_original === '28.07.2025', 'Record 1 date matches exact original date 28.07.2025');
  assert(rec1.photo_url !== null, 'Record 1 has photo URL preserved');
  assert(rec1.geo_tag !== null, 'Record 1 has GPS geo-tag preserved');

  // TEST 5: Numbering Irregularity Preservation (5, 6, 7 repeats)
  const snos = records.map(r => r.original_serial_number);
  assert(snos[4] === '5' && snos[7] === '5', 'Preserved original numbering irregularity: repeated S.No 5');
  assert(snos[5] === '6' && snos[8] === '6', 'Preserved original numbering irregularity: repeated S.No 6');
  assert(snos[6] === '7' && snos[9] === '7', 'Preserved original numbering irregularity: repeated S.No 7');

  // TEST 6: Missing fields left empty / null
  const rec4 = records[3]; // FDP
  assert(rec4.resource_person === '', 'Record 4 (FDP) resource person left empty as in source');
  const rec19 = records[18]; // NextGen Hackathon
  assert(rec19.photo_url === null, 'Record 19 (Hackathon) photo left null as in source');
  assert(rec19.geo_tag !== null, 'Record 19 geo-tag preserved as in source');
  const rec3 = records[2]; // Gender roles
  assert(rec3.geo_tag === null, 'Record 3 geo-tag left null as in source');

  // TEST 7: Search and Filter API
  const searchRes = await fetchUrl('/api/archives?search=Cyber%20Security');
  assert(searchRes.json && searchRes.json.total === 1, 'Search query "Cyber Security" filtered to exactly 1 record');
  
  const searchSpeaker = await fetchUrl('/api/archives?search=Prakash%20Eswar');
  assert(searchSpeaker.json && searchSpeaker.json.total === 2, 'Search query "Prakash Eswar" filtered to exactly 2 records');

  // TEST 8: All 20 Detail Pages Return HTTP 200
  let allPagesOk = true;
  for (const r of records) {
    const pageRes = await fetchUrl(`/event-archives/${r.slug}`);
    if (pageRes.status !== 200) {
      allPagesOk = false;
      console.error(`Page /event-archives/${r.slug} returned status ${pageRes.status}`);
      break;
    }
    // Verify no registration button exists
    if (pageRes.data.includes('Register Now') || pageRes.data.includes('registration_enabled')) {
      console.error(`Page /event-archives/${r.slug} has unwanted registration button!`);
      allPagesOk = false;
      break;
    }
  }
  assert(allPagesOk, 'All 20 dynamic archive detail pages load HTTP 200 with NO registration buttons');

  // TEST 9: Admin Password Authentication & Protection
  const unauthPost = await fetchUrl('/api/admin/archives', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { event_name: 'Test', event_date_original: '2026-01-01' }
  });
  assert(unauthPost.status === 403, 'Unauthorized POST /api/admin/archives blocked with HTTP 403 Forbidden');

  // Login as admin
  const loginRes = await fetchUrl('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { password: 'hiceteventz' },
  });
  assert(loginRes.status === 200, 'Admin authenticated successfully with "hiceteventz"');
  const setCookie = loginRes.headers['set-cookie']?.[0]?.split(';')[0] || '';

  // TEST 10: Admin Create & Delete Historical Record
  const createRes = await fetchUrl('/api/admin/archives', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: setCookie,
    },
    body: {
      original_serial_number: '99',
      event_name: 'Test Archival Seminar for Acceptance Suite',
      event_date_original: '15.11.2025',
      resource_person: 'Dr. Test Speaker',
      event_coordinators: 'Prof. Test Coordinator',
      academic_year: '2025-2026',
    },
  });
  assert(createRes.status === 201, 'Admin successfully created new archive record');
  const createdId = createRes.json?.archive?.id;

  if (createdId) {
    // Delete test record
    const delRes = await fetchUrl(`/api/admin/archives/${createdId}`, {
      method: 'DELETE',
      headers: { Cookie: setCookie },
    });
    assert(delRes.status === 200, 'Admin successfully deleted temporary test archive record');
  }

  // TEST 11: Existing Live Events & Registration ON/OFF Preservation
  const liveEventsRes = await fetchUrl('/api/events');
  assert(liveEventsRes.status === 200 && liveEventsRes.json?.events?.length >= 5, 'Live College Events remain intact (5 active events)');
  const regBlocked = await fetchUrl('/api/events/ai-cloud-native-workshop-2026/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: {
      full_name: 'Test Student',
      email: 'test@hindusthan.net',
      register_number: '720721104999',
      department: 'AI & Data Science',
      year: '3rd Year',
      contact_number: '+91 98765 00000',
    },
  });
  assert(regBlocked.status === 403, 'Existing live event registration OFF engine remains strictly enforced (403)');

  console.log('\n====================================================');
  console.log(`🎉 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
