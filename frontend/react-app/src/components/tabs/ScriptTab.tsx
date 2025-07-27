import React, { memo, useState, useMemo, useCallback } from 'react';
import { useScriptGen, useDebounce } from '@/hooks/useOptimizedFetch';
import { motion } from 'framer-motion';
import { Wand2, Copy, Download, RefreshCw } from 'lucide-react';

// Performance Optimization: Memoized input component
const PromptInput = memo(({ 
  value, 
  onChange, 
  disabled 
}: {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}) => (
  <div className="relative">
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      placeholder="Enter your script prompt here..."
      className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none 
                 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                 disabled:bg-gray-100 disabled:cursor-not-allowed
                 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
    />
    <div className="absolute bottom-2 right-2 text-xs text-gray-500">
      {value.length}/1000
    </div>
  </div>
));

PromptInput.displayName = 'PromptInput';

// Performance Optimization: Memoized script display component
const ScriptDisplay = memo(({ 
  script, 
  isLoading 
}: {
  script: string;
  isLoading: boolean;
}) => {
  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(script);
  }, [script]);

  const downloadScript = useCallback(() => {
    const blob = new Blob([script], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `script-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [script]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-2" />
          <p className="text-gray-600">Generating your script...</p>
        </div>
      </div>
    );
  }

  if (!script) {
    return (
      <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
        <div className="text-center">
          <Wand2 className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600">Your generated script will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="border border-gray-300 rounded-lg p-4 bg-white dark:bg-gray-800"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Generated Script
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={copyToClipboard}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 
                       rounded-md transition-colors flex items-center space-x-1"
          >
            <Copy className="h-4 w-4" />
            <span>Copy</span>
          </button>
          <button
            onClick={downloadScript}
            className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 
                       rounded-md transition-colors flex items-center space-x-1"
          >
            <Download className="h-4 w-4" />
            <span>Download</span>
          </button>
        </div>
      </div>
      <div className="prose prose-sm max-w-none">
        <pre className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
          {script}
        </pre>
      </div>
    </motion.div>
  );
});

ScriptDisplay.displayName = 'ScriptDisplay';

// Performance Optimization: Main script tab component
const ScriptTab = memo(() => {
  const [prompt, setPrompt] = useState('');
  const [generatedScript, setGeneratedScript] = useState('');
  
  // Performance Optimization: Debounce prompt input
  const debouncedPrompt = useDebounce(prompt, 500);
  
  const scriptGen = useScriptGen();

  // Performance Optimization: Memoized validation
  const isValidPrompt = useMemo(() => {
    return prompt.trim().length > 10 && prompt.length <= 1000;
  }, [prompt]);

  // Performance Optimization: Memoized generate handler
  const handleGenerate = useCallback(async () => {
    if (!isValidPrompt) return;
    
    try {
      const result = await scriptGen.mutateAsync(prompt);
      setGeneratedScript(result.choices?.[0]?.message?.content || 'No script generated');
    } catch (error) {
      console.error('Script generation failed:', error);
      setGeneratedScript('Failed to generate script. Please try again.');
    }
  }, [prompt, isValidPrompt, scriptGen]);

  // Performance Optimization: Memoized regenerate handler
  const handleRegenerate = useCallback(() => {
    if (generatedScript) {
      handleGenerate();
    }
  }, [generatedScript, handleGenerate]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Script Generator
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Create engaging scripts with AI assistance
        </p>
      </div>

      {/* Input Section */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Script Prompt
          </label>
          <PromptInput
            value={prompt}
            onChange={setPrompt}
            disabled={scriptGen.isLoading}
          />
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handleGenerate}
            disabled={!isValidPrompt || scriptGen.isLoading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 
                       text-white font-medium py-3 px-4 rounded-lg transition-colors
                       flex items-center justify-center space-x-2"
          >
            <Wand2 className="h-5 w-5" />
            <span>{scriptGen.isLoading ? 'Generating...' : 'Generate Script'}</span>
          </button>
          
          {generatedScript && (
            <button
              onClick={handleRegenerate}
              disabled={scriptGen.isLoading}
              className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 
                         text-white font-medium py-3 px-4 rounded-lg transition-colors
                         flex items-center space-x-2"
            >
              <RefreshCw className="h-5 w-5" />
              <span>Regenerate</span>
            </button>
          )}
        </div>
      </div>

      {/* Output Section */}
      <ScriptDisplay 
        script={generatedScript} 
        isLoading={scriptGen.isLoading}
      />

      {/* Error Display */}
      {scriptGen.error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4"
        >
          <p className="text-red-700">
            Error: {scriptGen.error.message || 'Failed to generate script'}
          </p>
        </motion.div>
      )}
    </div>
  );
});

ScriptTab.displayName = 'ScriptTab';

export default ScriptTab;