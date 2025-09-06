import { Insight } from './insights.model';
import { FilterQuery } from 'mongoose';

export interface CreateInsightData {
  userId: string;
  prompts: string[];
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

export const findInsightsByUserId = async (userId: string) => {
  return await Insight.find({ userId }).sort({ createdAt: -1 });
};

export const deleteInsightById = async (id: string) => {
  return await Insight.findByIdAndDelete(id);
};
