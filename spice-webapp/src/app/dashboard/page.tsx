'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [prompts, setPrompts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{id: number, text: string, isUser: boolean}>>([]);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (currentPrompt.trim()) {
        setPrompts(prev => [...prev, currentPrompt.trim()]);
        setCurrentPrompt('');
      }
    }
  };

  const removePrompt = (index: number) => {
    setPrompts(prev => prev.filter((_, i) => i !== index));
  };

  const handleGenerateInsights = async () => {
    if (prompts.length === 0) return;

    setIsLoading(true);
    
    try {
      // Add user message showing all prompts
      const userMessage = { 
        id: Date.now(), 
        text: `Generate insights for: ${prompts.join(', ')}`, 
        isUser: true 
      };
      setMessages(prev => [...prev, userMessage]);
      
      // Clear prompts after submission
      setPrompts([]);
      
      // Simulate AI response
      setTimeout(() => {
        const aiMessage = { 
          id: Date.now() + 1, 
          text: `Here are insights for your ${prompts.length} prompts: ${prompts.join(', ')}. This is a placeholder response.`, 
          isUser: false 
        };
        setMessages(prev => [...prev, aiMessage]);
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Error generating insights:', error);
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-zinc-950 backdrop-blur-sm px-4 py-3">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <h1 className="text-lg font-medium">
            Spice
          </h1>
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
                  <h2 className="text-2xl font-medium mb-2">Generate Business Insights</h2>
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
                <div key={msg.id} className={`flex gap-4 ${msg.isUser ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.isUser ? 'bg-zinc-800 border border-zinc-600' : 'bg-white text-black'
                  }`}>
                    {msg.isUser ? (
                      <span className="text-white font-medium">U</span>
                    ) : (
                      'AI'
                    )}
                  </div>
                  <div className={`max-w-2xl ${msg.isUser ? 'text-right' : ''}`}>
                    <div className={`inline-block p-3 rounded-2xl ${
                      msg.isUser 
                        ? 'bg-gray-300 text-black' 
                        : 'bg-white/10 '
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-4">
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
            </div>
          )}
        </div>
      </main>

      {/* Bottom Input */}
      <div className="flex flex-col items-center justify-center mx-auto border border-white/10 bg-zinc-950 backdrop-blur-sm p-1 rounded-xl -translate-y-3">
        <div className="w-full min-w-3xl space-y-3 border-white/10  backdrop-blur-sm p-4">
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
              onChange={(e) => setCurrentPrompt(e.target.value)}
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