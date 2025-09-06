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
    throw new Error('User already exists');
  }

  return await userRepository.createUser(userData);
};

export const getUserById = async (id: string) => {
  const user = await userRepository.findUserById(id);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};
