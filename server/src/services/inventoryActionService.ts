import { AuditLog, type AuditLogDocument } from '../models/AuditLog';
import { AppError } from '../middlewares/errorHandler';
import { findItemOrThrow, toSummary, type ItemSummary } from './inventoryService';
import * as shoppingService from './shoppingService';

type ActionResult = {
  item: ItemSummary;
};

async function applyStatusChange(
  homeId: string,
  userId: string,
  itemId: string,
  newStatus: 'consumed' | 'discarded' | 'frozen',
  action: AuditLogDocument['action'],
): Promise<ActionResult> {
  const item = await findItemOrThrow(homeId, itemId);

  if (item.status === newStatus) {
    throw new AppError(
      `Item is already ${newStatus}`,
      400,
      'INVALID_STATUS_TRANSITION',
    );
  }

  const previousStatus = item.status;
  item.status = newStatus;
  await item.save();

  await AuditLog.create({
    homeId,
    itemId: item._id,
    userId,
    action,
    previousStatus,
    newStatus,
  });

  return { item: toSummary(item) };
}

export function consumeItem(homeId: string, userId: string, itemId: string) {
  return applyStatusChange(homeId, userId, itemId, 'consumed', 'consumed');
}

export function discardItem(homeId: string, userId: string, itemId: string) {
  return applyStatusChange(homeId, userId, itemId, 'discarded', 'discarded');
}

export function freezeItem(homeId: string, userId: string, itemId: string) {
  return applyStatusChange(homeId, userId, itemId, 'frozen', 'frozen');
}

export async function takeDose(
  homeId: string,
  userId: string,
  itemId: string,
): Promise<ActionResult> {
  const item = await findItemOrThrow(homeId, itemId);

  if (item.category !== 'Medicine') {
    throw new AppError('Item is not a medicine', 400, 'NOT_A_MEDICINE');
  }

  const doseAmount = item.doseAmount ?? 1;
  const previousStatus = item.status;
  item.quantity = Math.max(0, item.quantity - doseAmount);
  await item.save();

  await AuditLog.create({
    homeId,
    itemId: item._id,
    userId,
    action: 'dose_taken',
    previousStatus,
    newStatus: item.status,
    metadata: { quantityAfter: item.quantity },
  });

  return { item: toSummary(item) };
}

export async function addToShopping(
  homeId: string,
  userId: string,
  itemId: string,
): Promise<ActionResult & { shoppingItem: Awaited<ReturnType<typeof shoppingService.addShoppingItem>> }> {
  const item = await findItemOrThrow(homeId, itemId);

  const shoppingItem = await shoppingService.addShoppingItem(
    homeId,
    userId,
    { name: item.name, quantity: 1, unit: item.unit, category: item.category },
    item._id.toString(),
  );

  await AuditLog.create({
    homeId,
    itemId: item._id,
    userId,
    action: 'added_to_shopping',
    previousStatus: item.status,
    metadata: { shoppingItemId: shoppingItem.id },
  });

  return { item: toSummary(item), shoppingItem };
}
