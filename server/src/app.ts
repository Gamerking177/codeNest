import express, { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import routes from './routes/index.js';
import { apiRateLimiter } from './middleware/security.middleware.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';

export function createApp(): Express {
  const app = express();

  // Basic security headers
  app.use(
    helmet({
      contentSecurityPolicy: env.NODE_ENV === 'production' ? undefined : false,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );

  // CORS configuration
  app.use(
    cors({
      origin: [env.CORS_ORIGIN, 'http://localhost:5173', 'http://127.0.0.1:5173'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    })
  );

  // Cookie and body parsers
  app.use(cookieParser(env.COOKIE_SECRET));
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true, limit: '2mb' }));

  // General rate limiting
  app.use('/api', apiRateLimiter);

  // Request logger in dev
  if (env.NODE_ENV !== 'production') {
    app.use((req, res, next) => {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
      next();
    });
  }

  // API Version 1
  app.use('/api/v1', routes);

  // Root welcome
  app.get('/', (req, res) => {
    res.json({
      message: 'CodeNest API is running smoothly.',
      version: '1.0.0',
      docs: '/api/v1/health',
    });
  });

  // 404 and Error handling
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
