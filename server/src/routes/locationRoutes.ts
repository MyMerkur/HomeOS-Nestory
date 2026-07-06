import { Router } from 'express';
import {
  createLocationHandler,
  deleteLocationHandler,
  listLocationsHandler,
  updateLocationHandler,
} from '../controllers/locationController';
import { requireHomeMembership } from '../middlewares/requireHomeMembership';
import { validateBody, validateParams } from '../middlewares/validate';
import { homeIdParamSchema, homeLocationIdParamSchema } from '../validations/paramsValidation';
import { createLocationSchema, updateLocationSchema } from '../validations/locationValidation';
import { catchAsync } from '../utils/catchAsync';

const router = Router({ mergeParams: true });

router.get(
  '/',
  validateParams(homeIdParamSchema),
  requireHomeMembership('viewer'),
  catchAsync(listLocationsHandler),
);

router.post(
  '/',
  validateParams(homeIdParamSchema),
  requireHomeMembership('member'),
  validateBody(createLocationSchema),
  catchAsync(createLocationHandler),
);

router.patch(
  '/:locationId',
  validateParams(homeLocationIdParamSchema),
  requireHomeMembership('member'),
  validateBody(updateLocationSchema),
  catchAsync(updateLocationHandler),
);

router.delete(
  '/:locationId',
  validateParams(homeLocationIdParamSchema),
  requireHomeMembership('member'),
  catchAsync(deleteLocationHandler),
);

export default router;
