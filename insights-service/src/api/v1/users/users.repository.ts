import { User } from '../users/users.model';

import { FilterQuery, UpdateQuery } from 'mongoose';

export const createUser = async (userData: any) => {
  return await User.create(userData);
};

export const findUserById = async (id: string) => {
  return await User.findById(id);
};

export const findOneUser = async (filter: FilterQuery<any>) => {
  return await User.findOne(filter);
};

export const findManyUsers = async (filter: FilterQuery<any> = {}) => {
  return await User.find(filter);
};

export const updateUserById = async (id: string, update: UpdateQuery<any>) => {
  return await User.findByIdAndUpdate(id, update, { new: true });
};

export const deleteUserById = async (id: string) => {
  return await User.findByIdAndDelete(id);
};