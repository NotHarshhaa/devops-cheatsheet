"use client";

import React, { useState, useEffect, memo } from "react";
import Image, { ImageProps } from "next/image";
import { useInView } from "framer-motion";

interface OptimizedImageProps extends Omit<ImageProps, "onLoad" | "onError"> {
  fallbackSrc?: string;
  blurhash?: string;
  lazyBoundary?: string;
  lowResSrc?: string;
  aspectRatio?: number;
}

function OptimizedImageComponent({
  src,
  alt,
  width,
  height,
  className = "",
  fallbackSrc = "/placeholder.svg",
  blurhash,
  lazyBoundary = "200px",
  lowResSrc,
  aspectRatio,
  priority = false,
  quality = 85,
  sizes,
  ...rest
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const ref = React.useRef(null);
  // @ts-expect-error - Framer Motion types expect MarginType but string works fine
  const inView = useInView(ref, { once: true, margin: lazyBoundary });

  // Calculate aspect ratio styles
  const aspectRatioStyle = aspectRatio
    ? {
        aspectRatio: `${aspectRatio}`,
        objectFit: "cover" as const,
      }
    : {};

  // Set visibility when in view
  useEffect(() => {
    if (inView) {
      setIsVisible(true);
    }
  }, [inView]);

  // Get the actual src to display
  const displaySrc = hasError
    ? fallbackSrc
    : !isLoaded && lowResSrc
      ? lowResSrc
      : src;

  // Create blur placeholder if provided
  const placeholder = blurhash ? "blur" : "empty";
  const blurDataURL = blurhash || undefined;

  // Only use sizes if provided
  const sizesValue = sizes || undefined;

  // Calculate loading strategy
  const loadingStrategy = priority ? "eager" : "lazy";

  // Set default width and height for svg fallback if not provided
  const finalWidth = width || 100;
  const finalHeight = height || 100;

  return (
    <div
      ref={ref}
      className={`overflow-hidden relative ${className}`}
      style={aspectRatioStyle}
    >
      {/* Blur placeholder effect during loading */}
      {!isLoaded && !hasError && (
        <div
          className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse"
          style={{
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
        />
      )}

      {/* Only render image when in view or if priority is true */}
      {(isVisible || priority) && (
        <Image
          src={displaySrc}
          alt={alt}
          width={finalWidth}
          height={finalHeight}
          onLoadingComplete={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`transition-opacity duration-300 ${
            isLoaded ? "opacity-100" : "opacity-0"
          } backface-hidden`}
          placeholder={placeholder}
          blurDataURL={blurDataURL}
          loading={loadingStrategy}
          quality={quality}
          sizes={sizesValue}
          {...rest}
        />
      )}
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders
export const OptimizedImage = memo(OptimizedImageComponent);

export default OptimizedImage;
