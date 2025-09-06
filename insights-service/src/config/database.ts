import mongoose from 'mongoose';
import { logger } from './logger';

const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || '';

    await mongoose.connect(mongoUri);

    logger.info('MongoDB connected successfully');

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    mongoose.connection.on('error', (error) => {
      logger.error('MongoDB connection error:', error);
    });
  } catch {
    logger.error('MongoDB connection failed');
    process.exit(1);
  }
};

const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.info('MongoDB disconnected successfully');
  } catch {
    logger.error('Error disconnecting from MongoDB:');
  }
};

export { connectDB, disconnectDB };
