import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as authService from './authService';
import * as homeService from './homeService';
import * as locationService from './locationService';
import { InventoryItem } from '../models/InventoryItem';
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

async function setupHome() {
  const { user } = await authService.register({
    name: 'Owner',
    email: `owner-${Date.now()}@example.com`,
    password: 'Min8Chars!',
  });
  const { home } = await homeService.createHome(user.id, { name: 'Test Home' });
  return { userId: user.id, homeId: home.id };
}

describe('locationService', () => {
  it('lists the 3 default locations created with the home', async () => {
    const { homeId } = await setupHome();

    const locations = await locationService.listLocations(homeId);

    expect(locations).toHaveLength(3);
    expect(locations.map((l) => l.type).sort()).toEqual(['fridge', 'freezer', 'pantry'].sort());
  });

  it('creates a custom location', async () => {
    const { homeId } = await setupHome();

    const location = await locationService.createLocation(homeId, {
      name: 'Temizlik Dolabı',
      type: 'cabinet',
    });

    expect(location.name).toBe('Temizlik Dolabı');
    const locations = await locationService.listLocations(homeId);
    expect(locations).toHaveLength(4);
  });

  it('updates a location', async () => {
    const { homeId } = await setupHome();
    const created = await locationService.createLocation(homeId, { name: 'Old', type: 'other' });

    const updated = await locationService.updateLocation(homeId, created.id, { name: 'New' });

    expect(updated.name).toBe('New');
  });

  it('deletes an empty location', async () => {
    const { homeId } = await setupHome();
    const created = await locationService.createLocation(homeId, { name: 'Temp', type: 'other' });

    await locationService.deleteLocation(homeId, created.id);

    const locations = await locationService.listLocations(homeId);
    expect(locations.find((l) => l.id === created.id)).toBeUndefined();
  });

  it('refuses to delete a location that still has items', async () => {
    const { homeId, userId } = await setupHome();
    const locations = await locationService.listLocations(homeId);
    const fridge = locations.find((l) => l.type === 'fridge')!;

    await InventoryItem.create({
      homeId,
      locationId: fridge.id,
      createdBy: userId,
      name: 'Milk',
      normalizedName: 'milk',
      category: 'Dairy',
      quantity: 1,
      unit: 'liter',
    });

    await expect(locationService.deleteLocation(homeId, fridge.id)).rejects.toMatchObject({
      code: 'LOCATION_NOT_EMPTY',
    } satisfies Partial<AppError>);
  });

  it('throws 404 for a location that does not belong to the home', async () => {
    const { homeId } = await setupHome();
    const { homeId: otherHomeId } = await setupHome();
    const created = await locationService.createLocation(otherHomeId, { name: 'Other', type: 'other' });

    await expect(locationService.updateLocation(homeId, created.id, { name: 'X' })).rejects.toMatchObject({
      code: 'LOCATION_NOT_FOUND',
    });
  });
});
