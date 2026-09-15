import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDatabase(): Promise<typeof mongoose> {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    if (env.NODE_ENV !== 'production' && !env.MONGODB_URI.includes('127.0.0.1') && !env.MONGODB_URI.includes('localhost')) {
      console.warn('⚠️ Atlas connection failed or timed out. Falling back to local MongoDB on localhost:27017...');
      try {
        const localConn = await mongoose.connect('mongodb://127.0.0.1:27017/codeNest', {
          serverSelectionTimeoutMS: 5000,
        });
        console.log(`✅ Connected to local MongoDB fallback: ${localConn.connection.host}/${localConn.connection.name}`);
        return localConn;
      } catch (localError) {
        console.error('❌ Failed to connect to local MongoDB fallback:', localError);
      }
    }
    console.error('❌ Failed to connect to MongoDB:', error);
    throw error;
  }
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
  console.log('MongoDB connection closed.');
}
