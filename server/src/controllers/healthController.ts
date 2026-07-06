import type { Request, Response } from 'express';
import { getHealthStatus } from '../services/healthService';
import { sendSuccess } from '../utils/apiResponse';

export function getHealth(_req: Request, res: Response) {
  sendSuccess(res, getHealthStatus(), 'Service is healthy');
}
