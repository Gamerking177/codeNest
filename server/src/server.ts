import { createApp } from './app.js';
import { connectDatabase, disconnectDatabase } from './config/db.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';

async function bootstrap() {
  try {
    await connectDatabase();

    const app = createApp();

    const server = app.listen(env.PORT, () => {
      logger.info(`🚀 CodeNest Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
      logger.info(`📡 Health endpoint: http://localhost:${env.PORT}/health`);
      logger.info(`📡 API endpoint: http://localhost:${env.PORT}/api/v1`);
    });

    const shutdown = async (signal: string) => {
      logger.info(`Received ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        await disconnectDatabase();
        logger.info('Server and database connections successfully terminated.');
        process.exit(0);
      });

      // Force shutdown after 10s if hanging
      setTimeout(() => {
        logger.error('Forced shutdown due to timeout.');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (error) {
    logger.error({ err: error }, 'Fatal error during application startup');
    process.exit(1);
  }
}

bootstrap();
