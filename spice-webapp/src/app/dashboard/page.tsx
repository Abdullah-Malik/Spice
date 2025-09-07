'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import MarkdownRenderer from '@/components/markdown-renderer';
import Sidebar from '@/components/sidebar';

interface SearchResult {
  title?: string;
  url: string;
}

interface Message {
  id: number;
  content: string;
  isUser: boolean;
  prompts?: string[];
  searchResults?: SearchResult[];
}

export default function DashboardPage() {
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [prompts, setPrompts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<string>();
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (currentPrompt.trim()) {
        setPrompts(prev => [...prev, currentPrompt.trim()]);
        setCurrentPrompt('');
      }
    }
  }, [currentPrompt]);

  const removePrompt = useCallback((index: number) => {
    setPrompts(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleGenerateInsights = useCallback(async () => {
    if (prompts.length === 0) return;

    setIsLoading(true);
    setError('');
    setSelectedMessageId(undefined); // Clear selection when generating new insights
    
    // Store prompts before clearing them
    const currentPrompts = [...prompts];
    
    try {
      // Get JWT token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      // Add user message with individual prompts
      const userMessage: Message = { 
        id: Date.now(), 
        content: '', 
        isUser: true,
        prompts: currentPrompts
      };
      setMessages(prev => [...prev, userMessage]);
      
      // Clear prompts after adding to messages
      setPrompts([]);
      
      // Scroll to bottom only when Generate Insights is clicked
      setTimeout(scrollToBottom, 100);
      
      // Make API call to backend
      const response = await fetch('http://localhost:3000/v1/insights/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          prompts: currentPrompts
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('token');
          router.push('/login');
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Parse the JSON response
      const data = await response.json();
      
      // Extract the insights and search results from the response structure
      const insights = data.results?.insights || 'No insights generated';
      const searchResults = data.results?.searchResults || [];
      
      // Add AI response message with search results
      const aiMessage: Message = { 
        id: Date.now() + 1, 
        content: insights, 
        isUser: false,
        searchResults: searchResults
      };
      setMessages(prev => [...prev, aiMessage]);
      
    } catch (error) {
      console.error('Error generating insights:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate insights');
      
      // Re-add the prompts back if there was an error
      setPrompts(currentPrompts);
    } finally {
      setIsLoading(false);
    }
  }, [prompts, router, scrollToBottom]);

  const handleMessageSelect = useCallback(async (messageId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`http://localhost:3000/v1/insights/${messageId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        
        // Clear current messages and set the selected conversation
        const userMessage: Message = {
          id: Date.now(),
          content: '',
          isUser: true,
          prompts: data.prompts || []
        };

        const aiMessage: Message = {
          id: Date.now() + 1,
          content: data.results?.insights || 'No insights found',
          isUser: false,
          searchResults: data.results?.searchResults || []
        };

        setMessages([userMessage, aiMessage]);
        setSelectedMessageId(messageId);
        setIsSidebarOpen(false); // Close sidebar after selection
        // Removed the setTimeout(scrollToBottom, 100); line
      }
    } catch (error) {
      console.error('Error fetching message:', error);
      setError('Failed to load selected message');
    }
  }, [router]);

  const handleNewChat = useCallback(() => {
    setMessages([]);
    setPrompts([]);
    setCurrentPrompt('');
    setSelectedMessageId(undefined);
    setError('');
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('previousMessages');
    router.push('/login');
  }, [router]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPrompt(e.target.value);
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-white">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
        onMessageSelect={handleMessageSelect}
        selectedMessageId={selectedMessageId}
      />

      {/* Header */}
      <header className="border-b border-white/10 bg-zinc-950 backdrop-blur-sm px-4 py-3">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-medium">
              Spice
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 text-sm border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {messages.length === 0 ? (
            // Welcome State
            <div className="flex flex-col items-center justify-center h-full px-4 py-20">
              <div className="text-center space-y-6">
                <div className="w-12 h-12 mx-auto bg-white rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-medium mb-2">Generate Insights</h2>
                  <p className="text-white/60 text-sm">
                    Add multiple prompts below and generate comprehensive insights
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // Messages
            <div className="space-y-4 p-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-4 ${msg.isUser ? 'justify-end' : ''}`}>
                  {!msg.isUser && (
                    <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center flex-shrink-0">
                      AI
                    </div>
                  )}
                  <div className={`${msg.isUser ? 'max-w-2xl' : 'max-w-4xl flex-1 min-w-0'}`}>
                    {msg.isUser ? (
                      // User message with individual prompts - vertically stacked
                      <div className="flex flex-col gap-2 items-end">
                        {msg.prompts?.map((prompt, index) => (
                          <div key={index} className="bg-[#006CFF] text-white px-4 py-2 rounded-2xl">
                            {prompt}
                          </div>
                        ))}
                      </div>
                    ) : (
                      // AI message with search results and markdown
                      <div className="space-y-3 max-w-full">
                        {/* Search Results - Horizontally Scrollable */}
                        {msg.searchResults && msg.searchResults.length > 0 && (
                          <div className="w-full max-w-full overflow-hidden">
                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hover">
                              {msg.searchResults.map((result, index) => (
                                <a
                                  key={index}
                                  href={result.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-shrink-0 w-[280px] bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-colors group"
                                >
                                  <div className="flex items-start gap-2">
                                    <svg className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                                    </svg>
                                    <div className="min-w-0 flex-1">
                                      <h4 className="text-sm font-medium text-white group-hover:text-blue-300 transition-colors line-clamp-2">
                                        {result.title || 'Untitled'}
                                      </h4>
                                      <p className="text-xs text-white/60 mt-1 truncate">
                                        {new URL(result.url).hostname}
                                      </p>
                                    </div>
                                  </div>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* AI Response */}
                        <div className="w-full">
                          <div className="inline-block p-4 rounded-2xl max-w-full">
                            <MarkdownRenderer content={msg.content} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  {msg.isUser && (
                    <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-medium">U</span>
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-4 min-h-[60vh]">
                  <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center flex-shrink-0">
                    AI
                  </div>
                  <div className="max-w-2xl">
                    <div className="inline-block p-3 rounded-2xl bg-white/10 border border-white/20">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* Invisible div for scrolling reference */}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </main>

      {/* Error Display */}
      {error && (
        <div className="mx-auto max-w-4xl px-4 py-2">
          <div className="bg-red-600/20 border border-red-500/30 rounded-lg px-4 py-2 text-red-200 text-sm">
            {error}
          </div>
        </div>
      )}

      {/* Bottom Input */}
      <div className="flex flex-col items-center justify-center mx-auto border border-white/10 bg-zinc-950 backdrop-blur-sm p-1 rounded-xl -translate-y-3 translate-x-4">
        <div className="w-full min-w-3xl max-w-3xl space-y-3 border-white/10 backdrop-blur-sm p-4">
          {/* Display Added Prompts */}
          {prompts.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
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
          
          {/* Input Field */}
          <div>
            <input
              type="text"
              value={currentPrompt}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Add a prompt and press Enter..."
              className="w-full px-4 py-4 bg-white/5 border border-white/5 rounded-xl focus:outline-none focus:ring-1 focus:ring-white/5 focus:border-white/5 placeholder-white/50 text-white shadow-lg shadow-black/20 transition-all duration-200 h-12"
              disabled={isLoading}
            />
          </div>

          {/* Generate Insights Button - Centered Below Input */}
          <div className="flex justify-center">
            <button
              onClick={handleGenerateInsights}
              disabled={prompts.length === 0 || isLoading}
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
                  Generate Insights
                </>
              )}
            </button>
          </div>
          
          <p className="text-xs text-white/40 text-center">
            Press Enter to add prompts • {prompts.length} prompt{prompts.length !== 1 ? 's' : ''} added
          </p>
        </div>
      </div>
    </div>
  );
}