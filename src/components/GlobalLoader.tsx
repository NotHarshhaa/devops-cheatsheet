'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsLowEndDevice } from '@/hooks/useOptimizedAnimation';

interface GlobalLoaderProps {
  // Minimum loading time in milliseconds
  minimumLoadingTime?: number;
  // Optional message to display during loading
  loadingMessage?: string;
}

export function GlobalLoader({
  minimumLoadingTime = 1200,
  loadingMessage = 'Loading DevOps Hub...',
}: GlobalLoaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const isLowEnd = useIsLowEndDevice();

  useEffect(() => {
    // Simulate loading progress to provide better user feedback
    let startTime = Date.now();
    let progressInterval: NodeJS.Timeout;

    const updateProgress = () => {
      const elapsedTime = Date.now() - startTime;
      // Logarithmic progress that speeds up over time
      const newProgress = Math.min(
        100,
        Math.floor(
          (elapsedTime / minimumLoadingTime) * 100 *
          (1 + 0.1 * Math.log10(1 + elapsedTime / 300))
        )
      );

      setProgress(newProgress);

      if (newProgress >= 100) {
        clearInterval(progressInterval);
        // Add a small delay at 100% for a smoother transition
        setTimeout(() => setIsLoading(false), 200);
      }
    };

    // Start progress animation
    progressInterval = setInterval(updateProgress, 50);

    // Use DOMContentLoaded and load events to properly time the loader
    const handleLoad = () => {
      const actualLoadTime = Date.now() - startTime;

      if (actualLoadTime < minimumLoadingTime) {
        // If page loaded faster than our minimum time, continue the animation
        setTimeout(() => {
          clearInterval(progressInterval);
          setProgress(100);
          setTimeout(() => setIsLoading(false), 200);
        }, minimumLoadingTime - actualLoadTime);
      } else {
        // If page took longer than minimum time, complete soon
        clearInterval(progressInterval);
        setProgress(100);
        setTimeout(() => setIsLoading(false), 200);
      }
    };

    // If document already loaded, start closing animation
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    return () => {
      clearInterval(progressInterval);
      window.removeEventListener('load', handleLoad);
    };
  }, [minimumLoadingTime]);

  // Simplified version for low-end devices
  const variants = isLowEnd
    ? {
        visible: { opacity: 1 },
        hidden: { opacity: 0 },
      }
    : {
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: -20 },
      };

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial="visible"
          animate="visible"
          exit="hidden"
          variants={variants}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-gray-900"
        >
          <div className="w-24 h-24 mb-6 relative">
            <div className="absolute inset-0 border-t-4 border-r-4 border-blue-500 rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-b-4 border-l-4 border-purple-500 rounded-full animate-spin animate-reverse"></div>
            <div className="absolute inset-4 border-t-4 border-r-4 border-blue-400 rounded-full animate-spin animate-delay-150"></div>
          </div>

          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
            {loadingMessage}
          </h2>

          <div className="w-64 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
              style={{ width: `${progress}%`, transition: 'width 0.3s ease-out' }}
            ></div>
          </div>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {progress}% complete
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default GlobalLoader;
