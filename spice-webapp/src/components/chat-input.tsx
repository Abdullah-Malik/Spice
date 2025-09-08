'use client';

import { useState, useCallback } from 'react';

interface ChatInputProps {
  currentPrompt: string;
  prompts: string[];
  brandName: string;
  brandDescription: string;
  isLoading: boolean;
  isFormValid: boolean;
  onCurrentPromptChange: (value: string) => void;
  onPromptsChange: (prompts: string[]) => void;
  onBrandNameChange: (value: string) => void;
  onBrandDescriptionChange: (value: string) => void;
  onGenerateInsights: () => void;
}

export default function ChatInput({
  currentPrompt,
  prompts,
  brandName,
  brandDescription,
  isLoading,
  isFormValid,
  onCurrentPromptChange,
  onPromptsChange,
  onBrandNameChange,
  onBrandDescriptionChange,
  onGenerateInsights,
}: ChatInputProps) {
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (currentPrompt.trim()) {
        onPromptsChange([...prompts, currentPrompt.trim()]);
        onCurrentPromptChange('');
      }
    }
  }, [currentPrompt, prompts, onPromptsChange, onCurrentPromptChange]);

  const removePrompt = useCallback((index: number) => {
    onPromptsChange(prompts.filter((_, i) => i !== index));
  }, [prompts, onPromptsChange]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onCurrentPromptChange(e.target.value);
  }, [onCurrentPromptChange]);

  return (
    <div className="flex flex-col items-center justify-center mx-auto border border-white/10 bg-zinc-950 backdrop-blur-sm p-1 rounded-xl -translate-y-3 translate-x-4">
      <div className="w-full min-w-3xl max-w-3xl space-y-4 border-white/10 backdrop-blur-sm p-4">

        {/* Prompts Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-white/70">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">Research Prompts</span>
          </div>

          {/* Display Added Prompts */}
          {prompts.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {prompts.map((prompt, index) => (
                <div key={index} className="flex items-center gap-2 bg-gray-950 border border-white/20 rounded-lg px-3 py-1.5 text-sm">
                  <span className="text-white">{prompt}</span>
                  <button
                    onClick={() => removePrompt(index)}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {/* Input Field for Prompts */}
          <input
            type="text"
            value={currentPrompt}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Add a research prompt and press Enter..."
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 placeholder-white/50 text-white text-sm"
            disabled={isLoading}
          />
        </div>

        {/* Brand Information Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-white/70">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 3a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">Brand Information</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              value={brandName}
              onChange={(e) => onBrandNameChange(e.target.value)}
              placeholder="Brand Name"
              className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 placeholder-white/50 text-white text-sm"
              disabled={isLoading}
            />
            <input
              value={brandDescription}
              onChange={(e) => onBrandDescriptionChange(e.target.value)}
              placeholder="Brand Description"
              className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 placeholder-white/50 text-white text-sm resize-none"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Generate Insights Button */}
        <div className="flex justify-center pt-2">
          <button
            onClick={onGenerateInsights}
            disabled={!isFormValid || isLoading}
            className="px-8 py-3 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-300 disabled:cursor-not-allowed text-black font-medium rounded-xl transition-colors duration-200 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-400 border-t-black rounded-full animate-spin"></div>
                Generating...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Generate Brand Insights
              </>
            )}
          </button>
        </div>
        
        <p className="text-xs text-white/40 text-center">
          Fill brand info • Add prompts • {prompts.length} prompt{prompts.length !== 1 ? 's' : ''} added
        </p>
      </div>
    </div>
  );
}