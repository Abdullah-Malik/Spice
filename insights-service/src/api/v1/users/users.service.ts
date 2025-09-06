import { UserAlreadyExistsError, UserNotFoundError } from '../../../types/error.types';
import * as userRepository from '../users/users.repository';

export const createUser = async (userData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  companyId: string;
}) => {
  const existingUser = await userRepository.findOneUser({ email: userData.email });
  if (existingUser) {
    throw new UserAlreadyExistsError(userData.email);
  }

  return await userRepository.createUser(userData);
};

export const getUserById = async (id: string) => {
  const user = await userRepository.findUserById(id);
  if (!user) {
    throw new UserNotFoundError(id);
  }
  return user;
};

export const getUserByEmail = async (email: string) => {
  const user = await userRepository.findOneUser({ email });

  if (!user) {
    throw new UserNotFoundError(email);
  }

  const { password: _, ...userData } = user.toObject();

  return userData;
};
