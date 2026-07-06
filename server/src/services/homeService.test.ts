import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as authService from './authService';
import * as homeService from './homeService';
import { PantryLocation } from '../models/PantryLocation';
import { ShoppingList } from '../models/ShoppingList';
import { AppError } from '../middlewares/errorHandler';

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

async function createTestUser(email: string) {
  const { user } = await authService.register({ name: 'Test', email, password: 'Min8Chars!' });
  return user;
}

describe('homeService', () => {
  it('creates a home with default locations, shopping list and owner membership', async () => {
    const owner = await createTestUser('owner@example.com');

    const { home, inviteCode } = await homeService.createHome(owner.id, { name: 'My Home' });

    expect(home.role).toBe('owner');
    expect(inviteCode).toHaveLength(8);

    const locations = await PantryLocation.find({ homeId: home.id });
    expect(locations).toHaveLength(3);

    const shoppingLists = await ShoppingList.find({ homeId: home.id });
    expect(shoppingLists).toHaveLength(1);
    expect(shoppingLists[0].isDefault).toBe(true);

    const homes = await homeService.listHomesForUser(owner.id);
    expect(homes).toHaveLength(1);
    expect(homes[0].role).toBe('owner');
  });

  it('lets a second user join with a valid invite code', async () => {
    const owner = await createTestUser('owner2@example.com');
    const member = await createTestUser('member@example.com');

    const { inviteCode, home: createdHome } = await homeService.createHome(owner.id, {
      name: 'Shared Home',
    });

    const joinedHome = await homeService.joinHome(member.id, inviteCode);
    expect(joinedHome.id).toBe(createdHome.id);
    expect(joinedHome.role).toBe('member');

    const memberHomes = await homeService.listHomesForUser(member.id);
    expect(memberHomes).toHaveLength(1);
  });

  it('rejects an invalid invite code', async () => {
    const member = await createTestUser('member2@example.com');

    await expect(homeService.joinHome(member.id, 'INVALIDX')).rejects.toMatchObject({
      code: 'INVALID_INVITE_CODE',
    } satisfies Partial<AppError>);
  });

  it('rejects joining a home the user already belongs to', async () => {
    const owner = await createTestUser('owner3@example.com');
    const { inviteCode } = await homeService.createHome(owner.id, { name: 'Home' });

    await expect(homeService.joinHome(owner.id, inviteCode)).rejects.toMatchObject({
      code: 'ALREADY_MEMBER',
    });
  });
});
