import { Router } from 'express';

import { userRouter } from './users/users.router';

const v1Router = Router();

v1Router.use('/users', userRouter);

export { v1Router };
