import React, { Suspense, ErrorBoundary } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import BottomTabs from './components/BottomTabs';
import ErrorFallback from './components/ErrorFallback';
import './App.css';

// Performance Optimization: Create QueryClient with optimized configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Performance Optimization: Cache for 5 minutes by default
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
      // Performance Optimization: Retry configuration
      retry: (failureCount, error: any) => {
        if (error?.status === 404) return false;
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Performance Optimization: Background refetch configuration
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
    },
  },
});

// Performance Optimization: Global loading component
const GlobalLoadingSpinner = React.memo(() => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Loading AutoCreator AI
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Initializing your creative workspace...
      </p>
    </div>
  </div>
));

GlobalLoadingSpinner.displayName = 'GlobalLoadingSpinner';

// Performance Optimization: Error boundary for the entire app
class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error Boundary:', error, errorInfo);
    
    // Performance Optimization: Report errors to monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Report to error tracking service
      // reportError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

// Performance Optimization: Memoized theme provider
const ThemeProvider = React.memo(({ children }: { children: React.ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true' ||
        window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  React.useEffect(() => {
    localStorage.setItem('darkMode', isDarkMode.toString());
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = React.useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      {children}
    </div>
  );
});

ThemeProvider.displayName = 'ThemeProvider';

// Performance Optimization: Main App component with proper optimization
function App() {
  // Performance Optimization: Preload critical resources
  React.useEffect(() => {
    // Preload critical fonts and assets
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = '/fonts/inter-var.woff2';
    link.as = 'font';
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);

    // Performance Optimization: Register service worker for caching
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registered: ', registration);
        })
        .catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
    }
  }, []);

  return (
    <AppErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <div className="App min-h-screen bg-gray-50 dark:bg-gray-900">
            <Suspense fallback={<GlobalLoadingSpinner />}>
              <BottomTabs />
            </Suspense>
          </div>
        </ThemeProvider>
        
        {/* Performance Optimization: DevTools only in development */}
        {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </QueryClientProvider>
    </AppErrorBoundary>
  );
}

export default App;