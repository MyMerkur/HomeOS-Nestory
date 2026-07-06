import type { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '../utils/tokens';
import { AppError } from './errorHandler';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    throw new AppError('Authentication required', 401, 'UNAUTHENTICATED');
  }

  const token = header.slice('Bearer '.length);

  try {
    const payload = verifyAccessToken(token);
    req.userId = payload.sub;
    next();
  } catch {
    throw new AppError('Invalid or expired access token', 401, 'INVALID_TOKEN');
  }
}
