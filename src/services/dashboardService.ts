import prisma from '../config/database';
import { Helpers } from '../utils/helpers';

export class DashboardService {
  static async getSummary(userId?: number) {
    const where: any = { deletedAt: null };
    if (userId) where.userId = userId;

    const transactions = await prisma.transaction.findMany({ where });

    const totalIncome = transactions
      .filter((t: any) => t.type === 'INCOME')
      .reduce((sum: number, t: any) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter((t: any) => t.type === 'EXPENSE')
      .reduce((sum: number, t: any) => sum + t.amount, 0);

    const categoryMap = new Map<string, number>();
    transactions.forEach((t: any) => {
      const current = categoryMap.get(t.category) || 0;
      categoryMap.set(t.category, current + t.amount);
    });

    const categoryBreakdown = Array.from(categoryMap.entries()).map(
      ([category, total]) => ({
        category,
        total,
        percentage: Helpers.calculatePercentage(total, totalIncome + totalExpense),
      })
    );

    const recentTransactions = [...transactions]
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);

    return {
      totalIncome,
      totalExpense,
      netBalance: totalIncome - totalExpense,
      categoryBreakdown,
      recentTransactions,
    };
  }

  static async getMonthlyTrends(userId?: number) {
    const where: any = { deletedAt: null };
    if (userId) where.userId = userId;

    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: { date: 'asc' },
    });

    // Group by year-month
    const monthlyMap = new Map<string, { income: number; expense: number }>();

    transactions.forEach((t: any) => {
      const date = new Date(t.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!monthlyMap.has(key)) {
        monthlyMap.set(key, { income: 0, expense: 0 });
      }

      const entry = monthlyMap.get(key)!;
      if (t.type === 'INCOME') {
        entry.income += t.amount;
      } else {
        entry.expense += t.amount;
      }
    });

    const trends = Array.from(monthlyMap.entries()).map(([month, data]) => ({
      month,
      income: data.income,
      expense: data.expense,
      net: data.income - data.expense,
    }));

    return trends;
  }
}