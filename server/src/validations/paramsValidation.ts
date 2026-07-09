import { Types } from 'mongoose';
import { z } from 'zod';

export const objectId = z.string().refine((value) => Types.ObjectId.isValid(value), {
  message: 'Invalid id format',
});

export const homeIdParamSchema = z.object({
  homeId: objectId,
});

export const homeLocationIdParamSchema = z.object({
  homeId: objectId,
  locationId: objectId,
});

export const homeItemIdParamSchema = z.object({
  homeId: objectId,
  itemId: objectId,
});

export const homeBarcodeParamSchema = z.object({
  homeId: objectId,
  barcode: z.string().trim().min(1).max(64),
});

export const homeShoppingItemIdParamSchema = z.object({
  homeId: objectId,
  itemId: objectId,
});

export const homeRecipeIdParamSchema = z.object({
  homeId: objectId,
  recipeId: objectId,
});

export const homeAssetIdParamSchema = z.object({
  homeId: objectId,
  assetId: objectId,
});

export const homeUserIdParamSchema = z.object({
  homeId: objectId,
  userId: objectId,
});
