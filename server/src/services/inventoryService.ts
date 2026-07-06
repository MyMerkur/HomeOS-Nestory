import { FilterQuery, Types } from 'mongoose';
import { InventoryItem, type InventoryItemDocument } from '../models/InventoryItem';
import { PantryLocation } from '../models/PantryLocation';
import { AppError } from '../middlewares/errorHandler';
import { normalizeName } from '../utils/normalize';
import type { CreateItemInput, ListItemsQuery, UpdateItemInput } from '../validations/inventoryValidation';

export type ItemSummary = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  locationId: string;
  expiryDate: Date | null;
  purchaseDate: Date | null;
  brand: string | null;
  barcode: string | null;
  status: string;
  notes: string | null;
  imageUrl: string | null;
  reminderDaysBefore: number[];
  createdAt: Date;
  updatedAt: Date;
};

export function toSummary(item: InventoryItemDocument & { _id: unknown }): ItemSummary {
  return {
    id: (item._id as { toString(): string }).toString(),
    name: item.name,
    category: item.category,
    quantity: item.quantity,
    unit: item.unit,
    locationId: item.locationId.toString(),
    expiryDate: item.expiryDate ?? null,
    purchaseDate: item.purchaseDate ?? null,
    brand: item.brand ?? null,
    barcode: item.barcode ?? null,
    status: item.status,
    notes: item.notes ?? null,
    imageUrl: item.imageUrl ?? null,
    reminderDaysBefore: item.reminderDaysBefore ?? [],
    createdAt: item.createdAt as Date,
    updatedAt: item.updatedAt as Date,
  };
}

async function assertLocationBelongsToHome(homeId: string, locationId: string) {
  const location = await PantryLocation.findOne({ _id: locationId, homeId });
  if (!location) {
    throw new AppError('Location not found in this home', 400, 'INVALID_LOCATION');
  }
}

export async function createItem(
  homeId: string,
  userId: string,
  input: CreateItemInput,
): Promise<ItemSummary> {
  await assertLocationBelongsToHome(homeId, input.locationId);

  const item = await InventoryItem.create({
    homeId,
    locationId: input.locationId,
    createdBy: userId,
    name: input.name,
    normalizedName: normalizeName(input.name),
    category: input.category,
    quantity: input.quantity,
    unit: input.unit,
    expiryDate: input.expiryDate,
    purchaseDate: input.purchaseDate,
    barcode: input.barcode,
    brand: input.brand,
    notes: input.notes,
    imageUrl: input.imageUrl,
    reminderDaysBefore: input.reminderDaysBefore,
  });

  return toSummary(item);
}

export async function findItemOrThrow(homeId: string, itemId: string) {
  const item = await InventoryItem.findOne({ _id: itemId, homeId });
  if (!item) {
    throw new AppError('Item not found', 404, 'ITEM_NOT_FOUND');
  }
  return item;
}

export async function getItem(homeId: string, itemId: string): Promise<ItemSummary> {
  const item = await findItemOrThrow(homeId, itemId);
  return toSummary(item);
}

export async function updateItem(
  homeId: string,
  itemId: string,
  input: UpdateItemInput,
): Promise<ItemSummary> {
  const item = await findItemOrThrow(homeId, itemId);

  if (input.locationId !== undefined) {
    await assertLocationBelongsToHome(homeId, input.locationId);
    item.locationId = new Types.ObjectId(input.locationId);
  }
  if (input.name !== undefined) {
    item.name = input.name;
    item.normalizedName = normalizeName(input.name);
  }
  if (input.category !== undefined) item.category = input.category;
  if (input.quantity !== undefined) item.quantity = input.quantity;
  if (input.unit !== undefined) item.unit = input.unit;
  if (input.expiryDate !== undefined) item.expiryDate = input.expiryDate;
  if (input.purchaseDate !== undefined) item.purchaseDate = input.purchaseDate;
  if (input.barcode !== undefined) item.barcode = input.barcode;
  if (input.brand !== undefined) item.brand = input.brand;
  if (input.notes !== undefined) item.notes = input.notes;
  if (input.imageUrl !== undefined) item.imageUrl = input.imageUrl;
  if (input.reminderDaysBefore !== undefined) item.reminderDaysBefore = input.reminderDaysBefore;

  await item.save();
  return toSummary(item);
}

export async function deleteItem(homeId: string, itemId: string): Promise<void> {
  const item = await findItemOrThrow(homeId, itemId);
  await item.deleteOne();
}

type ListItemsResult = {
  items: ItemSummary[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
};

export async function listItems(homeId: string, query: ListItemsQuery): Promise<ListItemsResult> {
  const filter: FilterQuery<InventoryItemDocument> = { homeId };

  if (query.locationId) filter.locationId = query.locationId;
  if (query.category) filter.category = query.category;
  if (query.status) filter.status = query.status;
  if (query.barcode) filter.barcode = query.barcode;

  if (query.expiryWindow) {
    const days = Number(query.expiryWindow.replace('d', ''));
    const windowEnd = new Date();
    windowEnd.setDate(windowEnd.getDate() + days);
    filter.expiryDate = { $lte: windowEnd };
  }

  if (query.search) {
    filter.normalizedName = { $regex: normalizeName(query.search), $options: 'i' };
  }

  const sort: Record<string, 1 | -1> = {};
  if (query.sort) {
    const [field, direction] = query.sort.split(':');
    sort[field] = direction === 'desc' ? -1 : 1;
  } else {
    sort.createdAt = -1;
  }

  const skip = (query.page - 1) * query.limit;

  const [items, total] = await Promise.all([
    InventoryItem.find(filter).sort(sort).skip(skip).limit(query.limit),
    InventoryItem.countDocuments(filter),
  ]);

  return {
    items: items.map(toSummary),
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit) || 1,
    },
  };
}
