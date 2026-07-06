import type { Request, Response } from 'express';
import * as dashboardService from '../services/dashboardService';
import { sendSuccess } from '../utils/apiResponse';

export async function getDashboardHandler(req: Request, res: Response) {
  const dashboard = await dashboardService.getDashboard(req.params.homeId);
  sendSuccess(res, { dashboard }, 'Dashboard fetched successfully');
}
