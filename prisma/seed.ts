import prisma from '../src/config/database';
import { Helpers } from '../src/utils/helpers';
import { Logger } from '../src/utils/logger';

export async function seedDatabase() {
  try {
    // Check if roles exist
    const roleCount = await prisma.role.count();
    if (roleCount > 0) {
      Logger.info('Database already seeded');
      return;
    }

    Logger.info('Seeding database...');

    // Create Roles
    const adminRole = await prisma.role.create({
      data: { name: 'ADMIN' },
    });

    const analystRole = await prisma.role.create({
      data: { name: 'ANALYST' },
    });

    const viewerRole = await prisma.role.create({
      data: { name: 'VIEWER' },
    });

    Logger.info('Roles created');

    // Create Permissions
    const permissions = [
      'CAN_CREATE_USER',
      'CAN_READ_USER',
      'CAN_UPDATE_USER',
      'CAN_DELETE_USER',
      'CAN_CREATE_TRANSACTION',
      'CAN_READ_TRANSACTION',
      'CAN_UPDATE_TRANSACTION',
      'CAN_DELETE_TRANSACTION',
      'CAN_VIEW_DASHBOARD',
    ];

    for (const perm of permissions) {
      await prisma.permission.create({ data: { code: perm } });
    }

    Logger.info('Permissions created');

    // Create Admin User
    await prisma.user.create({
      data: {
        email: 'admin@example.com',
        password: Helpers.hashPassword('Admin@123'),
        name: 'Admin User',
        roleId: adminRole.id,
      },
    });

    // Create Analyst User
    await prisma.user.create({
      data: {
        email: 'analyst@example.com',
        password: Helpers.hashPassword('Analyst@123'),
        name: 'Analyst User',
        roleId: analystRole.id,
      },
    });

    // Create Viewer User
    await prisma.user.create({
      data: {
        email: 'viewer@example.com',
        password: Helpers.hashPassword('Viewer@123'),
        name: 'Viewer User',
        roleId: viewerRole.id,
      },
    });

    Logger.info('Users created');

    // Create sample transactions
    const analyst = await prisma.user.findUnique({
      where: { email: 'analyst@example.com' },
    });

    if (analyst) {
      const categories = ['Salary', 'Bonus', 'Food', 'Transport', 'Utilities'];

      for (let i = 0; i < 10; i++) {
        await prisma.transaction.create({
          data: {
            userId: analyst.id,
            type: i % 2 === 0 ? 'INCOME' : 'EXPENSE',
            category: categories[i % categories.length],
            amount: Math.random() * 1000 + 100,
            date: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
            description: `Sample transaction ${i}`,
          },
        });
      }

      Logger.info('Sample transactions created');
    }

    Logger.info('✅ Database seeding complete!');
  } catch (error: any) {
    Logger.error('Seeding error', error);
    throw error;
  }
}

seedDatabase();