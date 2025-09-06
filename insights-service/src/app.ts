import express, { type Application } from 'express';
import cors from 'cors';
import { apiRouter } from './api';
import { logger } from './config/logger';
import { errorHandler } from './middlewares/errorHandler';
import passport from './config/passport';
import pinoHttp from 'pino-http';

const app: Application = express();

app.use(
  pinoHttp({
    logger,
    customProps: (req) => {
      return {
        userId: req.user?._id || undefined,
        userEmail: req.user?.email || undefined,
      };
    },
  })
);
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.use(apiRouter);

app.use(errorHandler);

export { app };
