import type { RequestHandler } from 'express';
import { validationResult } from 'express-validator';
import { ApiError } from '../utils/errorResponse';

export const validateRequest: RequestHandler = (req, _res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return next(new ApiError(400, result.array().map((item) => item.msg).join(', ')));
  }
  return next();
};
