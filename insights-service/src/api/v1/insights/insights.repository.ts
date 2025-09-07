import { Insight, IInsightResult } from './insights.model';
import { FilterQuery, UpdateQuery } from 'mongoose';

export interface CreateInsightData {
  userId: string;
  prompts: string[];
}

export interface UpdateInsightData {
  results?: IInsightResult[];
  completedAt?: Date;
  status?: string;
  success?: boolean;
  error?: string;
}

export const createInsight = async (insightData: CreateInsightData) => {
  return await Insight.create(insightData);
};

export const findInsightById = async (id: string) => {
  return await Insight.findById(id);
};

export const findOneInsight = async (filter: FilterQuery<CreateInsightData>) => {
  return await Insight.findOne(filter);
};

export const findManyInsights = async (filter: FilterQuery<CreateInsightData> = {}) => {
  return await Insight.find(filter).sort({ createdAt: -1 });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const findInsightsByUserId = async (userId: string, projection?: any) => {
  return await Insight.find({ userId }, projection).sort({ createdAt: -1 });
};

export const updateInsightById = async (id: string, update: UpdateQuery<UpdateInsightData>) => {
  return await Insight.findByIdAndUpdate(id, update, { new: true });
};

export const deleteInsightById = async (id: string) => {
  return await Insight.findByIdAndDelete(id);
};
