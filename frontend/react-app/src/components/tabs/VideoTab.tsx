import React, { memo, useState, useCallback } from 'react';
import { useVideoGen } from '@/hooks/useOptimizedFetch';
import { motion } from 'framer-motion';
import { Video, Play, Download, Wand2 } from 'lucide-react';

const VideoTab = memo(() => {
  const [script, setScript] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [jobId, setJobId] = useState('');
  
  const videoGen = useVideoGen();

  const handleGenerate = useCallback(async () => {
    if (!script.trim()) return;
    
    try {
      const result = await videoGen.mutateAsync(script);
      setJobId(result.jobId || '');
      // Mock video URL for demo
      setTimeout(() => {
        setVideoUrl('https://example.com/generated-video.mp4');
      }, 3000);
    } catch (error) {
      console.error('Video generation failed:', error);
    }
  }, [script, videoGen]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Video Generator
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Create videos from scripts using AI
        </p>
      </div>

      <div className="space-y-4">
        <textarea
          value={script}
          onChange={(e) => setScript(e.target.value)}
          placeholder="Enter your video script..."
          className="w-full h-40 p-4 border border-gray-300 rounded-lg resize-none"
          disabled={videoGen.isLoading}
        />
        
        <button
          onClick={handleGenerate}
          disabled={!script.trim() || videoGen.isLoading}
          className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 
                     text-white font-medium py-3 px-4 rounded-lg transition-colors
                     flex items-center justify-center space-x-2"
        >
          <Video className="h-5 w-5" />
          <span>{videoGen.isLoading ? 'Generating Video...' : 'Generate Video'}</span>
        </button>
      </div>

      {jobId && !videoUrl && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-gray-300 rounded-lg p-6 text-center"
        >
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Video generation in progress...</p>
          <p className="text-sm text-gray-500">Job ID: {jobId}</p>
        </motion.div>
      )}

      {videoUrl && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-gray-300 rounded-lg p-4"
        >
          <h3 className="text-lg font-semibold mb-4">Generated Video</h3>
          <div className="bg-gray-200 rounded-lg h-48 flex items-center justify-center mb-4">
            <Play className="h-12 w-12 text-gray-600" />
          </div>
          <div className="flex space-x-3">
            <button className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg">
              <Play className="h-4 w-4 inline mr-2" />
              Play Video
            </button>
            <button className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg">
              <Download className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
});

VideoTab.displayName = 'VideoTab';
export default VideoTab;