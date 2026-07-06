import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as authService from './authService';
import * as homeService from './homeService';
import * as locationService from './locationService';
import * as inventoryService from './inventoryService';
import * as inventoryActionService from './inventoryActionService';
import * as dashboardService from './dashboardService';

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

function daysFromNow(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

describe('dashboardService', () => {
  it('buckets active items by expiry window and lists upcoming items', async () => {
    const { homeId, userId, fridgeId } = await setupHome();

    await inventoryService.createItem(homeId, userId, {
      name: 'Expires Today',
      locationId: fridgeId,
      category: 'Dairy',
      quantity: 1,
      unit: 'piece',
      expiryDate: daysFromNow(0),
    });
    await inventoryService.createItem(homeId, userId, {
      name: 'Expires In 2 Days',
      locationId: fridgeId,
      category: 'Dairy',
      quantity: 1,
      unit: 'piece',
      expiryDate: daysFromNow(2),
    });
    await inventoryService.createItem(homeId, userId, {
      name: 'Expires In 5 Days',
      locationId: fridgeId,
      category: 'Dairy',
      quantity: 1,
      unit: 'piece',
      expiryDate: daysFromNow(5),
    });
    await inventoryService.createItem(homeId, userId, {
      name: 'Expires In A Month',
      locationId: fridgeId,
      category: 'Dairy',
      quantity: 1,
      unit: 'piece',
      expiryDate: daysFromNow(30),
    });
    await inventoryService.createItem(homeId, userId, {
      name: 'No Expiry',
      locationId: fridgeId,
      category: 'Other',
      quantity: 1,
      unit: 'piece',
    });

    const dashboard = await dashboardService.getDashboard(homeId);

    expect(dashboard.expiringToday).toBe(1);
    expect(dashboard.expiringIn3Days).toBe(2);
    expect(dashboard.expiringInWeek).toBe(3);
    expect(dashboard.totalActive).toBe(5);
    expect(dashboard.upcomingItems).toHaveLength(4);
    expect(dashboard.upcomingItems[0].name).toBe('Expires Today');
  });

  it('excludes non-active items from the counts', async () => {
    const { homeId, userId, fridgeId } = await setupHome();

    const item = await inventoryService.createItem(homeId, userId, {
      name: 'Consumed Item',
      locationId: fridgeId,
      category: 'Dairy',
      quantity: 1,
      unit: 'piece',
      expiryDate: daysFromNow(0),
    });
    await inventoryActionService.consumeItem(homeId, userId, item.id);

    const dashboard = await dashboardService.getDashboard(homeId);

    expect(dashboard.expiringToday).toBe(0);
    expect(dashboard.totalActive).toBe(0);
    expect(dashboard.upcomingItems).toHaveLength(0);
  });
});
