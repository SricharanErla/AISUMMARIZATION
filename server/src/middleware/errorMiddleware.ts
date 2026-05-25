import type { Request, Response, NextFunction } from 'express';
import { MulterError } from 'multer';
import { ApiError } from '../utils/errorResponse';

export const notFound = (_req: Request, _res: Response, next: NextFunction) => {
  next(new ApiError(404, 'Route not found'));
};

export const errorHandler = (err: Error | ApiError, _req: Request, res: Response, _next: NextFunction) => {
  const statusCode = err instanceof ApiError ? err.statusCode : err instanceof MulterError && err.code === 'LIMIT_FILE_SIZE' ? 413 : 500;
  const message = err instanceof MulterError && err.code === 'LIMIT_FILE_SIZE' ? 'File is too large. Please use a smaller file.' : err.message || 'Internal server error';
  // log full error for debugging
  // eslint-disable-next-line no-console
  console.error(err instanceof Error ? err.stack ?? err.message : String(err));
  res.status(statusCode).json({ message });
};
