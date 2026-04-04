import prisma from '../config/database';
import { Logger } from '../utils/logger';

export class TransactionService {
  static async createTransaction(
    userId: number,
    type: string,
    category: string,
    amount: number,
    date: Date,
    description?: string
  ) {
    try {
      const transaction = await prisma.transaction.create({
        data: {
          userId,
          type,
          category,
          amount,
          date: new Date(date),
          description,
        },
      });
      return transaction;
    } catch (error: any) {
      Logger.error('Error creating transaction', error);
      throw error;
    }
  }

  static async getTransactions(
    userId: number,
    page: number = 1,
    limit: number = 10,
    filters: {
      type?: string;
      category?: string;
      startDate?: string;
      endDate?: string;
    } = {}
  ) {
    const skip = (page - 1) * limit;

    const where: any = {
      userId,
      deletedAt: null,
    };

    // Filter by type (INCOME or EXPENSE)
    if (filters.type) {
      where.type = filters.type.toUpperCase();
    }

    // Filter by category
    if (filters.category) {
      where.category = {
        contains: filters.category,
      };
    }

    // Filter by date range
    if (filters.startDate || filters.endDate) {
      where.date = {};
      if (filters.startDate) {
        where.date.gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        where.date.lte = new Date(filters.endDate);
      }
    }

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date: 'desc' },
      }),
      prisma.transaction.count({ where }),
    ]);

    return { transactions, total, page, limit };
  }

  static async getTransactionById(id: number) {
    const transaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction || transaction.deletedAt) {
      throw new Error('Transaction not found');
    }

    return transaction;
  }

  static async updateTransaction(id: number, userId: number, data: any) {
    const transaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction || transaction.deletedAt) {
      throw new Error('Transaction not found');
    }

    if (transaction.userId !== userId) {
      throw new Error('Unauthorized');
    }

    const updated = await prisma.transaction.update({
      where: { id },
      data: {
        ...data,
        date: data.date ? new Date(data.date) : undefined,
      },
    });

    return updated;
  }

  static async deleteTransaction(id: number, userId: number) {
    const transaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction || transaction.deletedAt) {
      throw new Error('Transaction not found');
    }

    if (transaction.userId !== userId) {
      throw new Error('Unauthorized');
    }

    await prisma.transaction.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { message: 'Transaction deleted' };
  }
}