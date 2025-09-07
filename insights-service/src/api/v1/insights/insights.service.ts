import * as insightsRepository from './insights.repository';
import * as webSearchService from '../web-search/web-search.service';
import * as webpageContentService from '../webpage-content/webpage-content.service';
import * as llmService from '../llm/llm.service';

export const createInsight = async (userId: string, prompts: string[]) => {
  try {
    // Search for pages using the provided prompts
    const searchResults = await webSearchService.getSearchEngineResults(prompts);

    // Extract URLs from search results
    const urls = searchResults.map((result) => result.url);

    // Extract content from the URLs
    const contentResults = await webpageContentService.extractContentFromWebPages(urls);

    // Generate insights using the extracted content
    const insights = await llmService.generateInsights(contentResults.context);

    // Create insight record with search results
    const insight = await insightsRepository.createInsight({
      userId,
      prompts,
    });

    // Update the insight with search results using updateInsightById
    const updatedInsight = await insightsRepository.updateInsightById(insight.id, {
      results: {
        prompts: prompts,
        searchResults: searchResults,
        content: contentResults.results,
        context: contentResults.context,
        insights: insights,
        success: true,
      },
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

export const getInsightsIDsByUserId = async (userId: string) => {
  return await insightsRepository.findInsightsByUserId(userId, {
    'results.content': 0,
    'results.context': 0,
    'results.insights': 0,
  });
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
