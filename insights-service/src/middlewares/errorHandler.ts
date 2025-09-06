import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';
import { ErrorNames } from '../types/error.types';

export const errorHandler = (error: Error, req: Request, res: Response, _next: NextFunction) => {
  logger.error(
    {
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name,
      },
      request: {
        method: req.method,
        url: req.url,
        headers: req.headers,
        body: req.body,
        params: req.params,
        query: req.query,
        // userId: req.user?.id,
      },
    },
    'Error occurred'
  );

  if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    const duplicateField = extractDuplicateField(error.message);

    logger.warn(
      {
        duplicateField,
        action: 'duplicate_key_attempt',
      },
      'Duplicate key error occurred'
    );

    res.status(409).json({
      error: {
        message: `${duplicateField} already exists`,
        code: 'DUPLICATE_KEY_ERROR',
      },
    });
    return;
  }

  switch (error.name) {
    case ErrorNames.AUTHENTICATION_ERROR:
    case ErrorNames.INVALID_TOKEN_ERROR:
      res.status(401).json({
        error: {
          message: error.message,
        },
      });
      return;

    case ErrorNames.TOKEN_EXPIRED_ERROR:
      res.status(401).json({
        error: {
          message: error.message,
          code: 'TOKEN_EXPIRED',
        },
      });
      return;

    case ErrorNames.AUTHORIZATION_ERROR:
      res.status(403).json({
        error: {
          message: error.message,
        },
      });
      return;

    case ErrorNames.USER_ALREADY_EXISTS_ERROR:
      logger.warn(
        {
          email: req.body?.email,
          action: 'signup_attempt_duplicate',
        },
        'Duplicate user signup attempt'
      );

      res.status(409).json({
        error: {
          message: error.message,
        },
      });
      return;

    case ErrorNames.USER_NOT_FOUND_ERROR:
      res.status(401).json({
        error: {
          message: 'User not found',
        },
      });
      return;

    case ErrorNames.INVALID_CREDENTIALS_ERROR:
      res.status(401).json({
        error: {
          message: 'Invalid credentials',
        },
      });
      return;
  }

  res.status(500).json({
    error: {
      message: 'Internal Server Error',
    },
  });
  return;
};

function extractDuplicateField(errorMessage: string): string {
  const match = errorMessage.match(/dup key: \{ (\w+):/);
  return match ? match[1] : 'field';
}
