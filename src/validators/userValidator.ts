export class UserValidator {
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validateLogin(data: any) {
    const errors: string[] = [];

    if (!this.validateEmail(data.email || '')) {
      errors.push('Invalid email');
    }

    if (!data.password || data.password.length < 6) {
      errors.push('Password must be at least 6 characters');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  static validateCreateUser(data: any) {
    const errors: string[] = [];

    if (!this.validateEmail(data.email || '')) {
      errors.push('Invalid email');
    }

    if (!data.password || data.password.length < 6) {
      errors.push('Password must be at least 6 characters');
    }

    if (!data.name || data.name.length < 2) {
      errors.push('Name must be at least 2 characters');
    }

    if (!data.roleId) {
      errors.push('Role ID is required');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}