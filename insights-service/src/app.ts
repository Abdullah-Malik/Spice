import express, { type Application, type Request, type Response } from 'express';
import cors from 'cors';
import { apiRouter } from './api';
import { logger } from './config/logger';
import { errorHandler } from './middlewares/errorHandler';
// import passport from './config/passport';
import pinoHttp from 'pino-http';

const app: Application = express();

// --- Global Middleware ---
app.use(
  pinoHttp({
    logger,
    // customProps: (req) => {
    //   return {
    //     userId: req.user?.id || undefined,
    //     userEmail: req.user?.email || undefined,
    //   };
    // },
  })
);
app.use(cors());
app.use(express.json());
//app.use(passport.initialize());

// --- API Routes ---
app.use(apiRouter);

// --- Health Check Route ---
app.get('/health', (req: Request, res: Response) => {
  logger.info('Health check endpoint was called');
  res.status(200).json({ status: 'OK' });
});

app.use(errorHandler);

export { app };
