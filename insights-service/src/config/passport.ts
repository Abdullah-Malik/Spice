import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import * as userRepository from '../api/v1/users/users.repository';
import { JWTPayload } from '../types/auth.types';

const jwtOptions: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || '',
  algorithms: ['HS256'],
};

passport.use(
  new JwtStrategy(jwtOptions, async (payload: JWTPayload, done) => {
    try {
      const user = await userRepository.findUserById(payload.userId);

      if (user) {
        const { password: _, ...userWithoutPassword } = user.toObject();
        return done(null, userWithoutPassword);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  })
);

export const authenticateJWT = passport.authenticate('jwt', { session: false });

export default passport;
