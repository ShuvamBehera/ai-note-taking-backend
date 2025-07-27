import React, { memo, Suspense, lazy } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PenTool, 
  Mic, 
  Video, 
  Calendar, 
  Brain,
  Loader2 
} from 'lucide-react';

// Performance Optimization: Lazy load tab components
const PlannerTab = lazy(() => import('./tabs/PlannerTab'));
const ScriptTab = lazy(() => import('./tabs/ScriptTab'));
const VoiceTab = lazy(() => import('./tabs/VoiceTab'));
const VideoTab = lazy(() => import('./tabs/VideoTab'));
const ScheduleTab = lazy(() => import('./tabs/ScheduleTab'));

// Performance Optimization: Memoized loading component
const LoadingSpinner = memo(() => (
  <div className="flex items-center justify-center h-64">
    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
    <span className="ml-2 text-gray-600">Loading...</span>
  </div>
));

LoadingSpinner.displayName = 'LoadingSpinner';

// Performance Optimization: Memoized tab trigger component
const TabTrigger = memo(({ 
  value, 
  icon: Icon, 
  label, 
  isActive 
}: {
  value: string;
  icon: React.ComponentType<any>;
  label: string;
  isActive: boolean;
}) => (
  <Tabs.Trigger
    value={value}
    className={`
      flex flex-col items-center justify-center px-4 py-2 text-xs font-medium
      transition-all duration-200 ease-in-out rounded-lg
      hover:bg-gray-100 dark:hover:bg-gray-800
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
      ${isActive 
        ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400' 
        : 'text-gray-600 dark:text-gray-400'
      }
    `}
  >
    <motion.div
      initial={false}
      animate={{ 
        scale: isActive ? 1.1 : 1,
        rotate: isActive ? 360 : 0
      }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20 
      }}
    >
      <Icon className="h-5 w-5 mb-1" />
    </motion.div>
    <span>{label}</span>
  </Tabs.Trigger>
));

TabTrigger.displayName = 'TabTrigger';

// Performance Optimization: Memoized tab content wrapper
const TabContent = memo(({ 
  value, 
  children 
}: {
  value: string;
  children: React.ReactNode;
}) => (
  <Tabs.Content 
    value={value}
    className="flex-1 p-4 focus:outline-none"
  >
    <AnimatePresence mode="wait">
      <motion.div
        key={value}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
        className="h-full"
      >
        <Suspense fallback={<LoadingSpinner />}>
          {children}
        </Suspense>
      </motion.div>
    </AnimatePresence>
  </Tabs.Content>
));

TabContent.displayName = 'TabContent';

// Performance Optimization: Main component with proper memoization
const BottomTabs = memo(() => {
  const [activeTab, setActiveTab] = React.useState('planner');

  // Performance Optimization: Memoized tab configuration
  const tabs = React.useMemo(() => [
    { value: 'planner', icon: Brain, label: 'Planner', component: PlannerTab },
    { value: 'script', icon: PenTool, label: 'Script', component: ScriptTab },
    { value: 'voice', icon: Mic, label: 'Voice', component: VoiceTab },
    { value: 'video', icon: Video, label: 'Video', component: VideoTab },
    { value: 'schedule', icon: Calendar, label: 'Schedule', component: ScheduleTab },
  ], []);

  // Performance Optimization: Memoized tab change handler
  const handleTabChange = React.useCallback((value: string) => {
    setActiveTab(value);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
      <Tabs.Root 
        value={activeTab} 
        onValueChange={handleTabChange}
        className="flex flex-col h-full"
      >
        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden">
          {tabs.map(({ value, component: Component }) => (
            <TabContent key={value} value={value}>
              <Component />
            </TabContent>
          ))}
        </div>

        {/* Bottom Navigation */}
        <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <Tabs.List className="flex justify-around items-center px-2 py-1 bg-gray-50 dark:bg-gray-800/50">
            {tabs.map(({ value, icon, label }) => (
              <TabTrigger
                key={value}
                value={value}
                icon={icon}
                label={label}
                isActive={activeTab === value}
              />
            ))}
          </Tabs.List>
        </div>
      </Tabs.Root>
    </div>
  );
});

BottomTabs.displayName = 'BottomTabs';

export default BottomTabs;