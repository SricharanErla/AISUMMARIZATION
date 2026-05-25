import { Router } from 'express';
import { deleteHistoryItem, getHistory } from '../controllers/historyController';

const router = Router();

router.get('/', getHistory);
router.delete('/:id', deleteHistoryItem);

export default router;
