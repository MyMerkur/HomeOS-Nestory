import { Router } from 'express';
import {
  createHomeHandler,
  joinHomeHandler,
  listHomesHandler,
  regenerateInviteCodeHandler,
  updateHomeHandler,
} from '../controllers/homeController';
import { getDashboardHandler } from '../controllers/dashboardController';
import {
  getAllRecipesHandler,
  getSavedRecipesHandler,
  saveRecipeHandler,
  unsaveRecipeHandler,
} from '../controllers/recipeController';
import { getBadgesHandler } from '../controllers/badgeController';
import {
  leaveHomeHandler,
  listMembersHandler,
  removeMemberHandler,
} from '../controllers/membershipController';
import { authenticate } from '../middlewares/authenticate';
import { validateBody, validateParams } from '../middlewares/validate';
import { requireHomeMembership } from '../middlewares/requireHomeMembership';
import { createHomeSchema, joinHomeSchema, updateHomeSchema } from '../validations/homeValidation';
import {
  homeIdParamSchema,
  homeRecipeIdParamSchema,
  homeUserIdParamSchema,
} from '../validations/paramsValidation';
import { catchAsync } from '../utils/catchAsync';
import locationRoutes from './locationRoutes';
import inventoryRoutes from './inventoryRoutes';
import shoppingRoutes from './shoppingRoutes';
import assetRoutes from './assetRoutes';
import billRoutes from './billRoutes';

const router = Router();

router.use(authenticate);

router.post('/', validateBody(createHomeSchema), catchAsync(createHomeHandler));
router.get('/', catchAsync(listHomesHandler));
router.post('/join', validateBody(joinHomeSchema), catchAsync(joinHomeHandler));
router.get(
  '/:homeId/dashboard',
  validateParams(homeIdParamSchema),
  requireHomeMembership('viewer'),
  catchAsync(getDashboardHandler),
);
router.get(
  '/:homeId/recipes',
  validateParams(homeIdParamSchema),
  requireHomeMembership('viewer'),
  catchAsync(getAllRecipesHandler),
);
router.get(
  '/:homeId/recipes/saved',
  validateParams(homeIdParamSchema),
  requireHomeMembership('viewer'),
  catchAsync(getSavedRecipesHandler),
);
router.post(
  '/:homeId/recipes/:recipeId/save',
  validateParams(homeRecipeIdParamSchema),
  requireHomeMembership('member'),
  catchAsync(saveRecipeHandler),
);
router.delete(
  '/:homeId/recipes/:recipeId/save',
  validateParams(homeRecipeIdParamSchema),
  requireHomeMembership('member'),
  catchAsync(unsaveRecipeHandler),
);
router.get(
  '/:homeId/badges',
  validateParams(homeIdParamSchema),
  requireHomeMembership('viewer'),
  catchAsync(getBadgesHandler),
);
router.patch(
  '/:homeId',
  validateParams(homeIdParamSchema),
  validateBody(updateHomeSchema),
  requireHomeMembership('owner'),
  catchAsync(updateHomeHandler),
);
router.post(
  '/:homeId/invite-code/regenerate',
  validateParams(homeIdParamSchema),
  requireHomeMembership('owner'),
  catchAsync(regenerateInviteCodeHandler),
);
router.get(
  '/:homeId/members',
  validateParams(homeIdParamSchema),
  requireHomeMembership('viewer'),
  catchAsync(listMembersHandler),
);
router.delete(
  '/:homeId/members/:userId',
  validateParams(homeUserIdParamSchema),
  requireHomeMembership('admin'),
  catchAsync(removeMemberHandler),
);
router.post(
  '/:homeId/leave',
  validateParams(homeIdParamSchema),
  requireHomeMembership('viewer'),
  catchAsync(leaveHomeHandler),
);

router.use('/:homeId/locations', locationRoutes);
router.use('/:homeId/items', inventoryRoutes);
router.use('/:homeId/shopping', shoppingRoutes);
router.use('/:homeId/assets', assetRoutes);
router.use('/:homeId/bills', billRoutes);

export default router;
