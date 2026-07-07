import { Asset, type AssetDocument } from '../models/Asset';
import { AppError } from '../middlewares/errorHandler';
import type { CreateAssetInput, ListAssetsQuery, UpdateAssetInput } from '../validations/assetValidation';

export type AssetSummary = {
  id: string;
  name: string;
  category: string;
  room: string | null;
  brand: string | null;
  serialNumber: string | null;
  purchaseDate: Date | null;
  price: number | null;
  warrantyEndDate: Date | null;
  receiptImageUrl: string | null;
  warrantyDocumentUrl: string | null;
  notes: string | null;
  reminderDaysBefore: number[];
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

export function toSummary(asset: AssetDocument & { _id: unknown }): AssetSummary {
  return {
    id: (asset._id as { toString(): string }).toString(),
    name: asset.name,
    category: asset.category,
    room: asset.room ?? null,
    brand: asset.brand ?? null,
    serialNumber: asset.serialNumber ?? null,
    purchaseDate: asset.purchaseDate ?? null,
    price: asset.price ?? null,
    warrantyEndDate: asset.warrantyEndDate ?? null,
    receiptImageUrl: asset.receiptImageUrl ?? null,
    warrantyDocumentUrl: asset.warrantyDocumentUrl ?? null,
    notes: asset.notes ?? null,
    reminderDaysBefore: asset.reminderDaysBefore ?? [],
    status: asset.status,
    createdAt: asset.createdAt as Date,
    updatedAt: asset.updatedAt as Date,
  };
}

export async function createAsset(
  homeId: string,
  userId: string,
  input: CreateAssetInput,
): Promise<AssetSummary> {
  const asset = await Asset.create({
    homeId,
    createdBy: userId,
    name: input.name,
    category: input.category,
    room: input.room,
    brand: input.brand,
    serialNumber: input.serialNumber,
    purchaseDate: input.purchaseDate,
    price: input.price,
    warrantyEndDate: input.warrantyEndDate,
    notes: input.notes,
    reminderDaysBefore: input.reminderDaysBefore,
  });

  return toSummary(asset);
}

export async function findAssetOrThrow(homeId: string, assetId: string) {
  const asset = await Asset.findOne({ _id: assetId, homeId });
  if (!asset) {
    throw new AppError('Asset not found', 404, 'ASSET_NOT_FOUND');
  }
  return asset;
}

export async function getAsset(homeId: string, assetId: string): Promise<AssetSummary> {
  const asset = await findAssetOrThrow(homeId, assetId);
  return toSummary(asset);
}

export async function updateAsset(
  homeId: string,
  assetId: string,
  input: UpdateAssetInput,
): Promise<AssetSummary> {
  const asset = await findAssetOrThrow(homeId, assetId);

  if (input.name !== undefined) asset.name = input.name;
  if (input.category !== undefined) asset.category = input.category;
  if (input.room !== undefined) asset.room = input.room;
  if (input.brand !== undefined) asset.brand = input.brand;
  if (input.serialNumber !== undefined) asset.serialNumber = input.serialNumber;
  if (input.purchaseDate !== undefined) asset.purchaseDate = input.purchaseDate;
  if (input.price !== undefined) asset.price = input.price;
  if (input.warrantyEndDate !== undefined) asset.warrantyEndDate = input.warrantyEndDate;
  if (input.notes !== undefined) asset.notes = input.notes;
  if (input.reminderDaysBefore !== undefined) asset.reminderDaysBefore = input.reminderDaysBefore;
  if (input.status !== undefined) asset.status = input.status;

  await asset.save();
  return toSummary(asset);
}

export async function deleteAsset(homeId: string, assetId: string): Promise<void> {
  const asset = await findAssetOrThrow(homeId, assetId);
  await asset.deleteOne();
}

type ListAssetsResult = {
  assets: AssetSummary[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
};

export async function listAssets(homeId: string, query: ListAssetsQuery): Promise<ListAssetsResult> {
  const filter: Record<string, unknown> = { homeId };
  if (query.status) filter.status = query.status;
  if (query.category) filter.category = query.category;

  const sort: Record<string, 1 | -1> = {};
  if (query.sort) {
    const [field, direction] = query.sort.split(':');
    sort[field] = direction === 'desc' ? -1 : 1;
  } else {
    sort.createdAt = -1;
  }

  const skip = (query.page - 1) * query.limit;

  const [assets, total] = await Promise.all([
    Asset.find(filter).sort(sort).skip(skip).limit(query.limit),
    Asset.countDocuments(filter),
  ]);

  return {
    assets: assets.map(toSummary),
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit) || 1,
    },
  };
}
