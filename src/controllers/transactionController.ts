import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { ResponseFormatter } from '../utils/responseFormatter';
import { TransactionService } from '../services/transactionService';
import { TransactionValidator } from '../validators/transactionValidator';
import { Logger } from '../utils/logger';

export class TransactionController {
  static async createTransaction(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return ResponseFormatter.error(res, 'Not authenticated', 401);
      }

      const { type, category, amount, date, description } = req.body;

      const validation = TransactionValidator.validateCreateTransaction({
        type,
        category,
        amount,
        date,
      });

      if (!validation.valid) {
        return ResponseFormatter.error(
          res,
          'Validation failed',
          400,
          validation.errors[0]
        );
      }

      const transaction = await TransactionService.createTransaction(
        req.user.id,
        type,
        category,
        amount,
        date,
        description
      );

      Logger.info(`Transaction created: ${transaction.id}`);

      ResponseFormatter.success(res, transaction, 'Transaction created', 201);
    } catch (error: any) {
      Logger.error('Create transaction error', error);
      ResponseFormatter.error(
        res,
        error.message || 'Failed to create transaction',
        400
      );
    }
  }

  static async getTransactions(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return ResponseFormatter.error(res, 'Not authenticated', 401);
      }

      const pageStr = typeof req.query.page === 'string' ? req.query.page : '1';
      const limitStr = typeof req.query.limit === 'string' ? req.query.limit : '10';

      const page = parseInt(pageStr) || 1;
      const limit = parseInt(limitStr) || 10;

      const filters = {
        type: req.query.type as string | undefined,
        category: req.query.category as string | undefined,
        startDate: req.query.startDate as string | undefined,
        endDate: req.query.endDate as string | undefined,
      };

      const result = await TransactionService.getTransactions(
        req.user.id,
        page,
        limit,
        filters
      );

      ResponseFormatter.paginated(
        res,
        result.transactions,
        result.page,
        result.limit,
        result.total,
        'Transactions fetched'
      );
    } catch (error: any) {
      Logger.error('Fetch transactions error', error);
      ResponseFormatter.error(res, error.message || 'Failed to fetch transactions', 400);
    }
  }
  static async updateTransaction(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return ResponseFormatter.error(res, 'Not authenticated', 401);
      }

      const id = Array.isArray(req.params.id) ? req.params.id[0] : (req.params.id as string);
      const userId = req.user.id || 0;

      const transaction = await TransactionService.updateTransaction(
        parseInt(id),
        userId,
        req.body
      );

      Logger.info(`Transaction updated: ${id}`);

      ResponseFormatter.success(res, transaction, 'Transaction updated', 200);
    } catch (error: any) {
      Logger.error('Update transaction error', error);
      ResponseFormatter.error(
        res,
        error.message || 'Failed to update transaction',
        400
      );
    }
  }

  static async deleteTransaction(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return ResponseFormatter.error(res, 'Not authenticated', 401);
      }

      const id = Array.isArray(req.params.id) ? req.params.id[0] : (req.params.id as string);
      const userId = req.user.id || 0;

      await TransactionService.deleteTransaction(parseInt(id), userId);

      Logger.info(`Transaction deleted: ${id}`);

      ResponseFormatter.success(res, {}, 'Transaction deleted', 200);
    } catch (error: any) {
      Logger.error('Delete transaction error', error);
      ResponseFormatter.error(
        res,
        error.message || 'Failed to delete transaction',
        400
      );
    }
  }
}