#!/usr/bin/env node

// Test the auth flow step by step
async function testAuthFlow() {
  console.log('🧪 Testing Authentication Flow');
  console.log('===============================\n');
  
  // Step 1: Login
  console.log('1️⃣ Testing login...');
  try {
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
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
    
    if (!loginResponse.ok) {
      const errorData = await loginResponse.json();
      console.log('❌ Login failed:', errorData);
      return;
    }
    
    const loginData = await loginResponse.json();
    console.log('✅ Login successful!');
    console.log('Token received:', !!loginData.token);
    
    if (!loginData.token) {
      console.log('❌ No token in response');
      return;
    }
    
    // Step 2: Verify token
    console.log('\n2️⃣ Testing token verification...');
    
    const verifyResponse = await fetch('http://localhost:3000/api/auth/verify', {
      headers: {
        'Authorization': `Bearer ${loginData.token}`
      }
    });
    
    console.log('Verify status:', verifyResponse.status);
    
    if (verifyResponse.ok) {
      const verifyData = await verifyResponse.json();
      console.log('✅ Token verification successful!');
      console.log('User data:', verifyData.user);
    } else {
      const errorData = await verifyResponse.json();
      console.log('❌ Token verification failed:', errorData);
    }
    
    // Step 3: Test works API (should work without auth)
    console.log('\n3️⃣ Testing works API...');
    
    const worksResponse = await fetch('http://localhost:3000/api/works');
    console.log('Works API status:', worksResponse.status);
    
    if (worksResponse.ok) {
      const worksData = await worksResponse.json();
      console.log('✅ Works API accessible!');
      console.log('Works count:', worksData.length);
    } else {
      console.log('❌ Works API failed');
    }
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
  
  console.log('\n🎯 Summary:');
  console.log('If all tests pass, the login issue should be fixed!');
}

testAuthFlow();
