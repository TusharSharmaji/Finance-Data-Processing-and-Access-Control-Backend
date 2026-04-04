import crypto from 'crypto';

export class Helpers {
  static hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  static comparePassword(password: string, hash: string): boolean {
    return crypto.createHash('sha256').update(password).digest('hex') === hash;
  }

  static calculatePercentage(value: number, total: number): number {
    if (total === 0) return 0;
    return parseFloat(((value / total) * 100).toFixed(2));
  }
}