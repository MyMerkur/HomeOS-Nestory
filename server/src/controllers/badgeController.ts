import type { Request, Response } from 'express';
import * as badgeService from '../services/badgeService';
import { sendSuccess } from '../utils/apiResponse';

export async function getBadgesHandler(req: Request, res: Response) {
  const badges = await badgeService.getBadges(req.params.homeId);
  sendSuccess(res, { badges }, 'Badges fetched successfully');
}
