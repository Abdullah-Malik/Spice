'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/sidebar';
import ChatInput from '@/components/chat-input';
import MessageList from '@/components/message-list';

interface SearchResult {
  title?: string;
  url: string;
}

interface Message {
  id: number;
  content: string;
  isUser: boolean;
  prompts?: string[];
  brandName?: string;
  brandDescription?: string;
  searchResults?: SearchResult[];
}

export default function DashboardPage() {
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [prompts, setPrompts] = useState<string[]>([]);
  const [brandName, setBrandName] = useState('');
  const [brandDescription, setBrandDescription] = useState('');
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

  const handleGenerateInsights = useCallback(async () => {
    if (prompts.length === 0 || !brandName.trim() || !brandDescription.trim()) return;

    setIsLoading(true);
    setError('');
    setSelectedMessageId(undefined);
    
    // Store current values before clearing them
    const currentPrompts = [...prompts];
    const currentBrandName = brandName.trim();
    const currentBrandDescription = brandDescription.trim();
    
    try {
      // Get JWT token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      // Add user message with prompts and brand info
      const userMessage: Message = { 
        id: Date.now(), 
        content: '', 
        isUser: true,
        prompts: currentPrompts,
        brandName: currentBrandName,
        brandDescription: currentBrandDescription
      };
      setMessages(prev => [...prev, userMessage]);
      
      // Clear inputs after adding to messages
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
          prompts: currentPrompts,
          brandName: currentBrandName,
          brandDescription: currentBrandDescription
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
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
      
      // Re-add the values back if there was an error
      setPrompts(currentPrompts);
      setBrandName(currentBrandName);
      setBrandDescription(currentBrandDescription);
    } finally {
      setIsLoading(false);
    }
  }, [prompts, brandName, brandDescription, router, scrollToBottom]);

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
          prompts: data.prompts || [],
          // Note: Brand info might not be stored in the database yet
          brandName: data.brandName || '',
          brandDescription: data.brandDescription || ''
        };

        const aiMessage: Message = {
          id: Date.now() + 1,
          content: data.results?.insights || 'No insights found',
          isUser: false,
          searchResults: data.results?.searchResults || []
        };

        setMessages([userMessage, aiMessage]);
        setSelectedMessageId(messageId);
        setIsSidebarOpen(false);
      }
    } catch (error) {
      console.error('Error fetching message:', error);
      setError('Failed to load selected message');
    }
  }, [router]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('previousMessages');
    router.push('/login');
  }, [router]);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  const isFormValid = prompts.length > 0 && brandName.trim() && brandDescription.trim() ? true : false;

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
            <h1 className="text-lg font-medium">Spice</h1>
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
          <MessageList messages={messages} isLoading={isLoading} />
          <div ref={messagesEndRef} />
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
      <ChatInput
        currentPrompt={currentPrompt}
        prompts={prompts}
        brandName={brandName}
        brandDescription={brandDescription}
        isLoading={isLoading}
        isFormValid={isFormValid}
        onCurrentPromptChange={setCurrentPrompt}
        onPromptsChange={setPrompts}
        onBrandNameChange={setBrandName}
        onBrandDescriptionChange={setBrandDescription}
        onGenerateInsights={handleGenerateInsights}
      />
    </div>
  );
}