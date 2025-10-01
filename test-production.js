#!/usr/bin/env node

// Production Debug Test
// Usage: node test-production.js <your-production-url>

const PRODUCTION_URL = process.argv[2] || 'https://your-domain.com';

async function testProduction() {
  console.log('🚀 Testing Production Authentication');
  console.log('==================================');
  console.log('Production URL:', PRODUCTION_URL);
  console.log('');

  // Test 1: Basic connectivity
  console.log('1️⃣ Testing basic connectivity...');
  try {
    const response = await fetch(`${PRODUCTION_URL}/api/works`);
    console.log('✅ Production server is accessible');
    console.log('Response status:', response.status);
  } catch (error) {
    console.log('❌ Cannot reach production server:', error.message);
    return;
  }

  // Test 2: Login API
  console.log('\n2️⃣ Testing login API...');
  try {
    const loginResponse = await fetch(`${PRODUCTION_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'admin123'
      })
    });

    console.log('Login status:', loginResponse.status);
    console.log('Response headers:', Object.fromEntries(loginResponse.headers.entries()));

    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Login API works!');
      console.log('Token received:', !!loginData.token);
      console.log('Token length:', loginData.token?.length || 0);

      if (loginData.token) {
        // Test 3: Token verification
        console.log('\n3️⃣ Testing token verification...');
        
        const verifyResponse = await fetch(`${PRODUCTION_URL}/api/auth/verify`, {
          headers: {
            'Authorization': `Bearer ${loginData.token}`
          }
        });

        console.log('Verify status:', verifyResponse.status);

        if (verifyResponse.ok) {
          const verifyData = await verifyResponse.json();
          console.log('✅ Token verification works!');
          console.log('User data:', verifyData.user);
        } else {
          const errorData = await verifyResponse.json();
          console.log('❌ Token verification failed:', errorData);
        }
      }
    } else {
      const errorData = await loginResponse.json();
      console.log('❌ Login failed:', errorData);
    }

  } catch (error) {
    console.log('❌ Login test error:', error.message);
  }

  console.log('\n📋 Debugging Tips:');
  console.log('=================');
  console.log('1. Check your hosting platform\'s environment variables');
  console.log('2. Verify database connectivity from production');
  console.log('3. Check server logs for specific error messages');
  console.log('4. Ensure HTTPS is properly configured');
  console.log('5. Test with browser dev tools to see network requests');
}

if (process.argv[2]) {
  testProduction();
} else {
  console.log('Usage: node test-production.js <production-url>');
  console.log('Example: node test-production.js https://your-app.vercel.app');
}
