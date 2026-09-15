import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';

export function httpLoggingMiddleware(req: Request, res: Response, next: NextFunction): void {
  const startTime = process.hrtime.bigint();

  // Log on response completion
  res.on('finish', () => {
    const endTime = process.hrtime.bigint();
    const durationMs = Number((endTime - startTime) / 1000000n);

    const logData = {
      requestId: req.id,
      method: req.method,
      url: req.originalUrl || req.url,
      statusCode: res.statusCode,
      durationMs: `${durationMs}ms`,
      userId: req.user?.id,
    };

    if (res.statusCode >= 500) {
      logger.error(logData, `${req.method} ${logData.url} ${res.statusCode} in ${durationMs}ms`);
    } else if (res.statusCode >= 400) {
      logger.warn(logData, `${req.method} ${logData.url} ${res.statusCode} in ${durationMs}ms`);
    } else {
      logger.info(logData, `${req.method} ${logData.url} ${res.statusCode} in ${durationMs}ms`);
    }
  });

  next();
}
