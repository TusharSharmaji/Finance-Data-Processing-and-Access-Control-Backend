import { Response, NextFunction } from 'express';
import { ResponseFormatter } from '../utils/responseFormatter';
import { AuthenticatedRequest } from '../types';

export const roleMiddleware = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return ResponseFormatter.error(res, 'User not authenticated', 401);
    }

    if (!allowedRoles.includes(req.user.role.name)) {
      return ResponseFormatter.error(res, 'Access denied', 403);
    }

    next();
  };
};