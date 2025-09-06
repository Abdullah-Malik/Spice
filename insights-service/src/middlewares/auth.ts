import { Request, Response, NextFunction } from 'express';
import passport from '../config/passport';
import { AuthUser } from '../types/auth.types';
import { InvalidTokenError } from '../types/error.types';

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const middlewareFunction = passport.authenticate(
    'jwt',
    { session: false },
    (err: Error | null, user: AuthUser | false) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        throw new InvalidTokenError('Unauthorized - Invalid or expired token');
      }

      req.user = user;
      next();
    }
  );

  middlewareFunction(req, res, next);
}
