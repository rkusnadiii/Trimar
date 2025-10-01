import { PrismaClient } from "../app/generated/prisma";

// Test current Prisma client
async function testCurrentPrisma() {
  console.log("🔍 Testing current Prisma client...");
  
  try {
    const prisma = new PrismaClient();
    
    // Check available models
    console.log("Available models in Prisma client:");
    console.log("- prisma.works:", typeof (prisma as any).works);
    console.log("- prisma.work_gallery:", typeof (prisma as any).work_gallery);
    
    // Test query with new model name
    try {
      const works = await (prisma as any).works.findMany({ take: 1 });
      console.log("✅ prisma.works.findMany() works, found", works.length, "records");
    } catch (error) {
      console.log("❌ prisma.works.findMany() failed:", error instanceof Error ? error.message : String(error));
    }
    
    await prisma.$disconnect();
  } catch (error) {
    console.error("❌ Prisma test failed:", error);
  }
}

// Test database connection
async function testDatabaseConnection() {
  console.log("🔍 Testing database connection...");
  
  try {
    const prisma = new PrismaClient();
    await prisma.$connect();
    console.log("✅ Database connection successful");
    
    // Test if tables exist
    try {
      const result = await prisma.$queryRaw`SHOW TABLES`;
      console.log("✅ Tables found:", result);
    } catch (error) {
      console.log("❌ Cannot query tables:", error instanceof Error ? error.message : String(error));
    }
    
    await prisma.$disconnect();
  } catch (error) {
    console.error("❌ Database connection failed:", error instanceof Error ? error.message : String(error));
  }
}

// Main function
async function main() {
  console.log("🚀 Prisma Client Analysis\n");
  
  await testCurrentPrisma();
  console.log("");
  await testDatabaseConnection();
  
  console.log("\n📋 Recommendations:");
  console.log("1. If prisma.work works but prisma.works doesn't:");
  console.log("   - Update API routes to use prisma.work instead of prisma.works");
  console.log("   - Or regenerate Prisma client with correct schema");
  console.log("");
  console.log("2. If both fail:");
  console.log("   - Check DATABASE_URL in .env file");
  console.log("   - Ensure database server is running");
  console.log("   - Run: npx prisma generate");
  console.log("   - Run: npx prisma db push");
  console.log("");
  console.log("3. If tables don't exist:");
  console.log("   - Create tables manually in database");
  console.log("   - Or run: npx prisma db push");
}

main().catch(console.error);
