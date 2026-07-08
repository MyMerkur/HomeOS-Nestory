import { Router } from 'express';
import {
  changePasswordHandler,
  getProfileHandler,
  registerPushTokenHandler,
  removePushTokenHandler,
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
import { registerPushTokenSchema } from '../validations/pushValidation';
import { catchAsync } from '../utils/catchAsync';

const router = Router();

router.use(authenticate);

router.get('/me', catchAsync(getProfileHandler));
router.patch('/me', validateBody(updateProfileSchema), catchAsync(updateProfileHandler));
router.patch('/me/password', validateBody(changePasswordSchema), catchAsync(changePasswordHandler));
router.patch('/me/settings', validateBody(updateUserSettingsSchema), catchAsync(updateSettingsHandler));
router.post(
  '/me/push-tokens',
  validateBody(registerPushTokenSchema),
  catchAsync(registerPushTokenHandler),
);
router.delete('/me/push-tokens/:token', catchAsync(removePushTokenHandler));

export default router;
