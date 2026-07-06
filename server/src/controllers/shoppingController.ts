import type { Request, Response } from 'express';
import * as shoppingService from '../services/shoppingService';
import { sendSuccess } from '../utils/apiResponse';
import type {
  CreateShoppingItemInput,
  UpdateShoppingItemInput,
} from '../validations/shoppingValidation';

export async function listShoppingItemsHandler(req: Request, res: Response) {
  const status = req.query.status as 'pending' | 'checked' | undefined;
  const items = await shoppingService.listShoppingItems(req.params.homeId, status);
  sendSuccess(res, { items }, 'Shopping items fetched successfully');
}

export async function addShoppingItemHandler(req: Request, res: Response) {
  const item = await shoppingService.addShoppingItem(
    req.params.homeId,
    req.userId!,
    req.body as CreateShoppingItemInput,
  );
  sendSuccess(res, { item }, 'Shopping item added successfully', 201);
}

export async function updateShoppingItemHandler(req: Request, res: Response) {
  const item = await shoppingService.updateShoppingItem(
    req.params.homeId,
    req.params.itemId,
    req.body as UpdateShoppingItemInput,
  );
  sendSuccess(res, { item }, 'Shopping item updated successfully');
}

export async function toggleCheckHandler(req: Request, res: Response) {
  const item = await shoppingService.toggleCheck(req.params.homeId, req.params.itemId);
  sendSuccess(res, { item }, 'Shopping item check toggled successfully');
}

export async function deleteShoppingItemHandler(req: Request, res: Response) {
  await shoppingService.deleteShoppingItem(req.params.homeId, req.params.itemId);
  sendSuccess(res, null, 'Shopping item deleted successfully');
}
