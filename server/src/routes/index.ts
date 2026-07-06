import { Router } from 'express';
import healthRoutes from './healthRoutes';
import authRoutes from './authRoutes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);

// Sprint 1+ ile eklenecek: homeRoutes, inventoryRoutes, shoppingRoutes, ...

export default router;
