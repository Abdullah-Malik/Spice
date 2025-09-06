import * as insightsRepository from './insights.repository';

export const createInsight = async (userId: string, prompts: string[]) => {
  try {
    // Create initial insight record
    const insight = await insightsRepository.createInsight({
      userId,
      prompts,
    });

    return insight;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to create insight: ${message}`);
  }
};

export const getInsightById = async (id: string) => {
  const insight = await insightsRepository.findInsightById(id);
  if (!insight) {
    throw new Error('Insight not found');
  }
  return insight;
};

export const getInsightsByUserId = async (userId: string) => {
  return await insightsRepository.findInsightsByUserId(userId);
};

export const getAllInsights = async () => {
  return await insightsRepository.findManyInsights();
};

export const deleteInsight = async (id: string) => {
  const insight = await insightsRepository.findInsightById(id);
  if (!insight) {
    throw new Error('Insight not found');
  }
  return await insightsRepository.deleteInsightById(id);
};
