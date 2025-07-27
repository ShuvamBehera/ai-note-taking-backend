import { useState, useCallback, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';

// Performance Optimization: Debounced fetch hook
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Performance Optimization: Optimized API client with caching
class APIClient {
  private baseURL: string;
  private cache = new Map();
  private pendingRequests = new Map();

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getCacheKey(url: string, options?: RequestInit): string {
    return `${url}-${JSON.stringify(options)}`;
  }

  async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const cacheKey = this.getCacheKey(url, options);

    // Performance Optimization: Return cached result if available
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < 300000) { // 5 minutes cache
        return cached.data;
      }
    }

    // Performance Optimization: Prevent duplicate requests
    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey);
    }

    const request = fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    }).then(async (response) => {
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      const data = await response.json();
      
      // Cache successful responses
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now(),
      });
      
      return data;
    }).finally(() => {
      this.pendingRequests.delete(cacheKey);
    });

    this.pendingRequests.set(cacheKey, request);
    return request;
  }

  clearCache() {
    this.cache.clear();
  }
}

export const apiClient = new APIClient('http://localhost:3001');

// Performance Optimization: Script generation hook with caching
export function useScriptGen() {
  const queryClient = useQueryClient();
  
  return useMutation(
    async (prompt: string) => {
      return apiClient.fetch('/api/generate', {
        method: 'POST',
        body: JSON.stringify({ prompt }),
      });
    },
    {
      onSuccess: (data) => {
        // Performance Optimization: Update cache with new data
        queryClient.setQueryData(['script', data.prompt], data);
      },
      // Performance Optimization: Retry on failure with exponential backoff
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    }
  );
}

// Performance Optimization: Voice TTS hook with caching
export function useVoiceTTS() {
  return useMutation(
    async (text: string) => {
      return apiClient.fetch('/api/voice', {
        method: 'POST',
        body: JSON.stringify({ text }),
      });
    },
    {
      retry: 2,
      retryDelay: 1000,
    }
  );
}

// Performance Optimization: Video generation hook
export function useVideoGen() {
  return useMutation(
    async (script: string) => {
      return apiClient.fetch('/api/video', {
        method: 'POST',
        body: JSON.stringify({ script }),
      });
    },
    {
      retry: 1,
      retryDelay: 2000,
    }
  );
}

// Performance Optimization: Scheduler hook with optimistic updates
export function useScheduler() {
  const queryClient = useQueryClient();
  
  return useMutation(
    async ({ date, content }: { date: string; content: any }) => {
      return apiClient.fetch('/api/schedule', {
        method: 'POST',
        body: JSON.stringify({ date, content }),
      });
    },
    {
      onMutate: async (newSchedule) => {
        // Cancel outgoing refetches
        await queryClient.cancelQueries(['schedules']);
        
        // Snapshot previous value
        const previousSchedules = queryClient.getQueryData(['schedules']);
        
        // Optimistically update
        queryClient.setQueryData(['schedules'], (old: any) => [
          ...(old || []),
          { ...newSchedule, id: Date.now(), status: 'pending' }
        ]);
        
        return { previousSchedules };
      },
      onError: (err, newSchedule, context) => {
        // Rollback on error
        queryClient.setQueryData(['schedules'], context?.previousSchedules);
      },
      onSettled: () => {
        // Refetch after error or success
        queryClient.invalidateQueries(['schedules']);
      },
    }
  );
}

// Performance Optimization: Planner hook with debounced input
export function usePlannerAgent() {
  const [messages, setMessages] = useState<any[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  const sendMessage = useCallback(async (message: string) => {
    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    
    try {
      const response = await fetch('http://localhost:3001/api/planner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
        signal: abortControllerRef.current.signal,
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      setMessages(prev => [...prev, { user: message, ai: data.reply }]);
      return data;
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Planner error:', error);
        throw error;
      }
    }
  }, []);
  
  return { messages, sendMessage };
}

// Performance Optimization: Resource preloader
export function useResourcePreloader() {
  const preloadResource = useCallback((url: string, type: 'script' | 'style' | 'image') => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    
    switch (type) {
      case 'script':
        link.as = 'script';
        break;
      case 'style':
        link.as = 'style';
        break;
      case 'image':
        link.as = 'image';
        break;
    }
    
    document.head.appendChild(link);
  }, []);
  
  return { preloadResource };
}