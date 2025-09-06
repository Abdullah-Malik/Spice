import { Router } from 'express';
import { userRouter } from './users/users.router';
import { authRouter } from './auth/auth.router';

const v1Router = Router();

v1Router.use('/users', userRouter);
v1Router.use('/auth', authRouter);

export { v1Router };
