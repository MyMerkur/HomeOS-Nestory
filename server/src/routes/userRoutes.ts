import { Router } from 'express';
import {
  changePasswordHandler,
  getProfileHandler,
  updateProfileHandler,
  updateSettingsHandler,
} from '../controllers/userController';
import { authenticate } from '../middlewares/authenticate';
import { validateBody } from '../middlewares/validate';
import {
  changePasswordSchema,
  updateProfileSchema,
  updateUserSettingsSchema,
} from '../validations/userValidation';
import { catchAsync } from '../utils/catchAsync';

const router = Router();

router.use(authenticate);

router.get('/me', catchAsync(getProfileHandler));
router.patch('/me', validateBody(updateProfileSchema), catchAsync(updateProfileHandler));
router.patch('/me/password', validateBody(changePasswordSchema), catchAsync(changePasswordHandler));
router.patch('/me/settings', validateBody(updateUserSettingsSchema), catchAsync(updateSettingsHandler));

export default router;
