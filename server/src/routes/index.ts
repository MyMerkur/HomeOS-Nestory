import { Router } from 'express';
import healthRoutes from './healthRoutes';
import authRoutes from './authRoutes';
import homeRoutes from './homeRoutes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/homes', homeRoutes);

// Sprint 2+ ile eklenecek: inventoryRoutes, shoppingRoutes, ...

export default router;
