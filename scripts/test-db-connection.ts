import { PrismaClient } from "../app/generated/prisma";
import mysql from "mysql2/promise";

// Test Prisma connection
async function testPrismaConnection() {
  console.log("🔍 Testing Prisma connection...");
  
  try {
    const prisma = new PrismaClient();
    
    // Test basic connection
    await prisma.$connect();
    console.log("✅ Prisma connection successful");
    
    // Test query
    const works = await prisma.works.findMany({
      take: 1
    });
    console.log("✅ Prisma query successful, found", works.length, "works");
    
    await prisma.$disconnect();
    return true;
  } catch (error) {
    console.error("❌ Prisma connection failed:", error);
    return false;
  }
}

// Test MySQL connection
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
    
    // Test query
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM works');
    console.log("✅ MySQL query successful, found", (rows as any)[0].count, "works");
    
    await connection.end();
    return true;
  } catch (error) {
    console.error("❌ MySQL connection failed:", error);
    return false;
  }
}

// Main test function
async function testDatabaseConnections() {
  console.log("🚀 Starting database connection tests...\n");
  
  console.log("Environment variables:");
  console.log("- DATABASE_URL:", process.env.DATABASE_URL ? "✅ Set" : "❌ Missing");
  console.log("- DB_HOST:", process.env.DB_HOST || "❌ Missing");
  console.log("- DB_USER:", process.env.DB_USER || "❌ Missing");
  console.log("- DB_PASS:", process.env.DB_PASS ? "✅ Set" : "❌ Missing");
  console.log("- DB_NAME:", process.env.DB_NAME || "❌ Missing");
  console.log("- NEXT_PUBLIC_BASE_URL:", process.env.NEXT_PUBLIC_BASE_URL || "❌ Missing");
  console.log("- JWT_SECRET:", process.env.JWT_SECRET ? "✅ Set" : "❌ Missing");
  console.log("");
  
  const prismaResult = await testPrismaConnection();
  console.log("");
  const mysqlResult = await testMySQLConnection();
  
  console.log("\n📊 Test Results:");
  console.log("- Prisma:", prismaResult ? "✅ Working" : "❌ Failed");
  console.log("- MySQL:", mysqlResult ? "✅ Working" : "❌ Failed");
  
  if (!prismaResult || !mysqlResult) {
    console.log("\n🔧 Troubleshooting:");
    console.log("1. Create .env file with correct database credentials");
    console.log("2. Ensure database server is running");
    console.log("3. Check if database and tables exist");
    console.log("4. Verify network connectivity to database");
    console.log("5. Run: npx prisma generate");
    console.log("6. Run: npx prisma db push");
  }
}

// Run tests
testDatabaseConnections().catch(console.error);
