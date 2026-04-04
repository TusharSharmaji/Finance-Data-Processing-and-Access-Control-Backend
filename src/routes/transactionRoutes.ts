import { Router } from 'express';
import { TransactionController } from '../controllers/transactionController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';

const router = Router();

router.use(authMiddleware);

// VIEWER, ANALYST, ADMIN can all view transactions
router.get('/', roleMiddleware(['ADMIN', 'ANALYST', 'VIEWER']), TransactionController.getTransactions);

// Only ADMIN and ANALYST can create transactions
router.post('/', roleMiddleware(['ADMIN', 'ANALYST']), TransactionController.createTransaction);

// Only ADMIN and ANALYST can update transactions
router.put('/:id', roleMiddleware(['ADMIN', 'ANALYST']), TransactionController.updateTransaction);

// Only ADMIN can delete transactions
router.delete('/:id', roleMiddleware(['ADMIN']), TransactionController.deleteTransaction);

export default router;