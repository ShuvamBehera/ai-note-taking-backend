import React, { memo } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorFallbackProps {
  error?: Error;
  resetError?: () => void;
}

const ErrorFallback = memo(({ error, resetError }: ErrorFallbackProps) => {
  const handleRefresh = () => {
    if (resetError) {
      resetError();
    } else {
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
        <div className="mb-4">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Something went wrong
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            We're sorry, but something unexpected happened. Please try refreshing the page.
          </p>
        </div>

        {error && process.env.NODE_ENV === 'development' && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-left">
            <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">
              Error Details:
            </h3>
            <pre className="text-xs text-red-700 dark:text-red-300 overflow-auto">
              {error.message}
            </pre>
          </div>
        )}

        <div className="flex space-x-3">
          <button
            onClick={handleRefresh}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Try Again</span>
          </button>
          <button
            onClick={handleGoHome}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <Home className="h-4 w-4" />
            <span>Go Home</span>
          </button>
        </div>
      </div>
    </div>
  );
});

ErrorFallback.displayName = 'ErrorFallback';

export default ErrorFallback;