import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as authService from './authService';
import * as homeService from './homeService';
import * as assetService from './assetService';

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

describe('assetService', () => {
  it('creates an asset with defaults', async () => {
    const { homeId, userId } = await setupHome();

    const asset = await assetService.createAsset(homeId, userId, {
      name: 'Televizyon',
      category: 'Electronics',
    });

    expect(asset.name).toBe('Televizyon');
    expect(asset.status).toBe('active');
    expect(asset.reminderDaysBefore).toEqual([30, 7, 1, 0]);
    expect(asset.receiptImageUrl).toBeNull();
  });

  it('creates an asset with full warranty details', async () => {
    const { homeId, userId } = await setupHome();

    const asset = await assetService.createAsset(homeId, userId, {
      name: 'Çamaşır Makinesi',
      category: 'Appliance',
      room: 'Banyo',
      brand: 'Bosch',
      serialNumber: 'SN-123',
      purchaseDate: new Date('2026-01-01'),
      price: 15000,
      warrantyEndDate: new Date('2028-01-01'),
    });

    expect(asset.room).toBe('Banyo');
    expect(asset.brand).toBe('Bosch');
    expect(asset.price).toBe(15000);
    expect(asset.warrantyEndDate).toEqual(new Date('2028-01-01'));
  });

  it('updates an asset, including status', async () => {
    const { homeId, userId } = await setupHome();
    const created = await assetService.createAsset(homeId, userId, {
      name: 'Koltuk',
      category: 'Furniture',
    });

    const updated = await assetService.updateAsset(homeId, created.id, {
      name: 'Koltuk Takımı',
      status: 'archived',
    });

    expect(updated.name).toBe('Koltuk Takımı');
    expect(updated.status).toBe('archived');
  });

  it('deletes an asset', async () => {
    const { homeId, userId } = await setupHome();
    const created = await assetService.createAsset(homeId, userId, {
      name: 'Buzdolabı',
      category: 'Appliance',
    });

    await assetService.deleteAsset(homeId, created.id);

    await expect(assetService.getAsset(homeId, created.id)).rejects.toMatchObject({
      code: 'ASSET_NOT_FOUND',
    });
  });

  it('throws 404 for an asset that does not belong to the home', async () => {
    const { homeId } = await setupHome();
    const { homeId: otherHomeId, userId: otherUserId } = await setupHome();
    const created = await assetService.createAsset(otherHomeId, otherUserId, {
      name: 'Diğer Ev Eşyası',
      category: 'Other',
    });

    await expect(assetService.getAsset(homeId, created.id)).rejects.toMatchObject({
      code: 'ASSET_NOT_FOUND',
    });
  });

  it('lists assets filtered by status and category', async () => {
    const { homeId, userId } = await setupHome();
    const tv = await assetService.createAsset(homeId, userId, { name: 'TV', category: 'Electronics' });
    await assetService.createAsset(homeId, userId, { name: 'Masa', category: 'Furniture' });
    await assetService.updateAsset(homeId, tv.id, { status: 'archived' });

    const activeOnly = await assetService.listAssets(homeId, {
      status: 'active',
      page: 1,
      limit: 20,
    });
    expect(activeOnly.assets).toHaveLength(1);
    expect(activeOnly.assets[0].name).toBe('Masa');

    const furnitureOnly = await assetService.listAssets(homeId, {
      category: 'Furniture',
      page: 1,
      limit: 20,
    });
    expect(furnitureOnly.assets).toHaveLength(1);
    expect(furnitureOnly.assets[0].name).toBe('Masa');
  });
});
