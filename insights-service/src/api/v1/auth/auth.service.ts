import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as userRepository from '../users/users.repository';
import { CreateUserData } from '../users/users.repository';
import { InvalidCredentialsError } from '../../../types/error.types';

export const registerUser = async (userData: CreateUserData) => {
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

  const user = await userRepository.createUser({
    ...userData,
    password: hashedPassword,
  });

  const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET || '', { expiresIn: '24h' });

  const { password: _, ...userResponse } = user.toObject();

  return {
    user: userResponse,
    token,
  };
};

export const loginUser = async (email: string, password: string) => {
  const user = await userRepository.findOneUser({ email });
  if (!user) {
    throw new InvalidCredentialsError();
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new InvalidCredentialsError();
  }

  const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET || '', { expiresIn: '24h' });

  const { password: _, ...userResponse } = user.toObject();

  return {
    user: userResponse,
    token,
  };
};
