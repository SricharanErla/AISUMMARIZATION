import type { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { asyncHandler } from '../utils/asyncHandler';
import { analyzeSentiment, extractKeywords, generateAnswer } from '../services/summaryService';

export const chatAssistant = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { context, question } = req.body as { context: string; question: string };
  const response = await generateAnswer(context, question);
  res.json(response);
});

export const keywordAssistant = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { text } = req.body as { text: string };
  const result = await extractKeywords(text);
  res.json(result);
});

export const sentimentAssistant = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { text } = req.body as { text: string };
  const result = await analyzeSentiment(text);
  res.json(result);
});
