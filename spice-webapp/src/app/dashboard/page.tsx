'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [message, setMessage] = useState('');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = { id: Date.now(), text: message, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    
    setIsLoading(true);
    setMessage('');
    
    try {
      // Simulate AI response
      setTimeout(() => {
        const aiMessage = { id: Date.now() + 1, text: "I'm a placeholder response. Your message has been received!", isUser: false };
        setMessages(prev => [...prev, aiMessage]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error submitting message:', error);
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/20 bg-black/50 backdrop-blur-sm px-4 py-3">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <h1 className="text-lg font-medium">
            Spice AI
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
                  <h2 className="text-2xl font-medium mb-2">How can I help you today?</h2>
                  <p className="text-white/60 text-sm">
                    Start a conversation by typing your message below
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
                    msg.isUser ? 'bg-blue-600' : 'bg-white text-black'
                  }`}>
                    {msg.isUser ? 'U' : 'AI'}
                  </div>
                  <div className={`max-w-2xl ${msg.isUser ? 'text-right' : ''}`}>
                    <div className={`inline-block p-3 rounded-2xl ${
                      msg.isUser 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white/10 border border-white/20'
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
      <div className="border-t border-white/20 bg-black/50 backdrop-blur-sm p-4">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Message Spice AI..."
              className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 placeholder-white/50 text-white shadow-lg shadow-black/20 transition-all duration-200"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!message.trim() || isLoading}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-white/60 hover:text-white disabled:text-white/30 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </form>
          <p className="text-xs text-white/40 text-center mt-2">
            Spice AI can make mistakes. Consider checking important information.
          </p>
        </div>
      </div>
    </div>
  );
}