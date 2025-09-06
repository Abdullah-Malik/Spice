import { AuthUser } from '../auth.types';

declare global {
  namespace Express {
    /* eslint-disable @typescript-eslint/no-empty-object-type */
    interface User extends AuthUser {}
  }
}
