'use client';

import { useState, useEffect, useCallback } from 'react';
import { Variants as FramerVariants } from 'framer-motion';

// Performance optimization: Check if running on a low-end device
export function useIsLowEndDevice() {
  const [isLowEnd, setIsLowEnd] = useState(false);

  useEffect(() => {
    // Check device capabilities
    const checkDeviceCapabilities = () => {
      // Device memory API (Chrome only)
      const hasLowMemory =
        // @ts-expect-error - deviceMemory is not in all browsers
        typeof navigator.deviceMemory !== 'undefined' && navigator.deviceMemory < 4;

      // Low end processors typically have fewer logical cores
      const hasLowCPU =
        typeof navigator.hardwareConcurrency !== 'undefined' &&
        navigator.hardwareConcurrency < 4;

      // Check for battery info (some browsers)
      const checkBattery = async () => {
        try {
          // @ts-expect-error - battery API is not standard
          if (navigator.getBattery) {
            // @ts-expect-error - Battery API is not standard
            const battery = await navigator.getBattery();
            return battery.charging === false && battery.level < 0.3;
          }
        } catch {
          // Ignore errors
        }
        return false;
      };

      // Calculate final result
      checkBattery().then(isLowBattery => {
        // Mark as low-end if at least two conditions are met
        const conditions = [
          window.innerWidth < 768, // Mobile screens
          hasLowMemory,
          hasLowCPU,
          isLowBattery,
          // Check if the browser lags when performing simple animations
          typeof window.requestAnimationFrame !== 'function'
        ];

        setIsLowEnd(conditions.filter(Boolean).length >= 2);
      });
    };

    checkDeviceCapabilities();
  }, []);

  return isLowEnd;
}

// Enhanced variants that include light versions for low-end devices
export interface OptimizedVariants {
  full: FramerVariants;
  light: FramerVariants;
}

// Hook to get the appropriate animation variant based on device capabilities
export function useOptimizedAnimation(
  variants: OptimizedVariants,
  prefersReducedMotion = false
) {
  const isLowEnd = useIsLowEndDevice();
  const [shouldUseReducedMotion, setShouldUseReducedMotion] = useState(prefersReducedMotion);

  useEffect(() => {
    // Check if user prefers reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => {
      setShouldUseReducedMotion(e.matches);
    };

    setShouldUseReducedMotion(mediaQuery.matches);

    // Add listener for changes
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      // For older browsers
      // @ts-expect-error - Legacy browser support
      mediaQuery.addListener(handleChange);
      // @ts-expect-error - Legacy browser support
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  // Return the appropriate variant based on device capabilities and user preferences
  const getOptimizedVariant = useCallback(() => {
    if (shouldUseReducedMotion || isLowEnd) {
      return variants.light;
    }
    return variants.full;
  }, [isLowEnd, shouldUseReducedMotion, variants]);

  return {
    optimizedVariants: getOptimizedVariant(),
    isLowEndDevice: isLowEnd,
    prefersReducedMotion: shouldUseReducedMotion
  };
}

// Default lightweight variant creators for common animations
export const createFadeInVariants = (duration: number = 0.5): OptimizedVariants => ({
  full: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        duration,
        bounce: 0.3
      }
    }
  },
  light: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        type: 'tween',
        duration: duration * 0.8
      }
    }
  }
});

export const createSlideInVariants = (
  direction: 'left' | 'right' | 'up' | 'down' = 'up',
  distance: number = 50,
  duration: number = 0.5
): OptimizedVariants => {
  const directionMap = {
    left: { x: -distance, y: 0 },
    right: { x: distance, y: 0 },
    up: { x: 0, y: -distance },
    down: { x: 0, y: distance }
  };

  const { x, y } = directionMap[direction];

  return {
    full: {
      hidden: { opacity: 0, x, y },
      visible: {
        opacity: 1,
        x: 0,
        y: 0,
        transition: {
          type: 'spring',
          duration,
          bounce: 0.3
        }
      }
    },
    light: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          type: 'tween',
          duration: duration * 0.8
        }
      }
    }
  };
};

export const createScaleVariants = (
  startScale: number = 0.95,
  duration: number = 0.5
): OptimizedVariants => ({
  full: {
    hidden: { opacity: 0, scale: startScale },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        duration,
        bounce: 0.3
      }
    }
  },
  light: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        type: 'tween',
        duration: duration * 0.7
      }
    }
  }
});

export default useOptimizedAnimation;
