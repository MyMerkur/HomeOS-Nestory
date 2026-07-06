import { Router } from 'express';
import { createHomeHandler, joinHomeHandler, listHomesHandler } from '../controllers/homeController';
import { authenticate } from '../middlewares/authenticate';
import { validateBody } from '../middlewares/validate';
import { createHomeSchema, joinHomeSchema } from '../validations/homeValidation';
import { catchAsync } from '../utils/catchAsync';

const router = Router();

router.use(authenticate);

router.post('/', validateBody(createHomeSchema), catchAsync(createHomeHandler));
router.get('/', catchAsync(listHomesHandler));
router.post('/join', validateBody(joinHomeSchema), catchAsync(joinHomeHandler));

export default router;
