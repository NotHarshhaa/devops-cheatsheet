'use client';

import { useEffect, useState } from 'react';

interface GlobalLoaderProps {
  // Minimum loading time in milliseconds
  minimumLoadingTime?: number;
  // Optional message to display during loading
  loadingMessage?: string;
}

type Phase = 'loading' | 'fading' | 'gone';

export function GlobalLoader({
  minimumLoadingTime = 1200,
  loadingMessage = 'Loading DevOps Hub...',
}: GlobalLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<Phase>('loading');

  useEffect(() => {
    let finished = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const startTime = Date.now();

    const finish = () => {
      if (finished) return;
      finished = true;
      setProgress(100);
      // Fade out via CSS, then stop rendering entirely. Deliberately not
      // tied to a JS animation loop: a frozen/stalled animation must never
      // leave this full-screen overlay (or its click blocking) behind.
      timers.push(setTimeout(() => setPhase('fading'), 150));
      timers.push(setTimeout(() => setPhase('gone'), 550));
    };

    const progressInterval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const newProgress = Math.min(
        100,
        Math.floor(
          (elapsedTime / minimumLoadingTime) *
            100 *
            (1 + 0.1 * Math.log10(1 + elapsedTime / 300)),
        ),
      );
      setProgress(newProgress);
      if (newProgress >= 100) {
        clearInterval(progressInterval);
        finish();
      }
    }, 50);

    const handleLoad = () => {
      const actualLoadTime = Date.now() - startTime;
      timers.push(setTimeout(finish, Math.max(0, minimumLoadingTime - actualLoadTime)));
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    return () => {
      clearInterval(progressInterval);
      timers.forEach(clearTimeout);
      window.removeEventListener('load', handleLoad);
    };
  }, [minimumLoadingTime]);

  if (phase === 'gone') return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white dark:bg-gray-900 transition-opacity duration-300 ease-in-out ${
        phase === 'fading' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
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
    </div>
  );
}

export default GlobalLoader;
