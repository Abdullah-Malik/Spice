'use client';

import MarkdownRenderer from '@/components/markdown-renderer';

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

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export default function MessageList({ messages, isLoading }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-4 py-20">
        <div className="text-center space-y-6">
          <div className="w-12 h-12 mx-auto bg-white rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-medium mb-2">Generate Brand Insights</h2>
            <p className="text-white/60 text-sm">
              Add your brand details and prompts to generate comprehensive insights
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {messages.map((msg) => (
        <div key={msg.id} className={`flex gap-4 ${msg.isUser ? 'justify-end' : ''}`}>
          {!msg.isUser && (
            <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center flex-shrink-0">
              AI
            </div>
          )}
          <div className={`${msg.isUser ? 'max-w-2xl' : 'flex-1 min-w-0'}`}>
            {msg.isUser ? (
              <UserMessage message={msg} />
            ) : (
              <AIMessage message={msg} />
            )}
          </div>
          {msg.isUser && (
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-medium">U</span>
            </div>
          )}
        </div>
      ))}
      {isLoading && <LoadingMessage />}
    </div>
  );
}

function UserMessage({ message }: { message: Message }) {
  return (
    <div className="flex flex-col gap-3 items-end">
      {/* Brand Information */}
      {message.brandName && (
        <div className="border border-[#006CFF]/60 rounded-2xl px-4 py-3 max-w-full">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#006CFF]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 3a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
              <span className="text-base font-medium text-[#006CFF]/90">Brand: {message.brandName}</span>
            </div>
            <p className="text-base text-white/80 leading-relaxed break-words">
              {message.brandDescription}
            </p>
          </div>
        </div>
      )}
      
      {/* Prompts */}
      {message.prompts?.map((prompt, index) => (
        <div key={index} className="bg-[#006CFF] text-base font-medium text-white px-4 py-2 rounded-2xl break-words">
          {prompt}
        </div>
      ))}
    </div>
  );
}

function AIMessage({ message }: { message: Message }) {
  return (
    <div className="space-y-3 w-full">
      {/* Search Results - Horizontally Scrollable */}
      {message.searchResults && message.searchResults.length > 0 && (
        <SearchResults results={message.searchResults} />
      )}
      
      {/* AI Response */}
      <div className="w-full">
        <div className="inline-block p-4 rounded-2xl max-w-full">
          <MarkdownRenderer content={message.content} />
        </div>
      </div>
    </div>
  );
}

function SearchResults({ results }: { results: SearchResult[] }) {
  return (
    <div className="w-full overflow-hidden">
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hover">
        {results.map((result, index) => (
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
  );
}

function LoadingMessage() {
  return (
    <div className="flex gap-4 min-h-[40vh]">
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
  );
}