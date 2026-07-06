import { InventoryItem } from '../models/InventoryItem';
import { AuditLog } from '../models/AuditLog';
import { ShoppingItem } from '../models/ShoppingItem';
import { Membership } from '../models/Membership';
import { BADGE_DEFINITIONS } from '../constants/badges';

type BadgeProgress = {
  id: string;
  name: string;
  description: string;
  target: number;
  progress: number;
  earned: boolean;
};

async function countItemsCreated(homeId: string): Promise<number> {
  return InventoryItem.countDocuments({ homeId });
}

async function countWastePrevented(homeId: string): Promise<number> {
  const consumedLogs = await AuditLog.find({ homeId, action: 'consumed' }).select(
    'itemId createdAt',
  );
  if (consumedLogs.length === 0) return 0;

  const itemIds = consumedLogs.map((log) => log.itemId);
  const items = await InventoryItem.find({ _id: { $in: itemIds } }).select('expiryDate');
  const expiryById = new Map(items.map((item) => [item._id.toString(), item.expiryDate]));

  return consumedLogs.filter((log) => {
    const expiryDate = expiryById.get(log.itemId.toString());
    return expiryDate && expiryDate >= (log.createdAt as Date);
  }).length;
}

async function countShoppingItemsChecked(homeId: string): Promise<number> {
  return ShoppingItem.countDocuments({ homeId, status: 'checked' });
}

async function countActiveMembers(homeId: string): Promise<number> {
  return Membership.countDocuments({ homeId, status: 'active' });
}

export async function getBadges(homeId: string): Promise<BadgeProgress[]> {
  const [itemsCreated, wastePrevented, shoppingItemsChecked, activeMembers] = await Promise.all([
    countItemsCreated(homeId),
    countWastePrevented(homeId),
    countShoppingItemsChecked(homeId),
    countActiveMembers(homeId),
  ]);

  const progressById: Record<string, number> = {
    'first-item': itemsCreated,
    'regular-tracker': itemsCreated,
    'waste-preventer': wastePrevented,
    'list-master': shoppingItemsChecked,
    'family-team': activeMembers,
  };

  return BADGE_DEFINITIONS.map((definition) => {
    const progress = progressById[definition.id] ?? 0;
    return {
      ...definition,
      progress,
      earned: progress >= definition.target,
    };
  });
}
