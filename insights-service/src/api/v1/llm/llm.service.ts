import { generateText } from './llm.client';
import { GenerateOptions } from './llm.types';

export const generateInsights = async (
  context: string,
  brandName: string,
  brandDescription: string,
  options?: GenerateOptions
): Promise<string> => {
  try {
    const finalOptions = options || getDefaultGenerateOptions();

    // Pass the new brand-specific arguments to the prompt creation function
    const prompt = createInsightPrompt(context, brandName, brandDescription);

    const response = await generateText(prompt, finalOptions);
    return response || '';
  } catch (error) {
    console.error('Insight generation failed:', error);
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Insight generation failed: ${message}`);
  }
};

const createInsightPrompt = (context: string, brandName: string, brandDescription: string): string => {
  return `
    You are an expert Market Analyst AI. Your mission is to analyze provided web content and generate a concise, data-driven intelligence briefing for a brand marketer.

    **Your Client:**
    - Brand Name: ${brandName}
    - Brand Description: ${brandDescription}

    **Analysis Context (Scraped Web Content):**
    ---
    ${context}
    ---

    **Instructions:**
    1.  Carefully analyze the **Analysis Context** from the perspective of your client, **${brandName}**.
    2.  Your entire response must be in Markdown format.
    3.  If the context is insufficient to answer a section, explicitly state "Insufficient data in the provided context." Do not invent information.
    4.  Base all your analysis strictly on the provided text.
    5.  Begin your response immediately with the first Markdown header. Do not include any preamble.

    # Market Intelligence Briefing

    ## 1. Executive Summary
    Provide a 2-3 sentence high-level overview of the most critical findings in the text for a busy executive at ${brandName}.

    ## 2. Key Entities Mentioned
    Extract the key companies, products, or people mentioned in the text. Format as a bulleted list. This helps in tracking mentions and competitors.
    - Company/Product: [Name]
    - Company/Product: [Name]

    ## 3. Consumer Sentiment & Narrative
    Analyze the expressed sentiment (positive, negative, neutral) within the text. What is the overall story or narrative being told? Differentiate between the author's opinion and cited user feedback if possible.

    ## 4. Competitive Landscape
    - **Mentions:** List any direct or indirect competitors to ${brandName} mentioned in the text.
    - **Positioning:** How are these competitors positioned? What are their perceived strengths and weaknesses according to the text?
    - **${brandName}'s Position:** If ${brandName} is mentioned, how is it portrayed? If not mentioned, where could it have fit into the conversation?

    ## 5. Strategic Opportunities & Risks for ${brandName}
    Based *only* on the provided text, identify potential opportunities and risks for ${brandName}.
    - **Opportunities:** (e.g., market gaps, unmet needs, competitor weaknesses to exploit)
    - **Risks:** (e.g., emerging trends that threaten ${brandName}'s position, negative sentiment, strong competitor performance)

    ## 6. Actionable Recommendations
    Provide 2-3 specific, actionable recommendations for the marketing team at ${brandName} based on this analysis.
    1.  **Recommendation:** ... **Rationale:** ...
    2.  **Recommendation:** ... **Rationale:** ...

  `.trim();
};

export const getDefaultGenerateOptions = (): GenerateOptions => ({
  temperature: 0.7,
  maxTokens: 4096,
  topP: 0.8,
  topK: 40,
});
