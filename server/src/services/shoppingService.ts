import { Types } from 'mongoose';
import { ShoppingItem, type ShoppingItemDocument } from '../models/ShoppingItem';
import { ShoppingList } from '../models/ShoppingList';
import { InventoryItem } from '../models/InventoryItem';
import { AuditLog } from '../models/AuditLog';
import { AppError } from '../middlewares/errorHandler';
import { normalizeName } from '../utils/normalize';
import type {
  CreateShoppingItemInput,
  UpdateShoppingItemInput,
} from '../validations/shoppingValidation';

type ShoppingItemSummary = {
  id: string;
  name: string;
  quantity: number;
  unit: string | null;
  category: string | null;
  status: 'pending' | 'checked';
  checkedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

function toSummary(item: ShoppingItemDocument & { _id: unknown }): ShoppingItemSummary {
  return {
    id: (item._id as { toString(): string }).toString(),
    name: item.name,
    quantity: item.quantity,
    unit: item.unit ?? null,
    category: item.category ?? null,
    status: item.status as 'pending' | 'checked',
    checkedAt: item.checkedAt ?? null,
    createdAt: item.createdAt as Date,
    updatedAt: item.updatedAt as Date,
  };
}

async function findOrCreateDefaultList(homeId: string) {
  const existing = await ShoppingList.findOne({ homeId, isDefault: true });
  if (existing) return existing;
  return ShoppingList.create({ homeId, name: 'Alışveriş Listesi', isDefault: true });
}

async function findItemOrThrow(homeId: string, itemId: string) {
  const item = await ShoppingItem.findOne({ _id: itemId, homeId });
  if (!item) {
    throw new AppError('Shopping item not found', 404, 'SHOPPING_ITEM_NOT_FOUND');
  }
  return item;
}

export async function listShoppingItems(
  homeId: string,
  status?: 'pending' | 'checked',
): Promise<ShoppingItemSummary[]> {
  const filter: Record<string, unknown> = { homeId };
  if (status) filter.status = status;

  const items = await ShoppingItem.find(filter).sort({ createdAt: -1 });
  return items.map(toSummary);
}

export async function addShoppingItem(
  homeId: string,
  userId: string,
  input: CreateShoppingItemInput,
  sourceItemId?: string,
): Promise<ShoppingItemSummary> {
  const list = await findOrCreateDefaultList(homeId);

  const item = await ShoppingItem.create({
    homeId,
    listId: list._id,
    name: input.name,
    normalizedName: normalizeName(input.name),
    quantity: input.quantity ?? 1,
    unit: input.unit,
    category: input.category,
    addedBy: userId,
    sourceItemId,
  });

  return toSummary(item);
}

export async function updateShoppingItem(
  homeId: string,
  itemId: string,
  input: UpdateShoppingItemInput,
): Promise<ShoppingItemSummary> {
  const item = await findItemOrThrow(homeId, itemId);

  if (input.name !== undefined) {
    item.name = input.name;
    item.normalizedName = normalizeName(input.name);
  }
  if (input.quantity !== undefined) item.quantity = input.quantity;
  if (input.unit !== undefined) item.unit = input.unit;
  if (input.category !== undefined) item.category = input.category;

  await item.save();
  return toSummary(item);
}

export async function toggleCheck(homeId: string, itemId: string): Promise<ShoppingItemSummary> {
  const item = await findItemOrThrow(homeId, itemId);

  if (item.status === 'checked') {
    item.status = 'pending';
    item.checkedAt = undefined;
  } else {
    item.status = 'checked';
    item.checkedAt = new Date();
  }

  await item.save();
  return toSummary(item);
}

export async function deleteShoppingItem(homeId: string, itemId: string): Promise<void> {
  const item = await findItemOrThrow(homeId, itemId);
  await item.deleteOne();
}

export type ShoppingSuggestion = {
  normalizedName: string;
  name: string;
  category: string | null;
  unit: string | null;
  avgIntervalDays: number;
  daysSinceLastConsumed: number;
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const MAX_SUGGESTIONS = 10;
// Need at least this many past "consumed" events to trust a recurring pattern.
const MIN_CONSUMPTION_EVENTS = 2;

type ConsumptionGroup = {
  _id: string;
  name: string;
  category: string | null;
  unit: string | null;
  timestamps: Date[];
};

// Suggests re-adding items the home has a recurring, overdue consumption
// pattern for — e.g. milk consumed roughly every 5 days, 6 days since the
// last one. Excludes anything already in active stock or already on the list.
export async function getShoppingSuggestions(homeId: string): Promise<ShoppingSuggestion[]> {
  const homeObjectId = new Types.ObjectId(homeId);

  const groups = await AuditLog.aggregate<ConsumptionGroup>([
    { $match: { homeId: homeObjectId, action: 'consumed' } },
    { $lookup: { from: 'inventoryitems', localField: 'itemId', foreignField: '_id', as: 'item' } },
    { $unwind: '$item' },
    {
      $group: {
        _id: '$item.normalizedName',
        name: { $last: '$item.name' },
        category: { $last: '$item.category' },
        unit: { $last: '$item.unit' },
        timestamps: { $push: '$createdAt' },
      },
    },
  ]);

  const now = Date.now();
  const candidates: ShoppingSuggestion[] = [];

  for (const group of groups) {
    const sorted = group.timestamps.map((timestamp) => new Date(timestamp).getTime()).sort((a, b) => a - b);
    if (sorted.length < MIN_CONSUMPTION_EVENTS) continue;

    const diffs: number[] = [];
    for (let i = 1; i < sorted.length; i++) diffs.push(sorted[i] - sorted[i - 1]);
    const avgIntervalMs = diffs.reduce((sum, diff) => sum + diff, 0) / diffs.length;

    const lastConsumedMs = sorted[sorted.length - 1];
    if (now < lastConsumedMs + avgIntervalMs) continue;

    candidates.push({
      normalizedName: group._id,
      name: group.name,
      category: group.category ?? null,
      unit: group.unit ?? null,
      avgIntervalDays: Math.round(avgIntervalMs / MS_PER_DAY),
      daysSinceLastConsumed: Math.round((now - lastConsumedMs) / MS_PER_DAY),
    });
  }

  if (candidates.length === 0) return [];

  const normalizedNames = candidates.map((candidate) => candidate.normalizedName);

  const [activeStock, pendingShoppingItems] = await Promise.all([
    InventoryItem.find({ homeId, status: 'active', normalizedName: { $in: normalizedNames } }).select(
      'normalizedName',
    ),
    ShoppingItem.find({ homeId, status: 'pending', normalizedName: { $in: normalizedNames } }).select(
      'normalizedName',
    ),
  ]);

  const alreadyCovered = new Set([
    ...activeStock.map((item) => item.normalizedName),
    ...pendingShoppingItems.map((item) => item.normalizedName),
  ]);

  return candidates
    .filter((candidate) => !alreadyCovered.has(candidate.normalizedName))
    .sort((a, b) => b.daysSinceLastConsumed - a.daysSinceLastConsumed)
    .slice(0, MAX_SUGGESTIONS);
}
