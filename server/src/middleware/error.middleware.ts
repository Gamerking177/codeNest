import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env.js';

export class AppError extends Error {
  statusCode: number;
  code: string;

  constructor(message: string, statusCode: number = 500, code: string = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `The requested resource '${req.originalUrl}' was not found`,
    },
  });
}

export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void {
  const isAppError = err instanceof AppError;
  const statusCode = isAppError ? err.statusCode : 500;
  const code = isAppError ? err.code : 'INTERNAL_SERVER_ERROR';

  if (env.NODE_ENV !== 'production') {
    console.error(`[Error] ${req.method} ${req.url}:`, err);
  }

  const message =
    isAppError || env.NODE_ENV !== 'production'
      ? err.message
      : 'An unexpected internal server error occurred. Please try again later.';

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
    },
  });
}
