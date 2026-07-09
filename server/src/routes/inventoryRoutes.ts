import { Router } from 'express';
import {
  createItemHandler,
  deleteItemHandler,
  getItemHandler,
  listItemsHandler,
  lookupProductByBarcodeHandler,
  updateItemHandler,
} from '../controllers/inventoryController';
import {
  addToShoppingHandler,
  consumeItemHandler,
  discardItemHandler,
  freezeItemHandler,
  takeDoseHandler,
} from '../controllers/inventoryActionController';
import { requireHomeMembership } from '../middlewares/requireHomeMembership';
import { validateBody, validateParams, validateQuery } from '../middlewares/validate';
import {
  homeBarcodeParamSchema,
  homeIdParamSchema,
  homeItemIdParamSchema,
} from '../validations/paramsValidation';
import {
  createItemSchema,
  listItemsQuerySchema,
  updateItemSchema,
} from '../validations/inventoryValidation';
import { catchAsync } from '../utils/catchAsync';

const router = Router({ mergeParams: true });

router.get(
  '/',
  validateParams(homeIdParamSchema),
  requireHomeMembership('viewer'),
  validateQuery(listItemsQuerySchema),
  catchAsync(listItemsHandler),
);

router.post(
  '/',
  validateParams(homeIdParamSchema),
  requireHomeMembership('member'),
  validateBody(createItemSchema),
  catchAsync(createItemHandler),
);

router.get(
  '/barcode-lookup/:barcode',
  validateParams(homeBarcodeParamSchema),
  requireHomeMembership('viewer'),
  catchAsync(lookupProductByBarcodeHandler),
);

router.get(
  '/:itemId',
  validateParams(homeItemIdParamSchema),
  requireHomeMembership('viewer'),
  catchAsync(getItemHandler),
);

router.patch(
  '/:itemId',
  validateParams(homeItemIdParamSchema),
  requireHomeMembership('member'),
  validateBody(updateItemSchema),
  catchAsync(updateItemHandler),
);

router.delete(
  '/:itemId',
  validateParams(homeItemIdParamSchema),
  requireHomeMembership('member'),
  catchAsync(deleteItemHandler),
);

router.post(
  '/:itemId/consume',
  validateParams(homeItemIdParamSchema),
  requireHomeMembership('member'),
  catchAsync(consumeItemHandler),
);

router.post(
  '/:itemId/discard',
  validateParams(homeItemIdParamSchema),
  requireHomeMembership('member'),
  catchAsync(discardItemHandler),
);

router.post(
  '/:itemId/freeze',
  validateParams(homeItemIdParamSchema),
  requireHomeMembership('member'),
  catchAsync(freezeItemHandler),
);

router.post(
  '/:itemId/add-to-shopping',
  validateParams(homeItemIdParamSchema),
  requireHomeMembership('member'),
  catchAsync(addToShoppingHandler),
);

router.post(
  '/:itemId/take-dose',
  validateParams(homeItemIdParamSchema),
  requireHomeMembership('member'),
  catchAsync(takeDoseHandler),
);

export default router;
