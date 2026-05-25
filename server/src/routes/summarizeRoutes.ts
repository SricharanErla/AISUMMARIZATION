import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { body } from 'express-validator';
import { env } from '../config/env';
import { validateRequest } from '../middleware/validate';
import {
  summarizeAudioHandler,
  summarizeFileHandler,
  summarizeTextHandler,
  summarizeYouTubeHandler,
} from '../controllers/summarizeController';

const router = Router();
const upload = multer({
  dest: path.join(process.cwd(), 'uploads'),
  limits: { fileSize: env.MAX_UPLOAD_SIZE },
});

router.post(
  '/text',
  [
    body('text').isLength({ min: 25 }).withMessage('Text must be at least 25 characters'),
    body('summaryType').isIn(['short', 'medium', 'detailed']),
    body('summaryLength').isIn(['paragraph', 'bullets', 'highlights']),
  ],
  validateRequest,
  summarizeTextHandler
);

router.post('/file', upload.single('file'), summarizeFileHandler);
router.post('/youtube', summarizeYouTubeHandler);
router.post('/audio', upload.single('file'), summarizeAudioHandler);

export default router;
