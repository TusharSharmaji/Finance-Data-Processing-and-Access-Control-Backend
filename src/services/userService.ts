import prisma from '../config/database';
import { Helpers } from '../utils/helpers';
import { Logger } from '../utils/logger';

export class UserService {
  static async createUser(
    email: string,
    password: string,
    name: string,
    roleId: number
  ) {
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser && !existingUser.deletedAt) {
        throw new Error('User already exists');
      }

      const hashedPassword = Helpers.hashPassword(password);

      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          roleId,
        },
        include: { role: true },
      });

      const { password: pwd, ...userWithoutPassword }: any = user;
      return userWithoutPassword;
    } catch (error: any) {
      Logger.error('Error creating user', error);
      throw error;
    }
  }

  static async getUserById(id: number) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });

    if (!user || user.deletedAt) {
      throw new Error('User not found');
    }

    const { password: pwd, ...userWithoutPassword }: any = user;
    return userWithoutPassword;
  }

  static async getAllUsers(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: { deletedAt: null },
        include: { role: true },
        skip,
        take: limit,
      }),
      prisma.user.count({
        where: { deletedAt: null },
      }),
    ]);

    return {
      users: users.map(({ password: pwd, ...user }: any) => user),
      total,
      page,
      limit,
    };
  }

  static async validateCredentials(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user || user.deletedAt) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = Helpers.comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const { password: pwd, ...userWithoutPassword }: any = user;
    return userWithoutPassword;
  }
}