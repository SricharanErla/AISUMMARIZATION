import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import { getProfile, updateProfile } from '../controllers/userController';

const router = Router();

router.get('/me', protect, getProfile);
router.put('/me', protect, updateProfile);

export default router;
