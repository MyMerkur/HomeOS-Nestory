import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as authService from './authService';
import * as homeService from './homeService';
import * as locationService from './locationService';
import * as inventoryService from './inventoryService';
import * as inventoryActionService from './inventoryActionService';
import * as assetService from './assetService';
import * as billService from './billService';
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

  it('breaks down pantry items vs medicines and counts active assets', async () => {
    const { homeId, userId, fridgeId } = await setupHome();

    await inventoryService.createItem(homeId, userId, {
      name: 'Milk',
      locationId: fridgeId,
      category: 'Dairy',
      quantity: 1,
      unit: 'piece',
    });
    await inventoryService.createItem(homeId, userId, {
      name: 'Parol',
      locationId: fridgeId,
      category: 'Medicine',
      quantity: 1,
      unit: 'piece',
    });
    await assetService.createAsset(homeId, userId, {
      name: 'Fridge',
      category: 'Appliance',
    });

    const dashboard = await dashboardService.getDashboard(homeId);

    expect(dashboard.totalActive).toBe(2);
    expect(dashboard.medicineCount).toBe(1);
    expect(dashboard.pantryItemCount).toBe(1);
    expect(dashboard.assetCount).toBe(1);
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

  it('sums paid bills for the current month and all unpaid bills', async () => {
    const { homeId, userId } = await setupHome();

    const paidBill = await billService.createBill(homeId, userId, {
      name: 'Elektrik',
      category: 'Electricity',
      amount: 250,
      dueDate: daysFromNow(-2),
    });
    await billService.markBillPaid(homeId, paidBill.id);

    await billService.createBill(homeId, userId, {
      name: 'Su',
      category: 'Water',
      amount: 80,
      dueDate: daysFromNow(5),
    });
    await billService.createBill(homeId, userId, {
      name: 'İnternet',
      category: 'Internet',
      amount: 120,
      dueDate: daysFromNow(10),
    });

    const dashboard = await dashboardService.getDashboard(homeId);

    expect(dashboard.spending.paidThisMonth).toBe(250);
    expect(dashboard.spending.unpaidTotal).toBe(200);
  });

  it('reports zero spending totals when there are no bills', async () => {
    const { homeId } = await setupHome();

    const dashboard = await dashboardService.getDashboard(homeId);

    expect(dashboard.spending).toEqual({ paidThisMonth: 0, unpaidTotal: 0 });
  });

  it('sums the price of items discarded this month', async () => {
    const { homeId, userId, fridgeId } = await setupHome();

    const pricey = await inventoryService.createItem(homeId, userId, {
      name: 'Pahalı Peynir',
      locationId: fridgeId,
      category: 'Dairy',
      quantity: 1,
      unit: 'piece',
      price: 150,
    });
    await inventoryActionService.discardItem(homeId, userId, pricey.id);

    const noPrice = await inventoryService.createItem(homeId, userId, {
      name: 'Fiyatsız Ürün',
      locationId: fridgeId,
      category: 'Other',
      quantity: 1,
      unit: 'piece',
    });
    await inventoryActionService.discardItem(homeId, userId, noPrice.id);

    // Consumed (not discarded) — should not count as waste.
    const consumed = await inventoryService.createItem(homeId, userId, {
      name: 'Tüketilen Ürün',
      locationId: fridgeId,
      category: 'Other',
      quantity: 1,
      unit: 'piece',
      price: 999,
    });
    await inventoryActionService.consumeItem(homeId, userId, consumed.id);

    const dashboard = await dashboardService.getDashboard(homeId);

    expect(dashboard.waste).toEqual({ totalValue: 150, itemCount: 2 });
  });

  it('reports zero waste when nothing has been discarded', async () => {
    const { homeId } = await setupHome();

    const dashboard = await dashboardService.getDashboard(homeId);

    expect(dashboard.waste).toEqual({ totalValue: 0, itemCount: 0 });
  });
});
