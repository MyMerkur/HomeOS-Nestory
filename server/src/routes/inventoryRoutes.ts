import { Router } from 'express';
import {
  createItemHandler,
  deleteItemHandler,
  getItemHandler,
  listItemsHandler,
  updateItemHandler,
} from '../controllers/inventoryController';
import { requireHomeMembership } from '../middlewares/requireHomeMembership';
import { validateBody, validateParams, validateQuery } from '../middlewares/validate';
import { homeIdParamSchema, homeItemIdParamSchema } from '../validations/paramsValidation';
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

export default router;
