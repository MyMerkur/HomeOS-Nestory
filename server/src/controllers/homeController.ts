import type { Request, Response } from 'express';
import * as homeService from '../services/homeService';
import { sendSuccess } from '../utils/apiResponse';
import type { CreateHomeInput, JoinHomeInput } from '../validations/homeValidation';

export async function createHomeHandler(req: Request, res: Response) {
  const result = await homeService.createHome(req.userId!, req.body as CreateHomeInput);
  sendSuccess(res, result, 'Home created successfully', 201);
}

export async function listHomesHandler(req: Request, res: Response) {
  const homes = await homeService.listHomesForUser(req.userId!);
  sendSuccess(res, { homes }, 'Homes fetched successfully');
}

export async function joinHomeHandler(req: Request, res: Response) {
  const { inviteCode } = req.body as JoinHomeInput;
  const home = await homeService.joinHome(req.userId!, inviteCode);
  sendSuccess(res, { home }, 'Joined home successfully');
}
