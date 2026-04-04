import express from 'express';
import cors from 'cors';
import { config } from './config/env';
import { Logger } from './utils/logger';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use(routes);

// 404 Handler
app.use(notFoundHandler);

// Error Handler
app.use(errorHandler);

// Start Server
const start = async () => {
  try {
    Logger.info(`Starting server on port ${config.port}`);

    app.listen(config.port, () => {
      Logger.info(`✅ Server running on http://localhost:${config.port}`);
      Logger.info(`📚 Health check: http://localhost:${config.port}/health`);
    });
  } catch (error: any) {
    Logger.error('Server startup error', error);
    process.exit(1);
  }
};

start();

export default app;