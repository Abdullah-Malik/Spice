import { Router } from 'express';
import { getUserById, getUserByEmail } from '../users/users.controller';
import { authenticate } from '../../../middlewares/auth';

const userRouter = Router();

userRouter.get('/:id', getUserById);
userRouter.get('/', authenticate, getUserByEmail);

export default userRouter;
