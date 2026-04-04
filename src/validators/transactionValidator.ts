import { TRANSACTION_TYPES } from '../config/constants';

export class TransactionValidator {
  static validateCreateTransaction(data: any) {
    const errors: string[] = [];

    if (!Object.values(TRANSACTION_TYPES).includes(data.type)) {
      errors.push('Type must be INCOME or EXPENSE');
    }

    if (!data.category) {
      errors.push('Category is required');
    }

    if (!data.amount || data.amount <= 0) {
      errors.push('Amount must be greater than 0');
    }

    if (!data.date) {
      errors.push('Date is required');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}