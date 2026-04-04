import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import transactionRoutes from './transactionRoutes';
import dashboardRoutes from './dashboardRoutes';

const router = Router();

router.use('/api/auth', authRoutes);
router.use('/api/users', userRoutes);
router.use('/api/transactions', transactionRoutes);
router.use('/api/dashboard', dashboardRoutes);

router.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

export default router;