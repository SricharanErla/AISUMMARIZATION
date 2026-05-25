import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, avatar } = req.body as {
    name: string;
    email: string;
    password?: string;
    avatar?: string;
  };

  void password;

  res.status(201).json({
    token: 'runtime-token',
    user: { id: 'local', name, email, avatar: avatar ?? '' },
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  res.json({
    token: 'runtime-token',
    user: { id: 'local', name: 'Explorer', email: (req.body as { email: string }).email, avatar: '' },
  });
});
