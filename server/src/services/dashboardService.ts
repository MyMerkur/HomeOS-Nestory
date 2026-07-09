import { InventoryItem } from '../models/InventoryItem';
import { Asset } from '../models/Asset';
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
};

function endOfDay(daysFromNow: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(23, 59, 59, 999);
  return date;
}

export async function getDashboard(homeId: string): Promise<DashboardSummary> {
  const activeFilter = { homeId, status: 'active' };

  const [
    expiringToday,
    expiringIn3Days,
    expiringInWeek,
    totalActive,
    medicineCount,
    assetCount,
    upcomingItems,
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
  };
}
