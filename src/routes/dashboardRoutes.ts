import { Router } from 'express';
import { DashboardController } from '../controllers/dashboardController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';

const router = Router();

router.use(authMiddleware);

// All roles can view dashboard
router.get('/summary', roleMiddleware(['ADMIN', 'ANALYST', 'VIEWER']), DashboardController.getSummary);

// Only ADMIN and ANALYST can view trends
router.get('/trends', roleMiddleware(['ADMIN', 'ANALYST']), DashboardController.getMonthlyTrends);

export default router;