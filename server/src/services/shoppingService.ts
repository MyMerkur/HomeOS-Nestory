import { ShoppingItem, type ShoppingItemDocument } from '../models/ShoppingItem';
import { ShoppingList } from '../models/ShoppingList';
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
