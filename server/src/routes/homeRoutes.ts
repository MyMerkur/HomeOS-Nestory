import { Router } from 'express';
import { createHomeHandler, joinHomeHandler, listHomesHandler } from '../controllers/homeController';
import { getDashboardHandler } from '../controllers/dashboardController';
import { getSuggestionsHandler } from '../controllers/recipeController';
import { authenticate } from '../middlewares/authenticate';
import { validateBody, validateParams } from '../middlewares/validate';
import { requireHomeMembership } from '../middlewares/requireHomeMembership';
import { createHomeSchema, joinHomeSchema } from '../validations/homeValidation';
import { homeIdParamSchema } from '../validations/paramsValidation';
import { catchAsync } from '../utils/catchAsync';
import locationRoutes from './locationRoutes';
import inventoryRoutes from './inventoryRoutes';
import shoppingRoutes from './shoppingRoutes';

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
  '/:homeId/recipes/suggestions',
  validateParams(homeIdParamSchema),
  requireHomeMembership('viewer'),
  catchAsync(getSuggestionsHandler),
);

router.use('/:homeId/locations', locationRoutes);
router.use('/:homeId/items', inventoryRoutes);
router.use('/:homeId/shopping', shoppingRoutes);

export default router;
