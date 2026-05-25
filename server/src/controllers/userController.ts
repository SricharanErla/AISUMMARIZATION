import type { Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/errorResponse';

export const getProfile = asyncHandler(async (_req: any, res: Response) => {
  res.json({
    user: { id: 'local', name: 'Explorer', email: 'local@runtime.app', avatar: '' },
  });
});

export const updateProfile = asyncHandler(async (req: any, res: Response) => {
  const { name, avatar } = req.body as { name?: string; avatar?: string };
  res.json({
    user: { id: 'local', name: name ?? 'Explorer', email: 'local@runtime.app', avatar: avatar ?? '' },
  });
});
