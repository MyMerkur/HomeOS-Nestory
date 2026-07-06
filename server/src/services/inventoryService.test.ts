import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as authService from './authService';
import * as homeService from './homeService';
import * as locationService from './locationService';
import * as inventoryService from './inventoryService';
import { AppError } from '../middlewares/errorHandler';
import type { ListItemsQuery } from '../validations/inventoryValidation';

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

const baseQuery: ListItemsQuery = { page: 1, limit: 20 };

async function setupHome() {
  const { user } = await authService.register({
    name: 'Owner',
    email: `owner-${Date.now()}-${Math.random()}@example.com`,
    password: 'Min8Chars!',
  });
  const { home } = await homeService.createHome(user.id, { name: 'Test Home' });
  const locations = await locationService.listLocations(home.id);
  const fridge = locations.find((l) => l.type === 'fridge')!;
  const pantry = locations.find((l) => l.type === 'pantry')!;
  return { userId: user.id, homeId: home.id, fridgeId: fridge.id, pantryId: pantry.id };
}

describe('inventoryService', () => {
  it('creates an item with a normalized name', async () => {
    const { homeId, userId, fridgeId } = await setupHome();

    const item = await inventoryService.createItem(homeId, userId, {
      name: 'Kaşar Peyniri',
      locationId: fridgeId,
      category: 'Dairy',
      quantity: 1,
      unit: 'piece',
    });

    expect(item.name).toBe('Kaşar Peyniri');
    expect(item.status).toBe('active');

    const fetched = await inventoryService.getItem(homeId, item.id);
    expect(fetched.id).toBe(item.id);
  });

  it('rejects a location that does not belong to the home', async () => {
    const { homeId, userId } = await setupHome();
    const { fridgeId: otherFridgeId } = await setupHome();

    await expect(
      inventoryService.createItem(homeId, userId, {
        name: 'Milk',
        locationId: otherFridgeId,
        category: 'Dairy',
        quantity: 1,
        unit: 'liter',
      }),
    ).rejects.toMatchObject({ code: 'INVALID_LOCATION' } satisfies Partial<AppError>);
  });

  it('filters by location, category, status and search', async () => {
    const { homeId, userId, fridgeId, pantryId } = await setupHome();

    await inventoryService.createItem(homeId, userId, {
      name: 'Milk',
      locationId: fridgeId,
      category: 'Dairy',
      quantity: 1,
      unit: 'liter',
    });
    await inventoryService.createItem(homeId, userId, {
      name: 'Rice',
      locationId: pantryId,
      category: 'Other',
      quantity: 2,
      unit: 'kg',
    });

    const byLocation = await inventoryService.listItems(homeId, { ...baseQuery, locationId: fridgeId });
    expect(byLocation.items).toHaveLength(1);
    expect(byLocation.items[0].name).toBe('Milk');

    const byCategory = await inventoryService.listItems(homeId, { ...baseQuery, category: 'Other' });
    expect(byCategory.items).toHaveLength(1);
    expect(byCategory.items[0].name).toBe('Rice');

    const bySearch = await inventoryService.listItems(homeId, { ...baseQuery, search: 'mil' });
    expect(bySearch.items).toHaveLength(1);
    expect(bySearch.items[0].name).toBe('Milk');
  });

  it('filters by barcode', async () => {
    const { homeId, userId, fridgeId } = await setupHome();

    await inventoryService.createItem(homeId, userId, {
      name: 'Milk',
      locationId: fridgeId,
      category: 'Dairy',
      quantity: 1,
      unit: 'liter',
      barcode: '8690000000001',
    });
    await inventoryService.createItem(homeId, userId, {
      name: 'Rice',
      locationId: fridgeId,
      category: 'Other',
      quantity: 1,
      unit: 'kg',
      barcode: '8690000000002',
    });

    const result = await inventoryService.listItems(homeId, {
      ...baseQuery,
      barcode: '8690000000001',
    });

    expect(result.items).toHaveLength(1);
    expect(result.items[0].name).toBe('Milk');
  });

  it('filters by expiryWindow', async () => {
    const { homeId, userId, fridgeId } = await setupHome();
    const soon = new Date();
    soon.setDate(soon.getDate() + 2);
    const later = new Date();
    later.setDate(later.getDate() + 30);

    await inventoryService.createItem(homeId, userId, {
      name: 'Expiring Soon',
      locationId: fridgeId,
      category: 'Dairy',
      quantity: 1,
      unit: 'piece',
      expiryDate: soon,
    });
    await inventoryService.createItem(homeId, userId, {
      name: 'Expiring Later',
      locationId: fridgeId,
      category: 'Dairy',
      quantity: 1,
      unit: 'piece',
      expiryDate: later,
    });

    const result = await inventoryService.listItems(homeId, { ...baseQuery, expiryWindow: '7d' });
    expect(result.items).toHaveLength(1);
    expect(result.items[0].name).toBe('Expiring Soon');
  });

  it('paginates results', async () => {
    const { homeId, userId, fridgeId } = await setupHome();

    for (let i = 0; i < 5; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await inventoryService.createItem(homeId, userId, {
        name: `Item ${i}`,
        locationId: fridgeId,
        category: 'Other',
        quantity: 1,
        unit: 'piece',
      });
    }

    const page1 = await inventoryService.listItems(homeId, { page: 1, limit: 2 });
    expect(page1.items).toHaveLength(2);
    expect(page1.pagination).toEqual({ page: 1, limit: 2, total: 5, totalPages: 3 });

    const page3 = await inventoryService.listItems(homeId, { page: 3, limit: 2 });
    expect(page3.items).toHaveLength(1);
  });

  it('updates and deletes an item', async () => {
    const { homeId, userId, fridgeId } = await setupHome();
    const item = await inventoryService.createItem(homeId, userId, {
      name: 'Yogurt',
      locationId: fridgeId,
      category: 'Dairy',
      quantity: 1,
      unit: 'piece',
    });

    const updated = await inventoryService.updateItem(homeId, item.id, { quantity: 3 });
    expect(updated.quantity).toBe(3);

    await inventoryService.deleteItem(homeId, item.id);
    await expect(inventoryService.getItem(homeId, item.id)).rejects.toMatchObject({
      code: 'ITEM_NOT_FOUND',
    });
  });

  it('isolates items between homes', async () => {
    const { homeId: homeA, userId: userA, fridgeId: fridgeA } = await setupHome();
    const { homeId: homeB } = await setupHome();

    const item = await inventoryService.createItem(homeA, userA, {
      name: 'Secret Item',
      locationId: fridgeA,
      category: 'Other',
      quantity: 1,
      unit: 'piece',
    });

    await expect(inventoryService.getItem(homeB, item.id)).rejects.toMatchObject({
      code: 'ITEM_NOT_FOUND',
    });
  });
});
