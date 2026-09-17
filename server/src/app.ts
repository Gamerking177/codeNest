import express, { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import routes from './routes/index.js';
import healthRoutes from './routes/health.routes.js';
import { requestIdMiddleware } from './middleware/requestId.middleware.js';
import { httpLoggingMiddleware } from './middleware/logging.middleware.js';
import { apiRateLimiter } from './middleware/security.middleware.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';

export function createApp(): Express {
  const app = express();

  // 1. Request ID (Correlation ID) must be attached first
  app.use(requestIdMiddleware);

  // 2. HTTP Request Logger (Pino structured logger)
  app.use(httpLoggingMiddleware);

  // 3. Security headers (Helmet)
  app.use(
    helmet({
      contentSecurityPolicy: env.NODE_ENV === 'production' ? undefined : false,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );

  // 4. Strict Multi-Origin CORS Whitelist
  const allowedOrigins = env.CORS_ORIGIN
    .split(',')
    .map((o) => o.trim().replace(/\/$/, ''))
    .filter(Boolean);

  const localDevOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
  ];

  app.use(
    cors({
      origin: (requestOrigin, callback) => {
        // Allow requests with no origin (server-to-server, curl, health probes)
        if (!requestOrigin) return callback(null, true);

        const normalizedOrigin = requestOrigin.replace(/\/$/, '');

        // In development / test, allow standard local dev origins
        if (env.NODE_ENV !== 'production' && localDevOrigins.includes(normalizedOrigin)) {
          return callback(null, true);
        }

        // In production, strictly match explicitly configured whitelist
        if (allowedOrigins.includes(normalizedOrigin)) {
          return callback(null, true);
        }

        // Disallow untrusted origins (browser will block cross-origin access)
        return callback(null, false);
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Request-ID'],
      exposedHeaders: ['X-Request-ID'],
    })
  );

  // 5. Cookie and body parsers
  app.use(cookieParser(env.COOKIE_SECRET));
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true, limit: '2mb' }));

  // 6. Direct Root Health Endpoints (Used by Docker, Kubernetes, Load Balancers)
  app.use('/health', healthRoutes);

  // 7. General rate limiting on API
  app.use('/api', apiRateLimiter);

  // 8. API Version 1
  app.use('/api/v1', routes);

  // Root welcome
  app.get('/', (req, res) => {
    res.json({
      message: 'CodeNest API is running smoothly.',
      version: '1.0.0',
      requestId: req.id,
      health: '/health',
      docs: '/api/v1/health',
    });
  });

  // 9. 404 and Error handling
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
