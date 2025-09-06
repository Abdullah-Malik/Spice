import { Router } from 'express';
import { createUser, getUserById } from '../users/users.controller';

const router = Router();

router.post('/users', createUser);
router.get('/users/:id', getUserById);

export { router as userRouter };