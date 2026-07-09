import { Bill, type BillDocument } from '../models/Bill';
import { AppError } from '../middlewares/errorHandler';
import type { CreateBillInput, ListBillsQuery, UpdateBillInput } from '../validations/billValidation';

export type BillSummary = {
  id: string;
  name: string;
  category: string;
  amount: number;
  dueDate: Date;
  isRecurring: boolean;
  status: string;
  paidAt: Date | null;
  reminderDaysBefore: number[];
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export function toSummary(bill: BillDocument & { _id: unknown }): BillSummary {
  return {
    id: (bill._id as { toString(): string }).toString(),
    name: bill.name,
    category: bill.category,
    amount: bill.amount,
    dueDate: bill.dueDate,
    isRecurring: bill.isRecurring,
    status: bill.status,
    paidAt: bill.paidAt ?? null,
    reminderDaysBefore: bill.reminderDaysBefore ?? [],
    notes: bill.notes ?? null,
    createdAt: bill.createdAt as Date,
    updatedAt: bill.updatedAt as Date,
  };
}

export async function createBill(
  homeId: string,
  userId: string,
  input: CreateBillInput,
): Promise<BillSummary> {
  const bill = await Bill.create({
    homeId,
    createdBy: userId,
    name: input.name,
    category: input.category,
    amount: input.amount,
    dueDate: input.dueDate,
    isRecurring: input.isRecurring,
    reminderDaysBefore: input.reminderDaysBefore,
    notes: input.notes,
  });

  return toSummary(bill);
}

export async function findBillOrThrow(homeId: string, billId: string) {
  const bill = await Bill.findOne({ _id: billId, homeId });
  if (!bill) {
    throw new AppError('Bill not found', 404, 'BILL_NOT_FOUND');
  }
  return bill;
}

export async function getBill(homeId: string, billId: string): Promise<BillSummary> {
  const bill = await findBillOrThrow(homeId, billId);
  return toSummary(bill);
}

export async function updateBill(
  homeId: string,
  billId: string,
  input: UpdateBillInput,
): Promise<BillSummary> {
  const bill = await findBillOrThrow(homeId, billId);

  if (input.name !== undefined) bill.name = input.name;
  if (input.category !== undefined) bill.category = input.category;
  if (input.amount !== undefined) bill.amount = input.amount;
  if (input.dueDate !== undefined) bill.dueDate = input.dueDate;
  if (input.isRecurring !== undefined) bill.isRecurring = input.isRecurring;
  if (input.reminderDaysBefore !== undefined) bill.reminderDaysBefore = input.reminderDaysBefore;
  if (input.notes !== undefined) bill.notes = input.notes;

  await bill.save();
  return toSummary(bill);
}

export async function deleteBill(homeId: string, billId: string): Promise<void> {
  const bill = await findBillOrThrow(homeId, billId);
  await bill.deleteOne();
}

function addOneMonth(date: Date): Date {
  const next = new Date(date);
  next.setMonth(next.getMonth() + 1);
  return next;
}

/**
 * Marking a bill paid on a recurring bill immediately creates next month's
 * instance (unpaid), so the user never has to re-enter a rent/utility bill
 * by hand every cycle.
 */
export async function markBillPaid(homeId: string, billId: string): Promise<BillSummary> {
  const bill = await findBillOrThrow(homeId, billId);
  if (bill.status === 'paid') {
    return toSummary(bill);
  }

  bill.status = 'paid';
  bill.paidAt = new Date();
  await bill.save();

  if (bill.isRecurring) {
    await Bill.create({
      homeId,
      createdBy: bill.createdBy,
      name: bill.name,
      category: bill.category,
      amount: bill.amount,
      dueDate: addOneMonth(bill.dueDate),
      isRecurring: true,
      status: 'unpaid',
      reminderDaysBefore: bill.reminderDaysBefore,
      notes: bill.notes,
    });
  }

  return toSummary(bill);
}

type ListBillsResult = {
  bills: BillSummary[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
};

export async function listBills(homeId: string, query: ListBillsQuery): Promise<ListBillsResult> {
  const filter: Record<string, unknown> = { homeId };
  if (query.status) filter.status = query.status;
  if (query.category) filter.category = query.category;

  const sort: Record<string, 1 | -1> = {};
  if (query.sort) {
    const [field, direction] = query.sort.split(':');
    sort[field] = direction === 'desc' ? -1 : 1;
  } else {
    sort.dueDate = 1;
  }

  const skip = (query.page - 1) * query.limit;

  const [bills, total] = await Promise.all([
    Bill.find(filter).sort(sort).skip(skip).limit(query.limit),
    Bill.countDocuments(filter),
  ]);

  return {
    bills: bills.map(toSummary),
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit) || 1,
    },
  };
}
