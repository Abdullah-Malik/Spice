import dotenv from 'dotenv';
import { logger } from './logger';

/**
 * Initializes the application's configuration by loading environment variables.
 * In development, it uses the local .env file.
 * In a production environment, this fetches secrets from AWS Secrets Manager.
 */
export async function initializeConfig() {
  if (process.env.NODE_ENV === 'production') {
    logger.info('Running in production mode...');
  } else {
    logger.info('Running in development mode. Loading variables from .env file...');
    dotenv.config();
  }
}
