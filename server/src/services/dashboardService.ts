import { Types } from 'mongoose';
import { InventoryItem } from '../models/InventoryItem';
import { Asset } from '../models/Asset';
import { Bill } from '../models/Bill';
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
  };
}
