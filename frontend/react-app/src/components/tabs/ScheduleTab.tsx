import React, { memo, useState, useCallback } from 'react';
import { useScheduler } from '@/hooks/useOptimizedFetch';
import { motion } from 'framer-motion';
import { Calendar, Clock, Send, CheckCircle } from 'lucide-react';

const ScheduleTab = memo(() => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [content, setContent] = useState({
    title: '',
    description: '',
    platform: 'youtube'
  });
  
  const scheduler = useScheduler();

  const handleSchedule = useCallback(async () => {
    if (!selectedDate || !selectedTime || !content.title) return;
    
    const dateTime = `${selectedDate}T${selectedTime}`;
    
    try {
      await scheduler.mutateAsync({
        date: dateTime,
        content
      });
      
      // Reset form
      setSelectedDate('');
      setSelectedTime('');
      setContent({ title: '', description: '', platform: 'youtube' });
    } catch (error) {
      console.error('Scheduling failed:', error);
    }
  }, [selectedDate, selectedTime, content, scheduler]);

  const isValid = selectedDate && selectedTime && content.title.trim();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Content Scheduler
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Schedule your content for automatic publishing
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Publish Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Publish Time
            </label>
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Platform
            </label>
            <select
              value={content.platform}
              onChange={(e) => setContent(prev => ({ ...prev, platform: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg"
            >
              <option value="youtube">YouTube</option>
              <option value="tiktok">TikTok</option>
              <option value="instagram">Instagram</option>
              <option value="twitter">Twitter</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content Title
            </label>
            <input
              type="text"
              value={content.title}
              onChange={(e) => setContent(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter content title..."
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={content.description}
              onChange={(e) => setContent(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter content description..."
              className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none"
            />
          </div>
        </div>
      </div>

      <button
        onClick={handleSchedule}
        disabled={!isValid || scheduler.isLoading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 
                   text-white font-medium py-3 px-4 rounded-lg transition-colors
                   flex items-center justify-center space-x-2"
      >
        <Calendar className="h-5 w-5" />
        <span>{scheduler.isLoading ? 'Scheduling...' : 'Schedule Content'}</span>
      </button>

      {scheduler.isSuccess && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3"
        >
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span className="text-green-700">Content scheduled successfully!</span>
        </motion.div>
      )}
    </div>
  );
});

ScheduleTab.displayName = 'ScheduleTab';
export default ScheduleTab;