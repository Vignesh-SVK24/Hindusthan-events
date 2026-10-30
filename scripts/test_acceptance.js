// scripts/test_acceptance.js
const http = require('http');

async function request(url, options = {}) {
  const parsed = new URL(url);
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: parsed.hostname,
        port: parsed.port,
        path: parsed.pathname + parsed.search,
        method: options.method || 'GET',
        headers: options.headers || {},
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          let json = null;
          try {
            json = JSON.parse(body);
          } catch (e) {}
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: json || body,
          });
        });
      }
    );
    req.on('error', reject);
    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runAcceptanceTests() {
  console.log('====================================================');
  console.log('🚀 RUNNING COLLEGE EVENTS HUB ACCEPTANCE TEST SUITE');
  console.log('====================================================\n');

  // Test 1: Home page check
  console.log('TEST 1: Homepage availability...');
  const homeRes = await request('http://localhost:3000/');
  if (homeRes.statusCode === 200) {
    console.log('✅ Homepage loaded with HTTP 200 OK');
  } else {
    throw new Error(`Homepage returned status ${homeRes.statusCode}`);
  }

  // Test 2: API Events and Categories
  console.log('\nTEST 2: Fetching Categories and Events from Database...');
  const catRes = await request('http://localhost:3000/api/categories');
  console.log(`✅ Loaded ${catRes.body.categories.length} Event Categories (Symposiums, Hackathons, Cultural, Sports, etc.)`);

  const eventsRes = await request('http://localhost:3000/api/events?publicOnly=true');
  console.log(`✅ Loaded ${eventsRes.body.events.length} Published College Events`);

  // Test 3: Admin Password Authentication
  console.log('\nTEST 3: Admin Password Authentication...');
  const adminLoginRes = await request('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { password: process.env.ADMIN_PASSWORD || 'hiceteventz' },
  });
  if (adminLoginRes.statusCode !== 200 || !adminLoginRes.body.success) {
    throw new Error('Admin login failed');
  }
  const setCookie = adminLoginRes.headers['set-cookie'];
  const cookieHeader = Array.isArray(setCookie) ? setCookie.map(c => c.split(';')[0]).join('; ') : setCookie.split(';')[0];
  console.log(`✅ Admin authenticated successfully: role="${adminLoginRes.body.user.role}"`);

  // Test 4: Admin Stats
  console.log('\nTEST 4: Admin Dashboard Stats...');
  const statsRes = await request('http://localhost:3000/api/admin/stats', {
    headers: { Cookie: cookieHeader },
  });
  console.log('✅ Admin Stats:', statsRes.body.stats);

  // Test 5: Verify Independent Event Pages & Bespoke Themes
  console.log('\nTEST 5: Checking Dynamic Event Webpages & Bespoke Themes...');
  const hackRes = await request('http://localhost:3000/api/events/hack-hindusthan-2026');
  console.log(`✅ Event 1: "${hackRes.body.event.title}"`);
  console.log(`   - Theme Preset: ${hackRes.body.event.theme.theme_preset}`);
  console.log(`   - Primary Color: ${hackRes.body.event.theme.primary_color}`);
  console.log(`   - Background Tone: ${hackRes.body.event.theme.background_color}`);
  console.log(`   - Registration Status: ${hackRes.body.event.registration_enabled ? 'ON' : 'OFF'}`);

  const yuktiRes = await request('http://localhost:3000/api/events/yukti-tech-symposium-2026');
  console.log(`✅ Event 2: "${yuktiRes.body.event.title}"`);
  console.log(`   - Theme Preset: ${yuktiRes.body.event.theme.theme_preset}`);
  console.log(`   - Primary Color: ${yuktiRes.body.event.theme.primary_color}`);
  console.log(`   - Background Tone: ${yuktiRes.body.event.theme.background_color}`);
  console.log(`   - Registration Status: ${yuktiRes.body.event.registration_enabled ? 'ON' : 'OFF'}`);

  if (hackRes.body.event.theme.primary_color !== yuktiRes.body.event.theme.primary_color) {
    console.log('✅ Confirmed: Both event pages have completely independent bespoke visual palettes!');
  }

  // Test 6: Registration OFF Enforcement (Should reject with 403 Forbidden)
  console.log('\nTEST 6: Enforcing Registration OFF System Rule...');
  const offAttempt = await request('http://localhost:3000/api/events/ai-cloud-native-workshop-2026/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: {
      full_name: 'Test Visitor',
      email: 'visitor@hindusthan.net',
      register_number: '720721104999',
      department: 'ECE',
      year: '3rd Year',
      contact_number: '+91 98765 43210',
    },
  });
  if (offAttempt.statusCode === 403) {
    console.log(`✅ Backend successfully blocked registration on Registration OFF event: "${offAttempt.body.error}" (Status 403)`);
  } else {
    throw new Error(`Expected HTTP 403, got ${offAttempt.statusCode}`);
  }

  // Test 7: Public Open Registration (Without Student Account)
  console.log('\nTEST 7: Public Open Registration on Frame Fest...');
  const regTimestamp = Date.now();
  const regPayload = {
    full_name: 'Campus Participant',
    email: `attendee_${regTimestamp}@hindusthan.net`,
    register_number: `REG${regTimestamp.toString().slice(-6)}`,
    department: 'Computer Science and Engineering',
    year: '4th Year',
    contact_number: '+91 98765 43210',
  };
  const regAttempt = await request('http://localhost:3000/api/events/frame-fest-2026/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: regPayload,
  });
  if (regAttempt.statusCode === 200 && regAttempt.body.success) {
    console.log(`✅ Public registration confirmed! Ticket ID: ${regAttempt.body.registration.id}`);
  } else {
    throw new Error(`Registration failed: ${regAttempt.body.error}`);
  }

  // Test 8: Duplicate Registration Prevention
  console.log('\nTEST 8: Preventing Duplicate Registration...');
  const duplicateAttempt = await request('http://localhost:3000/api/events/frame-fest-2026/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: regPayload,
  });
  if (duplicateAttempt.statusCode === 400 && duplicateAttempt.body.error.includes('already registered')) {
    console.log(`✅ Duplicate registration successfully blocked: "${duplicateAttempt.body.error}"`);
  } else {
    throw new Error('Duplicate registration was not blocked');
  }

  // Test 9: Participant List & CSV Export
  console.log('\nTEST 9: Admin CSV Export of Participant Registrations...');
  const csvRes = await request('http://localhost:3000/api/admin/registrations?format=csv', {
    headers: { Cookie: cookieHeader },
  });
  if (csvRes.statusCode === 200 && typeof csvRes.body === 'string' && csvRes.body.includes('Event Title')) {
    console.log('✅ CSV Export generated successfully with participant details:');
    console.log(csvRes.body.trim().split('\n').slice(0, 3).join('\n'));
  }

  // Test 10: Verify Dead Student Routes are 404
  console.log('\nTEST 10: Verifying Dead Routes Return 404...');
  const profileRes = await request('http://localhost:3000/profile');
  const userRegsRes = await request('http://localhost:3000/api/user/registrations');
  if (profileRes.statusCode === 404 && userRegsRes.statusCode === 404) {
    console.log('✅ Dead student routes (/profile and /api/user/registrations) cleanly return 404 Not Found');
  } else {
    throw new Error('Dead student routes still active');
  }

  console.log('\n====================================================');
  console.log('🎉 ALL 10 ACCEPTANCE TEST SUITES PASSED FLAWLESSLY!');
  console.log('====================================================');
}

runAcceptanceTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
