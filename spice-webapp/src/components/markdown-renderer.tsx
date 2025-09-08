import React, { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer = memo(function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-invert prose-sm max-w-none prose-headings:text-white prose-p:text-white prose-p:text-justify prose-li:text-white prose-strong:text-white prose-code:text-white prose-pre:bg-black/20 prose-pre:border prose-pre:border-white/20">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Headings with #EDEDED color
          h1: ({ children }) => (
            <h1 className="text-xl font-semibold mb-3 border-b border-gray-800 pb-2" style={{ color: '#EDEDED' }}>
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-semibold mb-2" style={{ color: '#EDEDED' }}>
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-semibold mb-2" style={{ color: '#EDEDED' }}>
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-sm font-semibold mb-1" style={{ color: '#EDEDED' }}>
              {children}
            </h4>
          ),
          // Paragraphs with #EDEDED color
          p: ({ children }) => (
            <p className="mb-3 text-base leading-relaxed" style={{ color: '#EDEDED' }}>
              {children}
            </p>
          ),
          // Lists with #EDEDED color and increased bottom spacing
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-8 space-y-2 text-base ml-3" style={{ color: '#EDEDED' }}>
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-8 space-y-2 text-base ml-3" style={{ color: '#EDEDED' }}>
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-base leading-relaxed mb-2 mt-2" style={{ color: '#EDEDED' }}>
              {children}
            </li>
          ),
          // Code styling with #EDEDED color
          code: ({ children, className }) => {
            const isInline = !className;
            return isInline ? (
              <code className="bg-gray-800 px-1 py-0.5 rounded text-sm font-mono" style={{ color: '#EDEDED' }}>
                {children}
              </code>
            ) : (
              <code className={`${className} text-base`} style={{ color: '#EDEDED' }}>{children}</code>
            );
          },
          pre: ({ children }) => (
            <pre className="bg-gray-900 border border-gray-700 rounded-lg p-3 overflow-x-auto mb-3 text-base" style={{ color: '#EDEDED' }}>
              {children}
            </pre>
          ),
          // Blockquotes with #EDEDED color
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-gray-600 pl-3 py-2 mb-3 text-base italic bg-gray-900/50 rounded-r" style={{ color: '#EDEDED' }}>
              {children}
            </blockquote>
          ),
          // Strong/Bold text with #EDEDED color
          strong: ({ children }) => (
            <strong className="font-semibold text-base" style={{ color: '#EDEDED' }}>
              {children}
            </strong>
          ),
          // Emphasis/Italic text with #EDEDED color
          em: ({ children }) => (
            <em className="italic text-base" style={{ color: '#EDEDED' }}>
              {children}
            </em>
          ),
          // Links - keep blue for visibility
          a: ({ children, href }) => (
            <a
              href={href}
              className="text-blue-400 hover:text-blue-300 underline transition-colors text-base"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          // Tables with #EDEDED color
          table: ({ children }) => (
            <div className="overflow-x-auto mb-3">
              <table className="min-w-full border border-gray-700 rounded-lg text-base">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gray-800">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="bg-gray-900">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="border-b border-gray-700">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-3 py-2 text-left font-semibold text-base" style={{ color: '#EDEDED' }}>
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-3 py-2 text-base" style={{ color: '#EDEDED' }}>
              {children}
            </td>
          ),
          // Horizontal rule
          hr: () => (
            <hr className="my-4 border-gray-700" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
});

export default MarkdownRenderer;