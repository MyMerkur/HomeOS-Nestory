import { Router } from 'express';
import {
  createAssetHandler,
  deleteAssetHandler,
  getAssetHandler,
  listAssetsHandler,
  updateAssetHandler,
} from '../controllers/assetController';
import { requireHomeMembership } from '../middlewares/requireHomeMembership';
import { validateBody, validateParams, validateQuery } from '../middlewares/validate';
import { homeAssetIdParamSchema, homeIdParamSchema } from '../validations/paramsValidation';
import { createAssetSchema, listAssetsQuerySchema, updateAssetSchema } from '../validations/assetValidation';
import { catchAsync } from '../utils/catchAsync';

const router = Router({ mergeParams: true });

router.get(
  '/',
  validateParams(homeIdParamSchema),
  requireHomeMembership('viewer'),
  validateQuery(listAssetsQuerySchema),
  catchAsync(listAssetsHandler),
);

router.post(
  '/',
  validateParams(homeIdParamSchema),
  requireHomeMembership('member'),
  validateBody(createAssetSchema),
  catchAsync(createAssetHandler),
);

router.get(
  '/:assetId',
  validateParams(homeAssetIdParamSchema),
  requireHomeMembership('viewer'),
  catchAsync(getAssetHandler),
);

router.patch(
  '/:assetId',
  validateParams(homeAssetIdParamSchema),
  requireHomeMembership('member'),
  validateBody(updateAssetSchema),
  catchAsync(updateAssetHandler),
);

router.delete(
  '/:assetId',
  validateParams(homeAssetIdParamSchema),
  requireHomeMembership('member'),
  catchAsync(deleteAssetHandler),
);

export default router;
