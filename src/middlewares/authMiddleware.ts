import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { ResponseFormatter } from '../utils/responseFormatter';
import { AuthenticatedRequest } from '../types';
import prisma from '../config/database';

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return ResponseFormatter.error(res, 'No token provided', 401);
    }

    const decoded = jwt.verify(token, config.jwt_secret) as any;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { role: true },
    });

    if (!user || user.deletedAt) {
      return ResponseFormatter.error(res, 'User not found', 401);
    }

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: {
        id: user.role.id,
        name: user.role.name,
      },
    };

    next();
  } catch (error: any) {
    ResponseFormatter.error(res, 'Invalid token', 401);
  }
};