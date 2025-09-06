import { Router } from 'express';
import userRouter from './users/users.router';
import authRouter from './auth/auth.router';
import insightsRouter from './insights/insights.router';

const v1Router = Router();

v1Router.use('/users', userRouter);
v1Router.use('/auth', authRouter);
v1Router.use('/insights', insightsRouter);

export { v1Router };
