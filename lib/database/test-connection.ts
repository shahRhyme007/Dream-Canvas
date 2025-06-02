import { connectToDatabase } from './mongoose';

export async function testDatabaseConnection() {
  try {
    console.log('Testing database connection...');
    const connection = await connectToDatabase();
    console.log('✅ Database connected successfully!');
    console.log('Connection state:', connection.connection.readyState);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

// Run this test
if (require.main === module) {
  testDatabaseConnection();
} 