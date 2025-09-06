import * as insightsRepository from './insights.repository';
import * as webSearchService from '../web-search/web-search.service';

export const createInsight = async (userId: string, prompts: string[]) => {
  try {
    // Search for pages using the provided prompts
    const searchResults = await webSearchService.getSearchEngineResults(prompts);

    // Create insight record with search results
    const insight = await insightsRepository.createInsight({
      userId,
      prompts,
    });

    // Update the insight with search results using updateInsightById
    const updatedInsight = await insightsRepository.updateInsightById(insight.id, {
      results: [
        {
          prompts: prompts,
          searchResults: searchResults,
          content: [],
          insights: '',
          success: true,
        },
      ],
    });

    return updatedInsight || insight;
  } catch (error) {
    console.error('Create insight error:', error);
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
