/**
 * Performance utilities for the DevOps Cheatsheet application
 * These utilities help improve performance across different devices
 */

/**
 * Debounces a function call, ensuring it's not called too frequently
 * @param fn The function to debounce
 * @param delay The delay in milliseconds
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: NodeJS.Timeout | null = null;

  return function (...args: Parameters<T>) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

/**
 * Throttles a function call, ensuring it's not called more than once in a period
 * @param fn The function to throttle
 * @param limit The time limit in milliseconds
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  let lastArgs: Parameters<T> | null = null;

  return function (...args: Parameters<T>) {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
        if (lastArgs) {
          fn(...lastArgs);
          lastArgs = null;
        }
      }, limit);
    } else {
      lastArgs = args;
    }
  };
}

/**
 * Detects if the device is mobile based on screen size and user agent
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;

  const isMobileByUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

  const isMobileBySize = window.innerWidth < 768;

  return isMobileByUserAgent || isMobileBySize;
}

/**
 * Detects if the browser is running in a low-end device
 * Uses various signals like memory, cpu cores, battery, etc.
 */
export function isLowEndDevice(): boolean {
  if (typeof window === 'undefined') return false;

  // Low memory (less than 4GB, Chrome only)
  const hasLowMemory =
    // @ts-ignore - deviceMemory is not in all browsers
    typeof navigator.deviceMemory !== 'undefined' &&
    // @ts-ignore
    navigator.deviceMemory < 4;

  // Low CPU (fewer than 4 cores)
  const hasLowCPU =
    typeof navigator.hardwareConcurrency !== 'undefined' &&
    navigator.hardwareConcurrency < 4;

  // Simple CPU performance test
  let poorPerformance = false;
  const start = performance.now();
  for (let i = 0; i < 1000000; i++) {
    // Intentionally empty loop to test CPU performance
  }
  const end = performance.now();
  poorPerformance = (end - start) > 50; // If it takes more than 50ms, it's a slow device

  // Mobile device check
  const isMobile = isMobileDevice();

  // We consider it low-end if at least two conditions are met
  const factors = [
    hasLowMemory,
    hasLowCPU,
    poorPerformance,
    isMobile
  ].filter(Boolean);

  return factors.length >= 2;
}

/**
 * Lazy loads images when they enter the viewport
 * @param imageRef The reference to the image element
 * @param src The source URL of the image
 */
export function lazyLoadImage(
  imageRef: HTMLImageElement | null,
  src: string
): void {
  if (!imageRef || !src || typeof window === 'undefined') return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            imageRef.src = src;
            observer.unobserve(imageRef);
          }
        });
      },
      {
        rootMargin: '200px', // Load images 200px before they appear
        threshold: 0.01
      }
    );

    observer.observe(imageRef);
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    imageRef.src = src;
  }
}

/**
 * Detects if the user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Optimizes render performance by reducing unnecessary re-renders
 * @param callback The callback function to optimize
 * @param dependencies The dependencies array
 */
export function useOptimizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  dependencies: any[] = []
): T {
  // This is a simplified version of useCallback
  // In a real app, use React's useCallback instead
  let lastDeps = dependencies;
  let lastCallback = callback;

  const hasChanged = dependencies.some((dep, i) => dep !== lastDeps[i]);

  if (hasChanged) {
    lastDeps = dependencies;
    lastCallback = callback;
  }

  return lastCallback as T;
}

/**
 * Adds passive event listeners for better scrolling performance
 * @param element The DOM element to add the listener to
 * @param eventType The event type (e.g., 'scroll', 'touchstart')
 * @param callback The callback function
 */
export function addPassiveEventListener(
  element: HTMLElement | Window | Document,
  eventType: string,
  callback: EventListenerOrEventListenerObject
): () => void {
  element.addEventListener(eventType, callback, { passive: true });

  return () => {
    element.removeEventListener(eventType, callback);
  };
}

/**
 * RAF (Request Animation Frame) throttle for smooth animations
 * @param callback The callback function to throttle
 */
export function rafThrottle<T extends (...args: any[]) => any>(
  callback: T
): (...args: Parameters<T>) => void {
  let requestId: number | null = null;
  let lastArgs: Parameters<T> | null = null;

  return function (...args: Parameters<T>) {
    lastArgs = args;

    if (requestId === null) {
      requestId = requestAnimationFrame(() => {
        if (lastArgs) {
          callback(...lastArgs);
        }
        requestId = null;
      });
    }
  };
}

/**
 * Creates a memory-efficient memoized version of a function
 * @param fn The function to memoize
 * @param getKey A function that generates a cache key from the arguments
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  getKey: (...args: Parameters<T>) => string = (...args) => JSON.stringify(args)
): T {
  const cache = new Map<string, ReturnType<T>>();

  return function (...args: Parameters<T>): ReturnType<T> {
    const key = getKey(...args);

    if (cache.has(key)) {
      return cache.get(key) as ReturnType<T>;
    }

    const result = fn(...args);
    cache.set(key, result);

    // Limit cache size to prevent memory leaks
    if (cache.size > 100) {
      const firstKey = cache.keys().next().value;
      if (firstKey) {
        cache.delete(firstKey);
      }
    }

    return result;
  } as T;
}
