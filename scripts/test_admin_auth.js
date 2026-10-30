const http = require('http');

function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body,
          json: () => {
            try {
              return JSON.parse(body);
            } catch {
              return null;
            }
          },
        });
      });
    });
    req.on('error', reject);
    if (data) {
      req.write(typeof data === 'string' ? data : JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('=== STARTING ADMIN SECURITY & CLEANUP ACCEPTANCE SUITE ===\n');
  let passCount = 0;
  let failCount = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passCount++;
    } else {
      console.error(`[FAIL] ${message}`);
      failCount++;
    }
  }

  try {
    // 1. Public Homepage
    const homeRes = await request({ host: 'localhost', port: 3000, path: '/', method: 'GET' });
    assert(homeRes.statusCode === 200, 'Public Homepage returns HTTP 200 without authentication');

    // 2. Protected admin endpoint without auth
    const unauthStats = await request({ host: 'localhost', port: 3000, path: '/api/admin/stats', method: 'GET' });
    assert(unauthStats.statusCode === 403, 'Accessing /api/admin/stats without session returns HTTP 403 Forbidden');

    // 3. Login with wrong password
    const wrongLogin = await request(
      {
        host: 'localhost',
        port: 3000,
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { password: 'wrongpassword123' }
    );
    assert(wrongLogin.statusCode === 401, 'Submitting incorrect admin password returns HTTP 401 Unauthorized');
    assert(wrongLogin.json()?.error === 'Invalid administrator password.', 'Error message is generic and does not leak credentials');

    // 4. Login with correct password: hiceteventz
    const correctLogin = await request(
      {
        host: 'localhost',
        port: 3000,
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { password: 'hiceteventz' }
    );
    assert(correctLogin.statusCode === 200, 'Submitting correct admin password "hiceteventz" returns HTTP 200');
    assert(correctLogin.json()?.user?.role === 'admin', 'Login response returns role: admin');

    const setCookie = correctLogin.headers['set-cookie'];
    assert(setCookie && setCookie.some((c) => c.includes('college_hub_admin_session')), 'Returns HTTP-only college_hub_admin_session cookie');

    const sessionCookie = setCookie.find((c) => c.includes('college_hub_admin_session')).split(';')[0];

    // 5. Protected admin endpoint WITH auth
    const authStats = await request({
      host: 'localhost',
      port: 3000,
      path: '/api/admin/stats',
      method: 'GET',
      headers: { Cookie: sessionCookie },
    });
    assert(authStats.statusCode === 200, 'Accessing /api/admin/stats WITH admin session returns HTTP 200');
    assert(authStats.json()?.stats?.total >= 1, 'Admin stats returns valid metrics');

    // 6. Verify /api/auth/me returns authenticated admin
    const meRes = await request({
      host: 'localhost',
      port: 3000,
      path: '/api/auth/me',
      method: 'GET',
      headers: { Cookie: sessionCookie },
    });
    assert(meRes.statusCode === 200 && meRes.json()?.authenticated === true, '/api/auth/me returns authenticated: true for admin');

    // 7. Verify public event page
    const eventRes = await request({ host: 'localhost', port: 3000, path: '/events/hack-hindusthan-2026', method: 'GET' });
    assert(eventRes.statusCode === 200, 'Public dynamic event page /events/hack-hindusthan-2026 returns HTTP 200');

    // 8. Public event registration without login
    const randomSuffix = Math.floor(Math.random() * 90000 + 10000);
    const regPayload = {
      full_name: 'Test Attendee ' + randomSuffix,
      email: `attendee_${randomSuffix}@test.hindusthan.net`,
      register_number: `REG${randomSuffix}`,
      department: 'Robotics and Automation',
      year: '2nd Year',
      contact_number: '+91 91234 56789',
    };
    const regRes = await request(
      {
        host: 'localhost',
        port: 3000,
        path: '/api/events/hack-hindusthan-2026/register',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      regPayload
    );
    assert(regRes.statusCode === 200, 'Public visitor can register without student account and receives HTTP 200');
    assert(regRes.json()?.registration?.id, 'Registration record generated with unique ticket id');

    // 9. Registration duplicate rejection
    const dupRes = await request(
      {
        host: 'localhost',
        port: 3000,
        path: '/api/events/hack-hindusthan-2026/register',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      regPayload
    );
    assert(dupRes.statusCode === 400, 'Duplicate registration attempt is cleanly rejected with HTTP 400');

    // 10. Registration ON/OFF rejection when disabled
    // Turn registration OFF for an event via admin update, then test registration
    const updateRes = await request(
      {
        host: 'localhost',
        port: 3000,
        path: '/api/events/yukti-tech-symposium-2026',
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Cookie: sessionCookie,
        },
      },
      {
        eventData: { registration_enabled: false },
      }
    );
    assert(updateRes.statusCode === 200, 'Admin can toggle registration ON/OFF');

    const closedRegRes = await request(
      {
        host: 'localhost',
        port: 3000,
        path: '/api/events/yukti-tech-symposium-2026/register',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      {
        full_name: 'Closed Tester',
        email: 'closed@test.com',
        register_number: '72079999',
        department: 'ECE',
      }
    );
    assert(closedRegRes.statusCode === 403, 'Submitting registration to event with registration OFF strictly returns HTTP 403 Forbidden');

    // Turn it back ON
    await request(
      {
        host: 'localhost',
        port: 3000,
        path: '/api/events/yukti-tech-symposium-2026',
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Cookie: sessionCookie,
        },
      },
      {
        eventData: { registration_enabled: true },
      }
    );

    // 11. Admin Logout
    const logoutRes = await request(
      {
        host: 'localhost',
        port: 3000,
        path: '/api/auth/logout',
        method: 'POST',
        headers: { Cookie: sessionCookie },
      }
    );
    assert(logoutRes.statusCode === 200, 'Logout returns HTTP 200');

    // 12. Verify dead student endpoints are 404
    const deadProfileRes = await request({ host: 'localhost', port: 3000, path: '/profile', method: 'GET' });
    assert(deadProfileRes.statusCode === 404, 'Dead student profile route /profile returns HTTP 404 Not Found');

    const deadUserRegsRes = await request({ host: 'localhost', port: 3000, path: '/api/user/registrations', method: 'GET' });
    assert(deadUserRegsRes.statusCode === 404, 'Dead student API route /api/user/registrations returns HTTP 404 Not Found');

    const deadSignupRes = await request({ host: 'localhost', port: 3000, path: '/api/auth/register', method: 'POST' });
    assert(deadSignupRes.statusCode === 404, 'Dead student API route /api/auth/register returns HTTP 404 Not Found');

    console.log(`\n=== TEST SUITE COMPLETED: ${passCount} Passed, ${failCount} Failed ===`);
    process.exit(failCount === 0 ? 0 : 1);
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  }
}

runTests();
