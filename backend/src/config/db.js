import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDb() {
  mongoose.set('strictQuery', true);
  await mongoose.connect(env.MONGO_URI, {
    autoIndex: true
  });
  // eslint-disable-next-line no-console
  console.log('MongoDB connected');
}


