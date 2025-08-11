import http from 'http';
import mongoose from 'mongoose';
import app from './app.js';
import { connectDb } from './config/db.js';
import { env } from './config/env.js';

async function bootstrap() {
  try {
    await connectDb();
    const server = http.createServer(app);
    server.listen(env.PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Server running on http://localhost:${env.PORT}`);
    });

    const shutdown = async () => {
      // eslint-disable-next-line no-console
      console.log('Shutting down...');
      await mongoose.connection.close();
      server.close(() => process.exit(0));
    };
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

bootstrap();


