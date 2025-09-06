import { Request, Response, NextFunction } from 'express';
import * as userService from '../users/users.service';

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error: unknown) {
    next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.json(user);
  } catch (error: unknown) {
    next(error);
  }
};

export const getUserByEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.getUserByEmail(req.user!.email);

    res.json(user);
  } catch (error: unknown) {
    next(error);
  }
};
