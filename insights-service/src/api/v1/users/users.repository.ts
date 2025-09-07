import { User } from '../users/users.model';
import { FilterQuery, UpdateQuery } from 'mongoose';

export interface CreateUserData {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  companyId?: string;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  companyId?: string;
}

export const createUser = async (userData: CreateUserData) => {
  return await User.create(userData);
};

export const findUserById = async (id: string) => {
  return await User.findById(id);
};

export const findOneUser = async (filter: FilterQuery<CreateUserData>) => {
  return await User.findOne(filter);
};

export const findManyUsers = async (filter: FilterQuery<CreateUserData> = {}) => {
  return await User.find(filter);
};

export const updateUserById = async (id: string, update: UpdateQuery<UpdateUserData>) => {
  return await User.findByIdAndUpdate(id, update, { new: true });
};

export const deleteUserById = async (id: string) => {
  return await User.findByIdAndDelete(id);
};
