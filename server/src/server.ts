import { createApp } from './app.js';
import { connectDatabase, disconnectDatabase } from './config/db.js';
import { env } from './config/env.js';

async function bootstrap() {
  try {
    await connectDatabase();

    const app = createApp();

    const server = app.listen(env.PORT, () => {
      console.log(`🚀 CodeNest Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
      console.log(`📡 Health endpoint: http://localhost:${env.PORT}/api/v1/health`);
    });

    const shutdown = async (signal: string) => {
      console.log(`\nReceived ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        await disconnectDatabase();
        console.log('Server and database connections successfully terminated.');
        process.exit(0);
      });

      // Force shutdown after 10s if hanging
      setTimeout(() => {
        console.error('Forced shutdown due to timeout.');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (error) {
    console.error('Fatal error during application startup:', error);
    process.exit(1);
  }
}

bootstrap();
