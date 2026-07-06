import type { Request, Response } from 'express';
import * as inventoryActionService from '../services/inventoryActionService';
import { sendSuccess } from '../utils/apiResponse';

export async function consumeItemHandler(req: Request, res: Response) {
  const result = await inventoryActionService.consumeItem(
    req.params.homeId,
    req.userId!,
    req.params.itemId,
  );
  sendSuccess(res, result, 'Item marked as consumed');
}

export async function discardItemHandler(req: Request, res: Response) {
  const result = await inventoryActionService.discardItem(
    req.params.homeId,
    req.userId!,
    req.params.itemId,
  );
  sendSuccess(res, result, 'Item marked as discarded');
}

export async function freezeItemHandler(req: Request, res: Response) {
  const result = await inventoryActionService.freezeItem(
    req.params.homeId,
    req.userId!,
    req.params.itemId,
  );
  sendSuccess(res, result, 'Item marked as frozen');
}

export async function addToShoppingHandler(req: Request, res: Response) {
  const result = await inventoryActionService.addToShopping(
    req.params.homeId,
    req.userId!,
    req.params.itemId,
  );
  sendSuccess(res, result, 'Item added to shopping list', 201);
}
