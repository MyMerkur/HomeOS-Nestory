import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import ms from 'ms';
import { env } from '../config/env';

export type AccessTokenPayload = {
  sub: string;
};

export function signAccessToken(userId: string): string {
  const expiresInSeconds = Math.floor(ms(env.ACCESS_TOKEN_EXPIRES_IN) / 1000);
  return jwt.sign({ sub: userId } satisfies AccessTokenPayload, env.JWT_ACCESS_SECRET, {
    expiresIn: expiresInSeconds,
  });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;
}

export function generateRefreshToken(): { token: string; tokenHash: string; expiresAt: Date } {
  const token = crypto.randomBytes(40).toString('hex');
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + ms(env.REFRESH_TOKEN_EXPIRES_IN));
  return { token, tokenHash, expiresAt };
}

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

const INVITE_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 0/O, 1/I hariç
const INVITE_CODE_LENGTH = 8;

export function generateInviteCode(): { code: string; codeHash: string } {
  const bytes = crypto.randomBytes(INVITE_CODE_LENGTH);
  let code = '';
  for (let i = 0; i < INVITE_CODE_LENGTH; i += 1) {
    code += INVITE_CODE_ALPHABET[bytes[i] % INVITE_CODE_ALPHABET.length];
  }
  return { code, codeHash: hashToken(code) };
}
