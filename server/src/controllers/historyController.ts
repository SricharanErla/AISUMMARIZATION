import type { Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/errorResponse';
import { historyStore } from '../services/historyStore';

export const getHistory = asyncHandler(async (_req: any, res: Response) => {
  const summaries = historyStore.list();
  res.json({ summaries });
});

export const deleteHistoryItem = asyncHandler(async (req: any, res: Response) => {
  const deleted = historyStore.remove(req.params.id);
  if (!deleted) {
    throw new ApiError(404, 'Summary not found');
  }

  res.json({ message: 'Summary deleted successfully' });
});
