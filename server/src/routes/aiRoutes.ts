import { Router } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validate';
import { chatAssistant, keywordAssistant, sentimentAssistant } from '../controllers/aiController';

const router = Router();

router.post(
  '/chat',
  [body('context').isString(), body('question').isString().notEmpty()],
  validateRequest,
  chatAssistant
);

router.post('/keywords', [body('text').isString().notEmpty()], validateRequest, keywordAssistant);
router.post('/sentiment', [body('text').isString().notEmpty()], validateRequest, sentimentAssistant);

export default router;
