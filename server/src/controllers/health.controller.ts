import { Request, Response } from 'express';
import mongoose from 'mongoose';

export class HealthController {
  /**
   * General health status with basic system metrics
   */
  static getHealth(req: Request, res: Response): void {
    const isDbConnected = mongoose.connection.readyState === 1;

    res.status(isDbConnected ? 200 : 503).json({
      success: isDbConnected,
      data: {
        status: isDbConnected ? 'healthy' : 'degraded',
        uptimeSeconds: Math.floor(process.uptime()),
        timestamp: new Date().toISOString(),
        service: 'codenest-api',
        database: isDbConnected ? 'connected' : 'disconnected',
        requestId: req.id,
      },
    });
  }

  /**
   * Liveness probe: returns 200 if the process is responsive.
   * Does NOT depend on external systems like MongoDB.
   */
  static getLive(req: Request, res: Response): void {
    res.status(200).json({
      status: 'live',
      timestamp: new Date().toISOString(),
      requestId: req.id,
    });
  }

  /**
   * Readiness probe: returns 200 if application and all dependencies (e.g. MongoDB) are ready.
   * Returns 503 Service Unavailable if database is not connected.
   */
  static getReady(req: Request, res: Response): void {
    const isDbConnected = mongoose.connection.readyState === 1;

    if (!isDbConnected) {
      res.status(503).json({
        status: 'not_ready',
        reason: 'Database connection is not ready',
        timestamp: new Date().toISOString(),
        requestId: req.id,
      });
      return;
    }

    res.status(200).json({
      status: 'ready',
      database: 'connected',
      timestamp: new Date().toISOString(),
      requestId: req.id,
    });
  }
}
