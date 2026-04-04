import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { ResponseFormatter } from '../utils/responseFormatter';
import { DashboardService } from '../services/dashboardService';
import { Logger } from '../utils/logger';

export class DashboardController {
  static async getSummary(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return ResponseFormatter.error(res, 'Not authenticated', 401);
      }

      // ADMIN sees all users data, others see only their own
      const userId = req.user.role.name === 'ADMIN' ? undefined : req.user.id;

      const summary = await DashboardService.getSummary(userId);

      Logger.info(`Dashboard accessed by: ${req.user.id}`);

      ResponseFormatter.success(res, summary, 'Dashboard summary', 200);
    } catch (error: any) {
      Logger.error('Dashboard error', error);
      ResponseFormatter.error(res, error.message || 'Failed to fetch dashboard', 400);
    }
  }

  static async getMonthlyTrends(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return ResponseFormatter.error(res, 'Not authenticated', 401);
      }

      const userId = req.user.role.name === 'ADMIN' ? undefined : req.user.id;

      const trends = await DashboardService.getMonthlyTrends(userId);

      Logger.info(`Monthly trends accessed by: ${req.user.id}`);

      ResponseFormatter.success(res, trends, 'Monthly trends', 200);
    } catch (error: any) {
      Logger.error('Monthly trends error', error);
      ResponseFormatter.error(res, error.message || 'Failed to fetch trends', 400);
    }
  }
}