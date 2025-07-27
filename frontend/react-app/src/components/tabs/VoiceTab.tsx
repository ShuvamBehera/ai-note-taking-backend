import React, { memo, useState, useCallback, useRef } from 'react';
import { useVoiceTTS } from '@/hooks/useOptimizedFetch';
import { motion } from 'framer-motion';
import { Mic, Play, Pause, Download, Volume2, Settings } from 'lucide-react';

const VoiceTab = memo(() => {
  const [text, setText] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [voiceSettings, setVoiceSettings] = useState({
    voice: 'alloy',
    speed: 1.0,
    pitch: 1.0
  });
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const voiceTTS = useVoiceTTS();

  const handleGenerate = useCallback(async () => {
    if (!text.trim()) return;
    
    try {
      const result = await voiceTTS.mutateAsync(text);
      setAudioUrl(result.audioUrl || '');
    } catch (error) {
      console.error('Voice generation failed:', error);
    }
  }, [text, voiceTTS]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Voice Generator
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Convert text to speech with AI voices
        </p>
      </div>

      <div className="space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to convert to speech..."
          className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none"
          disabled={voiceTTS.isLoading}
        />
        
        <button
          onClick={handleGenerate}
          disabled={!text.trim() || voiceTTS.isLoading}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 
                     text-white font-medium py-3 px-4 rounded-lg transition-colors
                     flex items-center justify-center space-x-2"
        >
          <Volume2 className="h-5 w-5" />
          <span>{voiceTTS.isLoading ? 'Generating...' : 'Generate Voice'}</span>
        </button>
      </div>

      {audioUrl && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-gray-300 rounded-lg p-4"
        >
          <h3 className="text-lg font-semibold mb-4">Generated Audio</h3>
          <div className="flex items-center space-x-4">
            <button className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full">
              <Play className="h-5 w-5" />
            </button>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full w-0"></div>
            </div>
            <button className="text-gray-600 hover:text-gray-800">
              <Download className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
});

VoiceTab.displayName = 'VoiceTab';
export default VoiceTab;