import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as authService from './authService';
import * as homeService from './homeService';
import * as billService from './billService';

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

describe('billService', () => {
  it('creates a bill with defaults', async () => {
    const { homeId, userId } = await setupHome();

    const bill = await billService.createBill(homeId, userId, {
      name: 'Elektrik',
      category: 'Electricity',
      amount: 450,
      dueDate: new Date('2026-08-01'),
    });

    expect(bill.name).toBe('Elektrik');
    expect(bill.status).toBe('unpaid');
    expect(bill.isRecurring).toBe(false);
    expect(bill.reminderDaysBefore).toEqual([3, 1, 0]);
    expect(bill.paidAt).toBeNull();
  });

  it('lists bills sorted by due date by default', async () => {
    const { homeId, userId } = await setupHome();

    await billService.createBill(homeId, userId, {
      name: 'Internet',
      category: 'Internet',
      amount: 300,
      dueDate: new Date('2026-08-15'),
    });
    await billService.createBill(homeId, userId, {
      name: 'Su',
      category: 'Water',
      amount: 120,
      dueDate: new Date('2026-08-05'),
    });

    const result = await billService.listBills(homeId, { page: 1, limit: 20 });

    expect(result.bills.map((bill) => bill.name)).toEqual(['Su', 'Internet']);
    expect(result.pagination.total).toBe(2);
  });

  it('filters bills by status and category', async () => {
    const { homeId, userId } = await setupHome();
    const bill = await billService.createBill(homeId, userId, {
      name: 'Kira',
      category: 'Rent',
      amount: 12000,
      dueDate: new Date('2026-08-01'),
    });
    await billService.createBill(homeId, userId, {
      name: 'Su',
      category: 'Water',
      amount: 120,
      dueDate: new Date('2026-08-05'),
    });
    await billService.markBillPaid(homeId, bill.id);

    const unpaid = await billService.listBills(homeId, { page: 1, limit: 20, status: 'unpaid' });
    const rent = await billService.listBills(homeId, { page: 1, limit: 20, category: 'Rent' });

    expect(unpaid.bills.map((b) => b.name)).toEqual(['Su']);
    expect(rent.bills.map((b) => b.name)).toEqual(['Kira']);
  });

  it('updates a bill', async () => {
    const { homeId, userId } = await setupHome();
    const bill = await billService.createBill(homeId, userId, {
      name: 'Elektrik',
      category: 'Electricity',
      amount: 450,
      dueDate: new Date('2026-08-01'),
    });

    const updated = await billService.updateBill(homeId, bill.id, { amount: 500 });

    expect(updated.amount).toBe(500);
  });

  it('deletes a bill', async () => {
    const { homeId, userId } = await setupHome();
    const bill = await billService.createBill(homeId, userId, {
      name: 'Elektrik',
      category: 'Electricity',
      amount: 450,
      dueDate: new Date('2026-08-01'),
    });

    await billService.deleteBill(homeId, bill.id);

    await expect(billService.getBill(homeId, bill.id)).rejects.toMatchObject({
      code: 'BILL_NOT_FOUND',
    });
  });

  it('marks a one-time bill as paid without creating a follow-up', async () => {
    const { homeId, userId } = await setupHome();
    const bill = await billService.createBill(homeId, userId, {
      name: 'Beyaz Eşya',
      category: 'Other',
      amount: 2000,
      dueDate: new Date('2026-08-01'),
    });

    const paid = await billService.markBillPaid(homeId, bill.id);

    expect(paid.status).toBe('paid');
    expect(paid.paidAt).not.toBeNull();
    const all = await billService.listBills(homeId, { page: 1, limit: 20 });
    expect(all.pagination.total).toBe(1);
  });

  it('marking a recurring bill as paid creates next month\'s unpaid instance', async () => {
    const { homeId, userId } = await setupHome();
    const bill = await billService.createBill(homeId, userId, {
      name: 'Kira',
      category: 'Rent',
      amount: 12000,
      dueDate: new Date('2026-08-01'),
      isRecurring: true,
    });

    await billService.markBillPaid(homeId, bill.id);

    const all = await billService.listBills(homeId, { page: 1, limit: 20 });
    expect(all.pagination.total).toBe(2);
    const next = all.bills.find((b) => b.status === 'unpaid');
    expect(next?.isRecurring).toBe(true);
    expect(next?.dueDate.toISOString().slice(0, 10)).toBe('2026-09-01');
  });

  it('is idempotent when marking an already-paid bill as paid again', async () => {
    const { homeId, userId } = await setupHome();
    const bill = await billService.createBill(homeId, userId, {
      name: 'Kira',
      category: 'Rent',
      amount: 12000,
      dueDate: new Date('2026-08-01'),
      isRecurring: true,
    });

    await billService.markBillPaid(homeId, bill.id);
    await billService.markBillPaid(homeId, bill.id);

    const all = await billService.listBills(homeId, { page: 1, limit: 20 });
    expect(all.pagination.total).toBe(2);
  });
});
