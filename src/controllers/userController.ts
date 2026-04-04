import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { ResponseFormatter } from '../utils/responseFormatter';
import { UserService } from '../services/userService';
import { UserValidator } from '../validators/userValidator';
import { Logger } from '../utils/logger';

export class UserController {
  static async createUser(req: AuthenticatedRequest, res: Response) {
    try {
      const { email, password, name, roleId } = req.body;

      const validation = UserValidator.validateCreateUser({
        email,
        password,
        name,
        roleId,
      });

      if (!validation.valid) {
        return ResponseFormatter.error(
          res,
          'Validation failed',
          400,
          validation.errors[0]
        );
      }

      const user = await UserService.createUser(email, password, name, roleId);

      Logger.info(`User created: ${email}`);

      ResponseFormatter.success(res, user, 'User created', 201);
    } catch (error: any) {
      Logger.error('Create user error', error);
      ResponseFormatter.error(res, error.message || 'Failed to create user', 400);
    }
  }

  static async getAllUsers(req: AuthenticatedRequest, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await UserService.getAllUsers(page, limit);

      ResponseFormatter.paginated(
        res,
        result.users,
        result.page,
        result.limit,
        result.total,
        'Users fetched'
      );
    } catch (error: any) {
      Logger.error('Fetch users error', error);
      ResponseFormatter.error(res, error.message || 'Failed to fetch users', 400);
    }
  }
}