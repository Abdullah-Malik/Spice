import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userResponse = await authService.registerUser(req.body);

    res.status(201).json(userResponse);
  } catch (error: unknown) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const result = await authService.loginUser(email, password);

    res.json(result);
  } catch (error: unknown) {
    next(error);
  }
};
