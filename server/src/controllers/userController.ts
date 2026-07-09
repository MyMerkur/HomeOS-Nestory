import type { Request, Response } from 'express';
import * as userService from '../services/userService';
import { registerPushToken, removePushToken } from '../services/pushService';
import { sendSuccess } from '../utils/apiResponse';
import type {
  ChangePasswordInput,
  DeleteAccountInput,
  UpdateProfileInput,
  UpdateUserSettingsInput,
} from '../validations/userValidation';
import type { RegisterPushTokenInput } from '../validations/pushValidation';

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

export async function deleteAccountHandler(req: Request, res: Response) {
  const { password } = req.body as DeleteAccountInput;
  await userService.deleteAccount(req.userId!, password);
  sendSuccess(res, null, 'Account deleted successfully');
}

export async function updateSettingsHandler(req: Request, res: Response) {
  const profile = await userService.updateSettings(req.userId!, req.body as UpdateUserSettingsInput);
  sendSuccess(res, { user: profile }, 'Settings updated successfully');
}

export async function registerPushTokenHandler(req: Request, res: Response) {
  const { token, platform } = req.body as RegisterPushTokenInput;
  await registerPushToken(req.userId!, token, platform);
  sendSuccess(res, null, 'Push token registered successfully', 201);
}

export async function removePushTokenHandler(req: Request, res: Response) {
  await removePushToken(req.userId!, req.params.token);
  sendSuccess(res, null, 'Push token removed successfully');
}
