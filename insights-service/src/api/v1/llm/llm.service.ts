import { generateText } from './llm.client';
import { GenerateOptions } from './llm.types';

export const generateInsights = async (context: string, options?: GenerateOptions): Promise<string> => {
  try {
    const finalOptions = options || getDefaultGenerateOptions();
    const prompt = createInsightPrompt(context);
    const response = await generateText(prompt, finalOptions);
    return response || '';
  } catch (error) {
    console.error('Insight generation failed:', error);
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Insight generation failed: ${message}`);
  }
};

const createInsightPrompt = (context: string): string => {
  return `
    You are Spice, Arrakis's advanced signal detection system for consumer brands. You analyze web content to help brands understand market trends, consumer sentiment, and competitive positioning.

    Based on the following web content, generate comprehensive market insights for brand marketers:

    Just start your response right away. Don't mention Spice or Arrakis.

    ${context}

    # Market Intelligence Report

    ## Executive Summary
    Provide a high-level overview of the key findings that would matter most to brand marketers and decision-makers.

    ## Consumer Sentiment Analysis
    Analyze what consumers are saying, feeling, and thinking about the topics discussed. Identify positive, negative, and neutral sentiment patterns.

    ## Market Trends & Opportunities
    Identify emerging trends, market gaps, and potential opportunities for brands to capitalize on.

    ## Competitive Landscape Insights
    Highlight competitive dynamics, market positioning insights, and differentiation opportunities.

    ## Strategic Recommendations
    Provide 3-5 actionable recommendations that brands can implement based on these insights.

    ## Risk Factors & Considerations
    Identify potential challenges, risks, or market headwinds that brands should be aware of.

    Present your analysis in a clear, professional format that would be valuable for marketing teams making strategic decisions.
  `.trim();
};

export const getDefaultGenerateOptions = (): GenerateOptions => ({
  temperature: 0.7,
  maxTokens: 4096,
  topP: 0.8,
  topK: 40,
});
