import type { Request, Response } from 'express';
import * as authService from '../services/authService';
import { sendSuccess } from '../utils/apiResponse';
import type { LoginInput, RefreshInput, RegisterInput } from '../validations/authValidation';

export async function registerHandler(req: Request, res: Response) {
  const result = await authService.register(req.body as RegisterInput);
  sendSuccess(res, result, 'Registered successfully', 201);
}

export async function loginHandler(req: Request, res: Response) {
  const result = await authService.login(req.body as LoginInput);
  sendSuccess(res, result, 'Logged in successfully');
}

export async function refreshHandler(req: Request, res: Response) {
  const { refreshToken } = req.body as RefreshInput;
  const result = await authService.refresh(refreshToken);
  sendSuccess(res, result, 'Token refreshed');
}

export async function logoutHandler(req: Request, res: Response) {
  const { refreshToken } = req.body as RefreshInput;
  await authService.logout(refreshToken);
  sendSuccess(res, null, 'Logged out successfully');
}
