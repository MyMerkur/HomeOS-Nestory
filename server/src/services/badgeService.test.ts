import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as authService from './authService';
import * as homeService from './homeService';
import * as locationService from './locationService';
import * as inventoryService from './inventoryService';
import * as inventoryActionService from './inventoryActionService';
import * as shoppingService from './shoppingService';
import * as badgeService from './badgeService';

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

async function setupHome() {
  const { user } = await authService.register({
    name: 'Owner',
    email: `owner-${Date.now()}-${Math.random()}@example.com`,
    password: 'Min8Chars!',
  });
  const { home } = await homeService.createHome(user.id, { name: 'Test Home' });
  const locations = await locationService.listLocations(home.id);
  const fridge = locations.find((l) => l.type === 'fridge')!;
  return { userId: user.id, homeId: home.id, fridgeId: fridge.id };
}

function findBadge(badges: Awaited<ReturnType<typeof badgeService.getBadges>>, id: string) {
  return badges.find((badge) => badge.id === id)!;
}

describe('badgeService', () => {
  it('marks first-item and regular-tracker unearned with zero items', async () => {
    const { homeId } = await setupHome();

    const badges = await badgeService.getBadges(homeId);

    expect(findBadge(badges, 'first-item').earned).toBe(false);
    expect(findBadge(badges, 'regular-tracker').progress).toBe(0);
  });

  it('earns first-item after one item and regular-tracker after ten', async () => {
    const { homeId, userId, fridgeId } = await setupHome();

    for (let i = 0; i < 10; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await inventoryService.createItem(homeId, userId, {
        name: `Item ${i}`,
        locationId: fridgeId,
        category: 'Other',
        quantity: 1,
        unit: 'piece',
      });
    }

    const badges = await badgeService.getBadges(homeId);

    expect(findBadge(badges, 'first-item').earned).toBe(true);
    expect(findBadge(badges, 'regular-tracker').earned).toBe(true);
    expect(findBadge(badges, 'regular-tracker').progress).toBe(10);
  });

  it('counts only items consumed before their expiry date for waste-preventer', async () => {
    const { homeId, userId, fridgeId } = await setupHome();

    const future = new Date();
    future.setDate(future.getDate() + 5);
    const past = new Date();
    past.setDate(past.getDate() - 5);

    const freshItem = await inventoryService.createItem(homeId, userId, {
      name: 'Fresh',
      locationId: fridgeId,
      category: 'Dairy',
      quantity: 1,
      unit: 'piece',
      expiryDate: future,
    });
    const staleItem = await inventoryService.createItem(homeId, userId, {
      name: 'Stale',
      locationId: fridgeId,
      category: 'Dairy',
      quantity: 1,
      unit: 'piece',
      expiryDate: past,
    });

    await inventoryActionService.consumeItem(homeId, userId, freshItem.id);
    await inventoryActionService.consumeItem(homeId, userId, staleItem.id);

    const badges = await badgeService.getBadges(homeId);

    expect(findBadge(badges, 'waste-preventer').progress).toBe(1);
  });

  it('counts checked shopping items for list-master', async () => {
    const { homeId, userId } = await setupHome();

    const item = await shoppingService.addShoppingItem(homeId, userId, { name: 'Milk' });
    await shoppingService.toggleCheck(homeId, item.id);

    const badges = await badgeService.getBadges(homeId);

    expect(findBadge(badges, 'list-master').progress).toBe(1);
    expect(findBadge(badges, 'list-master').earned).toBe(false);
  });

  it('earns family-team once a second member joins the same home', async () => {
    const { user: owner } = await authService.register({
      name: 'Owner',
      email: `owner-${Date.now()}-${Math.random()}@example.com`,
      password: 'Min8Chars!',
    });
    const { home, inviteCode } = await homeService.createHome(owner.id, { name: 'Test Home' });

    const badgesBefore = await badgeService.getBadges(home.id);
    expect(findBadge(badgesBefore, 'family-team').earned).toBe(false);

    const { user: secondUser } = await authService.register({
      name: 'Member',
      email: `member-${Date.now()}-${Math.random()}@example.com`,
      password: 'Min8Chars!',
    });
    await homeService.joinHome(secondUser.id, inviteCode);

    const badgesAfter = await badgeService.getBadges(home.id);
    expect(findBadge(badgesAfter, 'family-team').earned).toBe(true);
    expect(findBadge(badgesAfter, 'family-team').progress).toBe(2);
  });
});
