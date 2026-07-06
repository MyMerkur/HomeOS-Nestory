import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { RefreshToken } from '../models/RefreshToken';
import { AppError } from '../middlewares/errorHandler';
import { generateRefreshToken, hashToken, signAccessToken } from '../utils/tokens';
import type { LoginInput, RegisterInput } from '../validations/authValidation';

const SALT_ROUNDS = 10;

type SessionResult = {
  user: { id: string; name: string; email: string };
  accessToken: string;
  refreshToken: string;
};

async function issueSession(userId: string, name: string, email: string): Promise<SessionResult> {
  const accessToken = signAccessToken(userId);
  const { token, tokenHash, expiresAt } = generateRefreshToken();

  await RefreshToken.create({ userId, tokenHash, expiresAt });

  return {
    user: { id: userId, name, email },
    accessToken,
    refreshToken: token,
  };
}

export async function register(input: RegisterInput): Promise<SessionResult> {
  const existing = await User.findOne({ email: input.email });
  if (existing) {
    throw new AppError('Email already in use', 409, 'EMAIL_IN_USE');
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
  const user = await User.create({ name: input.name, email: input.email, passwordHash });

  return issueSession(user._id.toString(), user.name, user.email);
}

export async function login(input: LoginInput): Promise<SessionResult> {
  const user = await User.findOne({ email: input.email });
  if (!user) {
    throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  const isValid = await bcrypt.compare(input.password, user.passwordHash);
  if (!isValid) {
    throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  return issueSession(user._id.toString(), user.name, user.email);
}

export async function refresh(refreshTokenValue: string): Promise<SessionResult> {
  const tokenHash = hashToken(refreshTokenValue);
  const existing = await RefreshToken.findOne({ tokenHash });

  if (!existing || existing.revokedAt || existing.expiresAt < new Date()) {
    throw new AppError('Invalid or expired refresh token', 401, 'INVALID_REFRESH_TOKEN');
  }

  existing.revokedAt = new Date();
  await existing.save();

  const user = await User.findById(existing.userId);
  if (!user) {
    throw new AppError('Invalid or expired refresh token', 401, 'INVALID_REFRESH_TOKEN');
  }

  return issueSession(user._id.toString(), user.name, user.email);
}

export async function logout(refreshTokenValue: string): Promise<void> {
  const tokenHash = hashToken(refreshTokenValue);
  await RefreshToken.updateOne({ tokenHash, revokedAt: null }, { revokedAt: new Date() });
}
