import type { Request, Response } from 'express';
import * as userService from '../services/userService';
import { sendSuccess } from '../utils/apiResponse';
import type {
  ChangePasswordInput,
  UpdateProfileInput,
  UpdateUserSettingsInput,
} from '../validations/userValidation';

export async function getProfileHandler(req: Request, res: Response) {
  const profile = await userService.getProfile(req.userId!);
  sendSuccess(res, { user: profile }, 'Profile fetched successfully');
}

export async function updateProfileHandler(req: Request, res: Response) {
  const profile = await userService.updateProfile(req.userId!, req.body as UpdateProfileInput);
  sendSuccess(res, { user: profile }, 'Profile updated successfully');
}

export async function changePasswordHandler(req: Request, res: Response) {
  await userService.changePassword(req.userId!, req.body as ChangePasswordInput);
  sendSuccess(res, null, 'Password changed successfully');
}

export async function updateSettingsHandler(req: Request, res: Response) {
  const profile = await userService.updateSettings(req.userId!, req.body as UpdateUserSettingsInput);
  sendSuccess(res, { user: profile }, 'Settings updated successfully');
}
