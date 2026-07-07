import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as authService from './authService';
import * as homeService from './homeService';
import * as locationService from './locationService';
import * as inventoryService from './inventoryService';
import * as inventoryActionService from './inventoryActionService';
import * as shoppingService from './shoppingService';
import { AuditLog } from '../models/AuditLog';

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

async function setupHomeWithItem() {
  const { user } = await authService.register({
    name: 'Owner',
    email: `owner-${Date.now()}-${Math.random()}@example.com`,
    password: 'Min8Chars!',
  });
  const { home } = await homeService.createHome(user.id, { name: 'Test Home' });
  const locations = await locationService.listLocations(home.id);
  const fridge = locations.find((l) => l.type === 'fridge')!;
  const item = await inventoryService.createItem(home.id, user.id, {
    name: 'Milk',
    locationId: fridge.id,
    category: 'Dairy',
    quantity: 1,
    unit: 'liter',
  });
  return { userId: user.id, homeId: home.id, itemId: item.id };
}

async function setupHomeWithMedicine(overrides: { quantity?: number; doseAmount?: number } = {}) {
  const { user } = await authService.register({
    name: 'Owner',
    email: `owner-${Date.now()}-${Math.random()}@example.com`,
    password: 'Min8Chars!',
  });
  const { home } = await homeService.createHome(user.id, { name: 'Test Home' });
  const locations = await locationService.listLocations(home.id);
  const pantry = locations.find((l) => l.type === 'pantry')!;
  const item = await inventoryService.createItem(home.id, user.id, {
    name: 'Parol',
    locationId: pantry.id,
    category: 'Medicine',
    quantity: overrides.quantity ?? 10,
    unit: 'piece',
    doseAmount: overrides.doseAmount,
    doseTimes: ['09:00', '21:00'],
  });
  return { userId: user.id, homeId: home.id, itemId: item.id };
}

describe('inventoryActionService', () => {
  it('consumes an item and writes an audit log', async () => {
    const { homeId, userId, itemId } = await setupHomeWithItem();

    const result = await inventoryActionService.consumeItem(homeId, userId, itemId);
    expect(result.item.status).toBe('consumed');

    const logs = await AuditLog.find({ homeId });
    expect(logs).toHaveLength(1);
    expect(logs[0].action).toBe('consumed');
    expect(logs[0].previousStatus).toBe('active');
    expect(logs[0].newStatus).toBe('consumed');
  });

  it('discards an item and writes an audit log', async () => {
    const { homeId, userId, itemId } = await setupHomeWithItem();

    const result = await inventoryActionService.discardItem(homeId, userId, itemId);
    expect(result.item.status).toBe('discarded');

    const logs = await AuditLog.find({ homeId, action: 'discarded' });
    expect(logs).toHaveLength(1);
  });

  it('freezes an item without changing its location', async () => {
    const { homeId, userId, itemId } = await setupHomeWithItem();
    const before = await inventoryService.getItem(homeId, itemId);

    const result = await inventoryActionService.freezeItem(homeId, userId, itemId);

    expect(result.item.status).toBe('frozen');
    expect(result.item.locationId).toBe(before.locationId);
  });

  it('rejects re-applying the same status transition', async () => {
    const { homeId, userId, itemId } = await setupHomeWithItem();
    await inventoryActionService.consumeItem(homeId, userId, itemId);

    await expect(inventoryActionService.consumeItem(homeId, userId, itemId)).rejects.toMatchObject(
      { code: 'INVALID_STATUS_TRANSITION' },
    );
  });

  it('adds an item to the shopping list without changing inventory status', async () => {
    const { homeId, userId, itemId } = await setupHomeWithItem();

    const result = await inventoryActionService.addToShopping(homeId, userId, itemId);

    expect(result.item.status).toBe('active');
    expect(result.shoppingItem.name).toBe('Milk');

    const shoppingItems = await shoppingService.listShoppingItems(homeId);
    expect(shoppingItems).toHaveLength(1);

    const logs = await AuditLog.find({ homeId, action: 'added_to_shopping' });
    expect(logs).toHaveLength(1);
    expect(logs[0].newStatus).toBeUndefined();
    expect((logs[0].metadata as { shoppingItemId: string }).shoppingItemId).toBe(
      result.shoppingItem.id,
    );
  });

  it('decrements quantity by doseAmount when a dose is taken', async () => {
    const { homeId, userId, itemId } = await setupHomeWithMedicine({ quantity: 10, doseAmount: 2 });

    const result = await inventoryActionService.takeDose(homeId, userId, itemId);

    expect(result.item.quantity).toBe(8);
    expect(result.item.status).toBe('active');

    const logs = await AuditLog.find({ homeId, action: 'dose_taken' });
    expect(logs).toHaveLength(1);
    expect(logs[0].previousStatus).toBe('active');
    expect(logs[0].newStatus).toBe('active');
    expect((logs[0].metadata as { quantityAfter: number }).quantityAfter).toBe(8);
  });

  it('defaults doseAmount to 1 when unset', async () => {
    const { homeId, userId, itemId } = await setupHomeWithMedicine({ quantity: 10 });

    const result = await inventoryActionService.takeDose(homeId, userId, itemId);

    expect(result.item.quantity).toBe(9);
  });

  it('floors quantity at 0 instead of going negative', async () => {
    const { homeId, userId, itemId } = await setupHomeWithMedicine({ quantity: 1, doseAmount: 5 });

    const result = await inventoryActionService.takeDose(homeId, userId, itemId);

    expect(result.item.quantity).toBe(0);
    expect(result.item.status).toBe('active');
  });

  it('rejects taking a dose on a non-medicine item', async () => {
    const { homeId, userId, itemId } = await setupHomeWithItem();

    await expect(inventoryActionService.takeDose(homeId, userId, itemId)).rejects.toMatchObject({
      code: 'NOT_A_MEDICINE',
    });
  });
});
