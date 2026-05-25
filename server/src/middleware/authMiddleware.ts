import type { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
  user?: { userId: string };
}

export const protect = (req: AuthRequest, _res: Response, next: NextFunction) => {
  req.user = { userId: 'local' };
  return next();
};
