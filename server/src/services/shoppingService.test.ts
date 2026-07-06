import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as authService from './authService';
import * as homeService from './homeService';
import * as shoppingService from './shoppingService';

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
  return { userId: user.id, homeId: home.id };
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
});
