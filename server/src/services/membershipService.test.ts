import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as authService from './authService';
import * as homeService from './homeService';
import * as membershipService from './membershipService';
import { Membership } from '../models/Membership';

let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key of Object.keys(collections)) {
    await collections[key].deleteMany({});
  }
});

async function registerUser(name: string) {
  const { user } = await authService.register({
    name,
    email: `${name.toLowerCase()}-${Date.now()}-${Math.random()}@example.com`,
    password: 'Min8Chars!',
  });
  return user;
}

async function setupHomeWithMember() {
  const owner = await registerUser('Owner');
  const { home, inviteCode } = await homeService.createHome(owner.id, { name: 'Test Home' });
  const member = await registerUser('Member');
  await homeService.joinHome(member.id, inviteCode);
  return { ownerId: owner.id, memberId: member.id, homeId: home.id };
}

describe('membershipService', () => {
  it('lists active members with their role', async () => {
    const { ownerId, memberId, homeId } = await setupHomeWithMember();

    const members = await membershipService.listMembers(homeId);

    expect(members).toHaveLength(2);
    const roles = members.map((m) => ({ userId: m.userId, role: m.role }));
    expect(roles).toEqual(
      expect.arrayContaining([
        { userId: ownerId, role: 'owner' },
        { userId: memberId, role: 'member' },
      ]),
    );
  });

  it('removes a non-owner member', async () => {
    const { memberId, homeId } = await setupHomeWithMember();

    await membershipService.removeMember(homeId, memberId);

    const members = await membershipService.listMembers(homeId);
    expect(members.map((m) => m.userId)).not.toContain(memberId);
  });

  it('refuses to remove the owner', async () => {
    const { ownerId, homeId } = await setupHomeWithMember();

    await expect(membershipService.removeMember(homeId, ownerId)).rejects.toMatchObject({
      code: 'CANNOT_REMOVE_OWNER',
    });
  });

  it('throws 404 when removing a member who is not in the home', async () => {
    const { homeId } = await setupHomeWithMember();
    const stranger = await registerUser('Stranger');

    await expect(membershipService.removeMember(homeId, stranger.id)).rejects.toMatchObject({
      code: 'MEMBER_NOT_FOUND',
    });
  });

  it('lets a non-owner member leave the home', async () => {
    const { memberId, homeId } = await setupHomeWithMember();

    await membershipService.leaveHome(homeId, memberId);

    const membership = await Membership.findOne({ homeId, userId: memberId });
    expect(membership?.status).toBe('removed');
  });

  it('blocks the owner from leaving while other members remain', async () => {
    const { ownerId, homeId } = await setupHomeWithMember();

    await expect(membershipService.leaveHome(homeId, ownerId)).rejects.toMatchObject({
      code: 'OWNER_CANNOT_LEAVE',
    });
  });

  it('lets the owner leave when they are the only active member', async () => {
    const owner = await registerUser('SoloOwner');
    const { home } = await homeService.createHome(owner.id, { name: 'Solo Home' });

    await membershipService.leaveHome(home.id, owner.id);

    const membership = await Membership.findOne({ homeId: home.id, userId: owner.id });
    expect(membership?.status).toBe('removed');
  });
});
