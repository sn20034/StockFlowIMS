import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let memoryServer = null;

export const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  try {
    if (uri && !uri.includes('localhost')) {
      const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return;
    }
    throw new Error('no uri');
  } catch (err) {
    console.log(`Atlas unavailable (${err.message ? err.message.slice(0, 60) : 'unknown'}). Falling back to in-memory MongoDB...`);
    memoryServer = await MongoMemoryServer.create();
    const memUri = memoryServer.getUri();
    const conn = await mongoose.connect(memUri);
    console.log(`In-memory MongoDB Connected: ${conn.connection.host}`);
    console.log('NOTE: Data will be lost on restart. Seed with: npm run seed');
  }
};

export const stopDB = async () => {
  if (memoryServer) await memoryServer.stop();
};
