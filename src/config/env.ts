  import dotenv from 'dotenv';

  dotenv.config();

  export const config = {
    node_env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3000', 10),
    database_url: process.env.DATABASE_URL || 'file:./prisma/dev.db',
    jwt_secret: process.env.JWT_SECRET || 'secret',
  };