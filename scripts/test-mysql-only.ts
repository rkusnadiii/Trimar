import mysql from "mysql2/promise";

// Test MySQL connection tanpa Prisma
async function testMySQLConnection() {
  console.log("🔍 Testing MySQL connection...");
  
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'trimar',
    });
    
    console.log("✅ MySQL connection successful");
    
    // Test query works table
    try {
      const [works] = await connection.execute('SELECT COUNT(*) as count FROM works');
      console.log("✅ works table found, records:", (works as any)[0].count);
    } catch (error) {
      console.log("❌ works table not found:", error instanceof Error ? error.message : String(error));
    }
    
    // Test query work_gallery table
    try {
      const [gallery] = await connection.execute('SELECT COUNT(*) as count FROM work_gallery');
      console.log("✅ work_gallery table found, records:", (gallery as any)[0].count);
    } catch (error) {
      console.log("❌ work_gallery table not found:", error instanceof Error ? error.message : String(error));
    }
    
    // Test sample data
    try {
      const [sample] = await connection.execute('SELECT id, slug, name FROM works LIMIT 3');
      console.log("✅ Sample data:", sample as any);
    } catch (error) {
      console.log("❌ Cannot fetch sample data:", error instanceof Error ? error.message : String(error));
    }
    
    await connection.end();
    return true;
  } catch (error) {
    console.error("❌ MySQL connection failed:", error instanceof Error ? error.message : String(error));
    return false;
  }
}

// Test environment variables
function testEnvironmentVariables() {
  console.log("🔍 Testing environment variables...");
  
  const required = ['DB_HOST', 'DB_USER', 'DB_PASS', 'DB_NAME'];
  const optional = ['DATABASE_URL', 'NEXT_PUBLIC_BASE_URL', 'JWT_SECRET'];
  
  console.log("\nRequired variables:");
  required.forEach(key => {
    const value = process.env[key];
    console.log(`- ${key}:`, value ? "✅ Set" : "❌ Missing");
  });
  
  console.log("\nOptional variables:");
  optional.forEach(key => {
    const value = process.env[key];
    console.log(`- ${key}:`, value ? "✅ Set" : "⚠️  Not set");
  });
}

// Main function
async function main() {
  console.log("🚀 Database Connection Test (MySQL Only)\n");
  
  testEnvironmentVariables();
  console.log("");
  
  const result = await testMySQLConnection();
  
  console.log("\n📊 Test Results:");
  console.log("- MySQL Connection:", result ? "✅ Working" : "❌ Failed");
  
  if (!result) {
    console.log("\n🔧 Troubleshooting:");
    console.log("1. Check .env file exists and has correct credentials");
    console.log("2. Ensure database server is running");
    console.log("3. Verify database name exists");
    console.log("4. Check if works and work_gallery tables exist");
    console.log("5. Test connection from hosting panel");
  } else {
    console.log("\n✅ Database is ready!");
    console.log("You can now run the application without Prisma generate.");
  }
}

main().catch(console.error);
