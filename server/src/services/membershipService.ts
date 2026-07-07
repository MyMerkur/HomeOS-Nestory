import { Membership } from '../models/Membership';
import { AppError } from '../middlewares/errorHandler';

type MemberSummary = {
  membershipId: string;
  userId: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  joinedAt: Date;
};

export async function listMembers(homeId: string): Promise<MemberSummary[]> {
  const memberships = await Membership.find({ homeId, status: 'active' }).populate<{
    userId: { _id: string; name: string; email: string; avatarUrl?: string };
  }>('userId', 'name email avatarUrl');

  return memberships
    .filter((membership) => membership.userId)
    .map((membership) => ({
      membershipId: membership._id.toString(),
      userId: membership.userId._id.toString(),
      name: membership.userId.name,
      email: membership.userId.email,
      avatarUrl: membership.userId.avatarUrl ?? null,
      role: membership.role as MemberSummary['role'],
      joinedAt: membership.joinedAt as Date,
    }));
}

export async function removeMember(homeId: string, targetUserId: string): Promise<void> {
  const target = await Membership.findOne({ homeId, userId: targetUserId, status: 'active' });

  if (!target) {
    throw new AppError('Member not found', 404, 'MEMBER_NOT_FOUND');
  }

  if (target.role === 'owner') {
    throw new AppError('The home owner cannot be removed', 400, 'CANNOT_REMOVE_OWNER');
  }

  target.status = 'removed';
  await target.save();
}

export async function leaveHome(homeId: string, userId: string): Promise<void> {
  const membership = await Membership.findOne({ homeId, userId, status: 'active' });

  if (!membership) {
    throw new AppError('You are not a member of this home', 403, 'NOT_A_MEMBER');
  }

  if (membership.role === 'owner') {
    const otherActiveMembers = await Membership.countDocuments({
      homeId,
      status: 'active',
      userId: { $ne: userId },
    });

    if (otherActiveMembers > 0) {
      throw new AppError(
        'The owner cannot leave while other members remain in the home',
        400,
        'OWNER_CANNOT_LEAVE',
      );
    }
  }

  membership.status = 'removed';
  await membership.save();
}
