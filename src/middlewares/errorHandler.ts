import { Request, Response, NextFunction } from 'express';
import { ResponseFormatter } from '../utils/responseFormatter';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);
  ResponseFormatter.error(res, 'Internal server error', 500);
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  ResponseFormatter.error(res, `Route not found: ${req.path}`, 404);
};