import type { Request, Response } from 'express';
import * as membershipService from '../services/membershipService';
import { sendSuccess } from '../utils/apiResponse';

export async function listMembersHandler(req: Request, res: Response) {
  const { homeId } = req.params;
  const members = await membershipService.listMembers(homeId);
  sendSuccess(res, { members }, 'Members fetched successfully');
}

export async function removeMemberHandler(req: Request, res: Response) {
  const { homeId, userId } = req.params;
  await membershipService.removeMember(homeId, userId);
  sendSuccess(res, null, 'Member removed successfully');
}

export async function leaveHomeHandler(req: Request, res: Response) {
  const { homeId } = req.params;
  await membershipService.leaveHome(homeId, req.userId!);
  sendSuccess(res, null, 'Left home successfully');
}
