import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
  loginHandler,
  logoutHandler,
  refreshHandler,
  registerHandler,
} from '../controllers/authController';
import { validateBody } from '../middlewares/validate';
import { loginSchema, refreshSchema, registerSchema } from '../validations/authValidation';
import { catchAsync } from '../utils/catchAsync';

const router = Router();

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

router.use(authRateLimiter);

router.post('/register', validateBody(registerSchema), catchAsync(registerHandler));
router.post('/login', validateBody(loginSchema), catchAsync(loginHandler));
router.post('/refresh', validateBody(refreshSchema), catchAsync(refreshHandler));
router.post('/logout', validateBody(refreshSchema), catchAsync(logoutHandler));

export default router;
