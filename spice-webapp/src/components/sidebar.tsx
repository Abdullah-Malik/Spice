'use client';

import { useState, useEffect, useCallback } from 'react';

interface SidebarMessage {
  _id: string;
  prompts: string[];
  createdAt: string;
}

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onMessageSelect: (messageId: string) => void;
  selectedMessageId?: string;
}

export default function Sidebar({ isOpen, onToggle, onMessageSelect, selectedMessageId }: SidebarProps) {
  const [messages, setMessages] = useState<SidebarMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPreviousMessages = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('http://localhost:3000/v1/insights/user/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const formattedMessages = data.map((msg: any) => ({
          _id: msg._id,
          prompts: msg.prompts || [],
          createdAt: msg.createdAt,
        }));
        setMessages(formattedMessages);
        
        // Store in localStorage
        localStorage.setItem('previousMessages', JSON.stringify(formattedMessages));
      }
    } catch (error) {
      console.error('Error fetching previous messages:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Load from localStorage first
    const savedMessages = localStorage.getItem('previousMessages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
    
    // Then fetch fresh data
    fetchPreviousMessages();
  }, [fetchPreviousMessages]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const truncatePrompts = (prompts: string[]) => {
    if (prompts.length === 0) return 'No prompts';
    if (prompts.length === 1) return prompts[0].substring(0, 50) + (prompts[0].length > 50 ? '...' : '');
    return `${prompts[0].substring(0, 30)}... +${prompts.length - 1} more`;
  };

  return (
    <>
      {/* Sidebar Toggle Button */}
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-50 p-2 bg-zinc-800 hover:bg-zinc-700 border border-white/20 rounded-lg transition-colors"
      >
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/20 z-40" onClick={onToggle} />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-zinc-900 border-r border-white/10 transform transition-transform duration-300 z-50 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-white">Previous Insights</h2>
              <button
                onClick={onToggle}
                className="p-1 hover:bg-white/10 rounded transition-colors"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-8 text-white/60">
                <p className="text-sm">No previous insights found</p>
              </div>
            ) : (
              messages.map((message) => (
                <button
                  key={message._id}
                  onClick={() => onMessageSelect(message._id)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedMessageId === message._id
                      ? 'bg-blue-600/20 border-blue-500/50'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="space-y-2">
                    <p className="text-sm text-white font-medium line-clamp-2">
                      {truncatePrompts(message.prompts)}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/60">
                        {message.prompts.length} prompt{message.prompts.length !== 1 ? 's' : ''}
                      </span>
                      <span className="text-xs text-white/60">
                        {formatDate(message.createdAt)}
                      </span>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>

          <div className="p-4 border-t border-white/10">
            <button
              onClick={fetchPreviousMessages}
              disabled={isLoading}
              className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </div>
    </>
  );
}