import { app } from './app';
import { initializeConfig } from './config';
import { logger } from './config/logger';
import { connectDB } from './config/database';

async function startServer() {
  await initializeConfig();
  await connectDB();

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    logger.info(`🚀 Server is running on http://localhost:${PORT}`);
  });
}

startServer();
