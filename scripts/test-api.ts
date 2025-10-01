// Test script for Works API
// Run with: npx tsx scripts/test-api.ts

const BASE_URL = 'http://localhost:3000';

async function testAPI() {
  console.log('Testing Works API...\n');

  try {
    // Test GET /api/works
    console.log('1. Testing GET /api/works');
    const worksResponse = await fetch(`${BASE_URL}/api/works`);
    const works = await worksResponse.json();
    console.log(`✅ Found ${works.length} works`);
    
    if (works.length > 0) {
      const firstWork = works[0];
      console.log(`   First work: ${firstWork.name} (${firstWork.slug})`);
      
      // Test GET /api/works/[slug]
      console.log('\n2. Testing GET /api/works/[slug]');
      const workResponse = await fetch(`${BASE_URL}/api/works/${firstWork.slug}`);
      const work = await workResponse.json();
      console.log(`✅ Retrieved work: ${work.name}`);
      console.log(`   Description length: ${work.description.length} characters`);
      console.log(`   Gallery images: ${work.gallery.length}`);
    }

    // Test POST /api/works (create a test work)
    console.log('\n3. Testing POST /api/works');
    const testWork = {
      slug: 'test-work-' + Date.now(),
      name: 'Test Work',
      description: 'This is a test work created by the API test script.',
      gallery: ['/images/test1.jpg', '/images/test2.jpg'],
      year: '2024',
      logo: '/images/test-logo.png',
      img: '/images/test-banner.jpg',
      thumbnail_url: '/images/test-banner.jpg',
      logo_url: '/images/test-logo.png'
    };

    const createResponse = await fetch(`${BASE_URL}/api/works`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testWork),
    });

    if (createResponse.ok) {
      const createdWork = await createResponse.json();
      console.log(`✅ Created test work: ${createdWork.work.name}`);
      
      // Test DELETE /api/works/[slug]
      console.log('\n4. Testing DELETE /api/works/[slug]');
      const deleteResponse = await fetch(`${BASE_URL}/api/works/${testWork.slug}`, {
        method: 'DELETE',
      });
      
      if (deleteResponse.ok) {
        console.log(`✅ Deleted test work: ${testWork.slug}`);
      } else {
        console.log(`❌ Failed to delete test work`);
      }
    } else {
      console.log(`❌ Failed to create test work: ${createResponse.status}`);
    }

  } catch (error) {
    console.error('❌ API test failed:', error instanceof Error ? error.message : 'Unknown error');
  }
}

// Run the test
testAPI();
