import type { NextFunction, Request, Response } from 'express';
import { Membership } from '../models/Membership';
import { AppError } from './errorHandler';
import { catchAsync } from '../utils/catchAsync';

export type MembershipRole = 'owner' | 'admin' | 'member' | 'viewer';

const ROLE_RANK: Record<MembershipRole, number> = {
  viewer: 0,
  member: 1,
  admin: 2,
  owner: 3,
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      membership?: {
        id: string;
        homeId: string;
        role: MembershipRole;
      };
    }
  }
}

export function requireHomeMembership(minRole?: MembershipRole) {
  return catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
    const { homeId } = req.params;

    const membership = await Membership.findOne({ homeId, userId: req.userId });

    if (!membership || membership.status !== 'active') {
      throw new AppError('You are not a member of this home', 403, 'NOT_A_MEMBER');
    }

    if (minRole && ROLE_RANK[membership.role as MembershipRole] < ROLE_RANK[minRole]) {
      throw new AppError('Insufficient role for this action', 403, 'INSUFFICIENT_ROLE');
    }

    req.membership = {
      id: membership._id.toString(),
      homeId: membership.homeId.toString(),
      role: membership.role as MembershipRole,
    };

    next();
  });
}
