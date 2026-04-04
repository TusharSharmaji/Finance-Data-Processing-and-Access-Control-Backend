import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { AuthenticatedRequest } from '../types';
import { ResponseFormatter } from '../utils/responseFormatter';
import { UserService } from '../services/userService';
import { UserValidator } from '../validators/userValidator';
import { Logger } from '../utils/logger';

export class AuthController {
  static async login(req: AuthenticatedRequest, res: Response) {
    try {
      const { email, password } = req.body;

      const validation = UserValidator.validateLogin({ email, password });
      if (!validation.valid) {
        return ResponseFormatter.error(
          res,
          'Validation failed',
          400,
          validation.errors[0]
        );
      }

      const user = await UserService.validateCredentials(email, password);

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        config.jwt_secret,
        { expiresIn: '24h' }
      );

      Logger.info(`User logged in: ${email}`);

      ResponseFormatter.success(
        res,
        { user, token },
        'Login successful',
        200
      );
    } catch (error: any) {
      Logger.error('Login error', error);
      ResponseFormatter.error(res, error.message || 'Login failed', 401);
    }
  }
}