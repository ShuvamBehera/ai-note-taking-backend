import React, { memo, useState, useCallback, useRef, useEffect } from 'react';
import { usePlannerAgent, useDebounce } from '@/hooks/useOptimizedFetch';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Brain, User, Lightbulb } from 'lucide-react';

// Performance Optimization: Memoized message component
const MessageBubble = memo(({ 
  message, 
  isUser, 
  timestamp 
}: {
  message: string;
  isUser: boolean;
  timestamp: Date;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
  >
    <div className={`flex max-w-[70%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isUser ? 'bg-blue-500 ml-2' : 'bg-purple-500 mr-2'
      }`}>
        {isUser ? (
          <User className="h-4 w-4 text-white" />
        ) : (
          <Brain className="h-4 w-4 text-white" />
        )}
      </div>
      <div className={`rounded-lg px-4 py-2 ${
        isUser 
          ? 'bg-blue-500 text-white' 
          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
      }`}>
        <p className="text-sm leading-relaxed">{message}</p>
        <p className="text-xs opacity-70 mt-1">
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  </motion.div>
));

MessageBubble.displayName = 'MessageBubble';

// Performance Optimization: Memoized suggestions component
const SuggestionChips = memo(({ 
  suggestions, 
  onSuggestionClick 
}: {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
}) => (
  <div className="flex flex-wrap gap-2 p-4 border-t border-gray-200 dark:border-gray-700">
    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2 w-full">
      <Lightbulb className="h-4 w-4 mr-1" />
      <span>Suggestions:</span>
    </div>
    {suggestions.map((suggestion, index) => (
      <button
        key={index}
        onClick={() => onSuggestionClick(suggestion)}
        className="px-3 py-1 text-sm bg-purple-100 hover:bg-purple-200 
                   dark:bg-purple-900/20 dark:hover:bg-purple-900/40
                   text-purple-700 dark:text-purple-300 rounded-full
                   transition-colors"
      >
        {suggestion}
      </button>
    ))}
  </div>
));

SuggestionChips.displayName = 'SuggestionChips';

// Performance Optimization: Virtual scrolling for messages
const MessageList = memo(({ 
  messages 
}: {
  messages: Array<{ user: string; ai: string; timestamp: Date; suggestions?: string[] }>;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div 
      ref={scrollRef}
      className="flex-1 overflow-y-auto p-4 space-y-4"
      style={{ maxHeight: 'calc(100vh - 300px)' }}
    >
      <AnimatePresence>
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <div>
              <Brain className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                AI Content Planner
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Start a conversation to get personalized content planning advice
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index}>
              <MessageBubble
                message={msg.user}
                isUser={true}
                timestamp={msg.timestamp}
              />
              <MessageBubble
                message={msg.ai}
                isUser={false}
                timestamp={msg.timestamp}
              />
            </div>
          ))
        )}
      </AnimatePresence>
    </div>
  );
});

MessageList.displayName = 'MessageList';

// Performance Optimization: Main planner tab component
const PlannerTab = memo(() => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { messages, sendMessage } = usePlannerAgent();
  
  // Performance Optimization: Debounce input for real-time features
  const debouncedInput = useDebounce(input, 300);

  // Performance Optimization: Memoized send handler
  const handleSend = useCallback(async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) return;

    setIsLoading(true);
    try {
      await sendMessage(trimmedInput);
      setInput('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, sendMessage]);

  // Performance Optimization: Memoized key handler
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  // Performance Optimization: Memoized suggestion handler
  const handleSuggestionClick = useCallback((suggestion: string) => {
    setInput(suggestion);
  }, []);

  // Memoized suggestions
  const suggestions = React.useMemo(() => [
    'Create a content calendar for this month',
    'What are trending topics in my niche?',
    'Suggest video ideas for my channel',
    'How can I improve my content engagement?',
    'Plan a product launch campaign'
  ], []);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <Brain className="h-6 w-6 mr-2 text-purple-500" />
          Content Planner AI
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
          Get strategic insights and planning advice for your content
        </p>
      </div>

      {/* Messages */}
      <MessageList messages={messages} />

      {/* Suggestions (show when no messages) */}
      {messages.length === 0 && (
        <SuggestionChips
          suggestions={suggestions}
          onSuggestionClick={handleSuggestionClick}
        />
      )}

      {/* Input */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex space-x-3">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask me about content planning, trends, or strategy..."
              className="w-full h-12 p-3 border border-gray-300 dark:border-gray-600 
                         rounded-lg resize-none focus:ring-2 focus:ring-purple-500 
                         focus:border-transparent dark:bg-gray-800 dark:text-white
                         pr-12"
              disabled={isLoading}
              rows={1}
            />
            <div className="absolute bottom-2 right-2 text-xs text-gray-500">
              {input.length}/500
            </div>
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 
                       text-white font-medium px-6 py-3 rounded-lg transition-colors
                       flex items-center space-x-2 min-w-[80px] justify-center"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
});

PlannerTab.displayName = 'PlannerTab';

export default PlannerTab;