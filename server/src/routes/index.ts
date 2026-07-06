import { Router } from 'express';
import healthRoutes from './healthRoutes';

const router = Router();

router.use('/health', healthRoutes);

// Sprint 1+ ile eklenecek: authRoutes, homeRoutes, inventoryRoutes, shoppingRoutes, ...

export default router;
