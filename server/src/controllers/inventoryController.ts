import type { Request, Response } from 'express';
import * as inventoryService from '../services/inventoryService';
import { sendSuccess } from '../utils/apiResponse';
import type {
  CreateItemInput,
  ListItemsQuery,
  UpdateItemInput,
} from '../validations/inventoryValidation';

export async function listItemsHandler(req: Request, res: Response) {
  const result = await inventoryService.listItems(
    req.params.homeId,
    req.query as unknown as ListItemsQuery,
  );
  sendSuccess(res, result, 'Items fetched successfully');
}

export async function createItemHandler(req: Request, res: Response) {
  const item = await inventoryService.createItem(
    req.params.homeId,
    req.userId!,
    req.body as CreateItemInput,
  );
  sendSuccess(res, { item }, 'Item created successfully', 201);
}

export async function getItemHandler(req: Request, res: Response) {
  const item = await inventoryService.getItem(req.params.homeId, req.params.itemId);
  sendSuccess(res, { item }, 'Item fetched successfully');
}

export async function updateItemHandler(req: Request, res: Response) {
  const item = await inventoryService.updateItem(
    req.params.homeId,
    req.params.itemId,
    req.body as UpdateItemInput,
  );
  sendSuccess(res, { item }, 'Item updated successfully');
}

export async function deleteItemHandler(req: Request, res: Response) {
  await inventoryService.deleteItem(req.params.homeId, req.params.itemId);
  sendSuccess(res, null, 'Item deleted successfully');
}
