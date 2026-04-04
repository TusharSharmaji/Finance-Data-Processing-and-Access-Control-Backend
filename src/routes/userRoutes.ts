import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';

const router = Router();

router.use(authMiddleware);

// Only ADMIN can create users
router.post('/', roleMiddleware(['ADMIN']), UserController.createUser);

// ADMIN and ANALYST can view all users
router.get('/', roleMiddleware(['ADMIN', 'ANALYST']), UserController.getAllUsers);

export default router;