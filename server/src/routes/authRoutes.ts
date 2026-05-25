import { Router } from 'express';
import { body } from 'express-validator';
import { login, register } from '../controllers/authController';
import { validateRequest } from '../middleware/validate';

const router = Router();

router.post(
  '/register',
  [
    body('name').trim().isLength({ min: 2 }).withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  ],
  validateRequest,
  register
);

router.post(
  '/login',
  [body('email').isEmail().withMessage('Valid email is required'), body('password').notEmpty()],
  validateRequest,
  login
);

export default router;
