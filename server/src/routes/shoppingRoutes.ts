import { Router } from 'express';
import {
  addShoppingItemHandler,
  deleteShoppingItemHandler,
  getShoppingSuggestionsHandler,
  listShoppingItemsHandler,
  toggleCheckHandler,
  updateShoppingItemHandler,
} from '../controllers/shoppingController';
import { requireHomeMembership } from '../middlewares/requireHomeMembership';
import { validateBody, validateParams, validateQuery } from '../middlewares/validate';
import { homeIdParamSchema, homeShoppingItemIdParamSchema } from '../validations/paramsValidation';
import {
  createShoppingItemSchema,
  listShoppingItemsQuerySchema,
  updateShoppingItemSchema,
} from '../validations/shoppingValidation';
import { catchAsync } from '../utils/catchAsync';

const router = Router({ mergeParams: true });

router.get(
  '/items',
  validateParams(homeIdParamSchema),
  requireHomeMembership('viewer'),
  validateQuery(listShoppingItemsQuerySchema),
  catchAsync(listShoppingItemsHandler),
);

router.get(
  '/suggestions',
  validateParams(homeIdParamSchema),
  requireHomeMembership('viewer'),
  catchAsync(getShoppingSuggestionsHandler),
);

router.post(
  '/items',
  validateParams(homeIdParamSchema),
  requireHomeMembership('member'),
  validateBody(createShoppingItemSchema),
  catchAsync(addShoppingItemHandler),
);

router.patch(
  '/items/:itemId',
  validateParams(homeShoppingItemIdParamSchema),
  requireHomeMembership('member'),
  validateBody(updateShoppingItemSchema),
  catchAsync(updateShoppingItemHandler),
);

router.patch(
  '/items/:itemId/check',
  validateParams(homeShoppingItemIdParamSchema),
  requireHomeMembership('member'),
  catchAsync(toggleCheckHandler),
);

router.delete(
  '/items/:itemId',
  validateParams(homeShoppingItemIdParamSchema),
  requireHomeMembership('member'),
  catchAsync(deleteShoppingItemHandler),
);

export default router;
