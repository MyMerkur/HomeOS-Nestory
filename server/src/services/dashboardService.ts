import { Types } from 'mongoose';
import { InventoryItem } from '../models/InventoryItem';
import { Asset } from '../models/Asset';
import { Bill } from '../models/Bill';
import { AuditLog } from '../models/AuditLog';
import { toSummary, type ItemSummary } from './inventoryService';

type DashboardSummary = {
  expiringToday: number;
  expiringIn3Days: number;
  expiringInWeek: number;
  totalActive: number;
  pantryItemCount: number;
  medicineCount: number;
  assetCount: number;
  upcomingItems: ItemSummary[];
  spending: { paidThisMonth: number; unpaidTotal: number };
  waste: { totalValue: number; itemCount: number };
};

function endOfDay(daysFromNow: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(23, 59, 59, 999);
  return date;
}

function startOfCurrentMonth(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

function startOfNextMonth(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 1);
}

async function sumBillAmounts(match: Record<string, unknown>): Promise<number> {
  const [result] = await Bill.aggregate<{ total: number }>([
    { $match: match },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  return result?.total ?? 0;
}

// Reads from AuditLog (not InventoryItem.updatedAt) because that's the only
// reliable "when was this actually discarded" timestamp — updatedAt gets
// bumped by any later edit to the same (still-existing) item document.
async function sumWastedValue(
  homeObjectId: Types.ObjectId,
  from: Date,
  to: Date,
): Promise<{ totalValue: number; itemCount: number }> {
  const [result] = await AuditLog.aggregate<{ totalValue: number; itemCount: number }>([
    { $match: { homeId: homeObjectId, action: 'discarded', createdAt: { $gte: from, $lt: to } } },
    { $lookup: { from: 'inventoryitems', localField: 'itemId', foreignField: '_id', as: 'item' } },
    { $unwind: '$item' },
    {
      $group: {
        _id: null,
        totalValue: { $sum: { $ifNull: ['$item.price', 0] } },
        itemCount: { $sum: 1 },
      },
    },
  ]);
  return { totalValue: result?.totalValue ?? 0, itemCount: result?.itemCount ?? 0 };
}

export async function getDashboard(homeId: string): Promise<DashboardSummary> {
  const activeFilter = { homeId, status: 'active' };

  const homeObjectId = new Types.ObjectId(homeId);

  const [
    expiringToday,
    expiringIn3Days,
    expiringInWeek,
    totalActive,
    medicineCount,
    assetCount,
    upcomingItems,
    paidThisMonth,
    unpaidTotal,
    waste,
  ] = await Promise.all([
    InventoryItem.countDocuments({
      ...activeFilter,
      expiryDate: { $lte: endOfDay(0) },
    }),
    InventoryItem.countDocuments({
      ...activeFilter,
      expiryDate: { $lte: endOfDay(3) },
    }),
    InventoryItem.countDocuments({
      ...activeFilter,
      expiryDate: { $lte: endOfDay(7) },
    }),
    InventoryItem.countDocuments(activeFilter),
    InventoryItem.countDocuments({ ...activeFilter, category: 'Medicine' }),
    Asset.countDocuments({ homeId, status: 'active' }),
    InventoryItem.find({ ...activeFilter, expiryDate: { $exists: true, $ne: null } })
      .sort({ expiryDate: 1 })
      .limit(5),
    sumBillAmounts({
      homeId: homeObjectId,
      status: 'paid',
      paidAt: { $gte: startOfCurrentMonth(), $lt: startOfNextMonth() },
    }),
    sumBillAmounts({ homeId: homeObjectId, status: 'unpaid' }),
    sumWastedValue(homeObjectId, startOfCurrentMonth(), startOfNextMonth()),
  ]);

  return {
    expiringToday,
    expiringIn3Days,
    expiringInWeek,
    totalActive,
    pantryItemCount: totalActive - medicineCount,
    medicineCount,
    assetCount,
    upcomingItems: upcomingItems.map(toSummary),
    spending: { paidThisMonth, unpaidTotal },
    waste,
  };
}
