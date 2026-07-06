import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { logger } from '../config/logger';
import { sendError } from '../utils/apiResponse';

export class AppError extends Error {
  status: number;
  code: string;

  constructor(message: string, status = 400, code = 'APP_ERROR') {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export function notFoundHandler(req: Request, res: Response) {
  sendError(res, `Route not found: ${req.method} ${req.originalUrl}`, 404, 'NOT_FOUND');
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    return sendError(res, 'Validation failed', 422, 'VALIDATION_ERROR', err.issues);
  }

  if (err instanceof AppError) {
    return sendError(res, err.message, err.status, err.code);
  }

  logger.error({ err }, 'Unhandled error');
  return sendError(res, 'Internal server error', 500, 'INTERNAL_ERROR');
}
