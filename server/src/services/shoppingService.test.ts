import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as authService from './authService';
import * as homeService from './homeService';
import * as locationService from './locationService';
import * as inventoryService from './inventoryService';
import * as shoppingService from './shoppingService';
import { AuditLog } from '../models/AuditLog';
import { InventoryItem } from '../models/InventoryItem';

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

async function logConsumed(homeId: string, userId: string, itemId: string, createdAt: Date) {
  await AuditLog.create({
    homeId,
    itemId,
    userId,
    action: 'consumed',
    previousStatus: 'active',
    newStatus: 'consumed',
    createdAt,
  });
  // A real "consumed" audit log always corresponds to the item's status
  // having actually flipped away from active (see inventoryActionService) —
  // otherwise it'd still count as in-stock and get excluded from suggestions.
  await InventoryItem.findByIdAndUpdate(itemId, { status: 'consumed' });
}

describe('shoppingService', () => {
  it('adds and lists shopping items on the home default list', async () => {
    const { homeId, userId } = await setupHome();

    const item = await shoppingService.addShoppingItem(homeId, userId, { name: 'Milk' });
    expect(item.status).toBe('pending');
    expect(item.quantity).toBe(1);

    const items = await shoppingService.listShoppingItems(homeId);
    expect(items).toHaveLength(1);
    expect(items[0].name).toBe('Milk');
  });

  it('filters shopping items by status', async () => {
    const { homeId, userId } = await setupHome();

    const item = await shoppingService.addShoppingItem(homeId, userId, { name: 'Milk' });
    await shoppingService.addShoppingItem(homeId, userId, { name: 'Bread' });
    await shoppingService.toggleCheck(homeId, item.id);

    const checked = await shoppingService.listShoppingItems(homeId, 'checked');
    expect(checked).toHaveLength(1);
    expect(checked[0].name).toBe('Milk');

    const pending = await shoppingService.listShoppingItems(homeId, 'pending');
    expect(pending).toHaveLength(1);
    expect(pending[0].name).toBe('Bread');
  });

  it('toggles check status back to pending', async () => {
    const { homeId, userId } = await setupHome();
    const item = await shoppingService.addShoppingItem(homeId, userId, { name: 'Milk' });

    const checked = await shoppingService.toggleCheck(homeId, item.id);
    expect(checked.status).toBe('checked');
    expect(checked.checkedAt).not.toBeNull();

    const pending = await shoppingService.toggleCheck(homeId, item.id);
    expect(pending.status).toBe('pending');
    expect(pending.checkedAt).toBeNull();
  });

  it('updates a shopping item', async () => {
    const { homeId, userId } = await setupHome();
    const item = await shoppingService.addShoppingItem(homeId, userId, { name: 'Milk', quantity: 1 });

    const updated = await shoppingService.updateShoppingItem(homeId, item.id, { quantity: 3 });
    expect(updated.quantity).toBe(3);
  });

  it('deletes a shopping item', async () => {
    const { homeId, userId } = await setupHome();
    const item = await shoppingService.addShoppingItem(homeId, userId, { name: 'Milk' });

    await shoppingService.deleteShoppingItem(homeId, item.id);
    const items = await shoppingService.listShoppingItems(homeId);
    expect(items).toHaveLength(0);
  });

  it('isolates shopping items between homes', async () => {
    const { homeId: homeA, userId: userA } = await setupHome();
    const { homeId: homeB } = await setupHome();

    const item = await shoppingService.addShoppingItem(homeA, userA, { name: 'Secret Milk' });

    await expect(shoppingService.toggleCheck(homeB, item.id)).rejects.toMatchObject({
      code: 'SHOPPING_ITEM_NOT_FOUND',
    });
  });

  describe('getShoppingSuggestions', () => {
    it('suggests an item that is overdue based on its average consumption interval', async () => {
      const { homeId, userId, fridgeId } = await setupHome();
      const item = await inventoryService.createItem(homeId, userId, {
        name: 'Süt',
        locationId: fridgeId,
        category: 'Dairy',
        quantity: 1,
        unit: 'liter',
      });
      // Consumed every ~4 days historically, last consumed 6 days ago -> overdue.
      await logConsumed(homeId, userId, item.id, daysFromNow(-10));
      await logConsumed(homeId, userId, item.id, daysFromNow(-6));

      const suggestions = await shoppingService.getShoppingSuggestions(homeId);

      expect(suggestions).toHaveLength(1);
      expect(suggestions[0]).toMatchObject({ name: 'Süt', category: 'Dairy', avgIntervalDays: 4 });
    });

    it('does not suggest an item with fewer than two consumption events', async () => {
      const { homeId, userId, fridgeId } = await setupHome();
      const item = await inventoryService.createItem(homeId, userId, {
        name: 'Süt',
        locationId: fridgeId,
        category: 'Dairy',
        quantity: 1,
        unit: 'liter',
      });
      await logConsumed(homeId, userId, item.id, daysFromNow(-10));

      const suggestions = await shoppingService.getShoppingSuggestions(homeId);

      expect(suggestions).toHaveLength(0);
    });

    it('does not suggest an item that is not overdue yet', async () => {
      const { homeId, userId, fridgeId } = await setupHome();
      const item = await inventoryService.createItem(homeId, userId, {
        name: 'Süt',
        locationId: fridgeId,
        category: 'Dairy',
        quantity: 1,
        unit: 'liter',
      });
      // Consumed every ~10 days, last consumed only 1 day ago -> not due yet.
      await logConsumed(homeId, userId, item.id, daysFromNow(-11));
      await logConsumed(homeId, userId, item.id, daysFromNow(-1));

      const suggestions = await shoppingService.getShoppingSuggestions(homeId);

      expect(suggestions).toHaveLength(0);
    });

    it('excludes items that already have active stock', async () => {
      const { homeId, userId, fridgeId } = await setupHome();
      const item = await inventoryService.createItem(homeId, userId, {
        name: 'Süt',
        locationId: fridgeId,
        category: 'Dairy',
        quantity: 1,
        unit: 'liter',
      });
      await logConsumed(homeId, userId, item.id, daysFromNow(-10));
      await logConsumed(homeId, userId, item.id, daysFromNow(-6));
      await inventoryService.createItem(homeId, userId, {
        name: 'Süt',
        locationId: fridgeId,
        category: 'Dairy',
        quantity: 1,
        unit: 'liter',
      });

      const suggestions = await shoppingService.getShoppingSuggestions(homeId);

      expect(suggestions).toHaveLength(0);
    });

    it('excludes items already pending on the shopping list', async () => {
      const { homeId, userId, fridgeId } = await setupHome();
      const item = await inventoryService.createItem(homeId, userId, {
        name: 'Süt',
        locationId: fridgeId,
        category: 'Dairy',
        quantity: 1,
        unit: 'liter',
      });
      await logConsumed(homeId, userId, item.id, daysFromNow(-10));
      await logConsumed(homeId, userId, item.id, daysFromNow(-6));
      await shoppingService.addShoppingItem(homeId, userId, { name: 'Süt' });

      const suggestions = await shoppingService.getShoppingSuggestions(homeId);

      expect(suggestions).toHaveLength(0);
    });
  });
});
