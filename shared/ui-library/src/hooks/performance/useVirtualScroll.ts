import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

/**
 * Hook for virtual scrolling with performance optimizations
 * Handles large datasets efficiently by only rendering visible items
 */
export interface VirtualScrollConfig {
  itemHeight: number | ((index: number) => number);
  containerHeight: number;
  itemCount: number;
  overscan?: number;
  scrollingDelay?: number;
}

export function useVirtualScroll<T = any>({
  itemHeight,
  containerHeight,
  itemCount,
  overscan = 5,
  scrollingDelay = 150,
}: VirtualScrollConfig) {
  const [scrollTop, setScrollTop] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const getItemHeight = useCallback(
    (index: number) => {
      return typeof itemHeight === 'function' ? itemHeight(index) : itemHeight;
    },
    [itemHeight]
  );

  const { startIndex, endIndex, totalHeight, offsetY } = useMemo(() => {
    let startIdx = 0;
    let endIdx = 0;
    let accumulatedHeight = 0;
    let offsetY = 0;

    // Calculate start index
    for (let i = 0; i < itemCount; i++) {
      const height = getItemHeight(i);
      if (accumulatedHeight + height > scrollTop) {
        startIdx = i;
        offsetY = accumulatedHeight;
        break;
      }
      accumulatedHeight += height;
    }

    // Calculate end index
    let visibleHeight = 0;
    for (let i = startIdx; i < itemCount; i++) {
      const height = getItemHeight(i);
      visibleHeight += height;
      endIdx = i;
      if (visibleHeight >= containerHeight) {
        break;
      }
    }

    // Apply overscan
    const overscanStartIndex = Math.max(0, startIdx - overscan);
    const overscanEndIndex = Math.min(itemCount - 1, endIdx + overscan);

    // Calculate total height
    let totalHeight = 0;
    for (let i = 0; i < itemCount; i++) {
      totalHeight += getItemHeight(i);
    }

    return {
      startIndex: overscanStartIndex,
      endIndex: overscanEndIndex,
      totalHeight,
      offsetY,
    };
  }, [scrollTop, containerHeight, itemCount, overscan, getItemHeight]);

  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const newScrollTop = event.currentTarget.scrollTop;
      setScrollTop(newScrollTop);
      setIsScrolling(true);

      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Set scrolling to false after delay
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, scrollingDelay);
    },
    [scrollingDelay]
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const scrollToIndex = useCallback(
    (index: number, align: 'start' | 'center' | 'end' | 'auto' = 'auto') => {
      let scrollTo = 0;

      // Calculate scroll position based on alignment
      if (align === 'start') {
        for (let i = 0; i < index; i++) {
          scrollTo += getItemHeight(i);
        }
      } else if (align === 'center') {
        for (let i = 0; i < index; i++) {
          scrollTo += getItemHeight(i);
        }
        scrollTo -= (containerHeight - getItemHeight(index)) / 2;
      } else if (align === 'end') {
        for (let i = 0; i <= index; i++) {
          scrollTo += getItemHeight(i);
        }
        scrollTo -= containerHeight;
      }

      setScrollTop(Math.max(0, scrollTo));
    },
    [getItemHeight, containerHeight]
  );

  return {
    startIndex,
    endIndex,
    totalHeight,
    offsetY,
    isScrolling,
    onScroll: handleScroll,
    scrollToIndex,
  };
}

/**
 * Hook for lazy loading with intersection observer
 */
export function useLazyLoading<T extends HTMLElement = HTMLElement>(
  callback: () => void,
  options: IntersectionObserverInit = {}
) {
  const targetRef = useRef<T>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting) {
          callback();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    );

    observer.observe(target);

    return () => {
      observer.unobserve(target);
    };
  }, [callback, options]);

  return { targetRef, isIntersecting };
}

/**
 * Hook for memoizing expensive calculations
 */
export function useExpensiveCalculation<T>(
  calculation: () => T,
  dependencies: React.DependencyList,
  shouldRecalculate?: (prev: T, current: T) => boolean
) {
  const [result, setResult] = useState<T>(() => calculation());
  const previousResult = useRef<T>(result);

  const memoizedResult = useMemo(() => {
    const newResult = calculation();
    
    if (shouldRecalculate) {
      if (shouldRecalculate(previousResult.current, newResult)) {
        previousResult.current = newResult;
        return newResult;
      }
      return previousResult.current;
    }
    
    previousResult.current = newResult;
    return newResult;
  }, dependencies);

  useEffect(() => {
    setResult(memoizedResult);
  }, [memoizedResult]);

  return result;
}

/**
 * Hook for debounced values to prevent excessive updates
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook for throttled callbacks to limit execution frequency
 */
export function useThrottle<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T {
  const lastRun = useRef(Date.now());

  return useCallback(
    ((...args) => {
      if (Date.now() - lastRun.current >= delay) {
        callback(...args);
        lastRun.current = Date.now();
      }
    }) as T,
    [callback, delay]
  );
}

/**
 * Hook for performance monitoring
 */
export function usePerformanceMonitor(componentName: string) {
  const renderCount = useRef(0);
  const lastRenderTime = useRef(performance.now());
  const mountTime = useRef(performance.now());

  useEffect(() => {
    renderCount.current += 1;
    const now = performance.now();
    const renderDuration = now - lastRenderTime.current;
    lastRenderTime.current = now;

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${componentName}:`, {
        renderCount: renderCount.current,
        renderDuration: `${renderDuration.toFixed(2)}ms`,
        totalTime: `${(now - mountTime.current).toFixed(2)}ms`,
      });
    }
  });

  const markMilestone = useCallback(
    (milestone: string) => {
      if (process.env.NODE_ENV === 'development') {
        const now = performance.now();
        console.log(`[Performance] ${componentName} - ${milestone}:`, {
          time: `${(now - mountTime.current).toFixed(2)}ms`,
        });
      }
    },
    [componentName]
  );

  return { markMilestone };
}

/**
 * Hook for memory usage monitoring
 */
export function useMemoryMonitor() {
  const [memoryInfo, setMemoryInfo] = useState<{
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  } | null>(null);

  useEffect(() => {
    const updateMemoryInfo = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        setMemoryInfo({
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit,
        });
      }
    };

    updateMemoryInfo();
    const interval = setInterval(updateMemoryInfo, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return memoryInfo;
}

/**
 * Hook for web worker integration
 */
export function useWebWorker<T, R>(
  workerFunction: (data: T) => R,
  dependencies: React.DependencyList = []
) {
  const workerRef = useRef<Worker | null>(null);
  const [result, setResult] = useState<R | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback((data: T) => {
    if (!workerRef.current) {
      // Create worker from function
      const workerCode = `
        self.onmessage = function(e) {
          const result = (${workerFunction.toString()})(e.data);
          self.postMessage(result);
        };
      `;
      const blob = new Blob([workerCode], { type: 'application/javascript' });
      workerRef.current = new Worker(URL.createObjectURL(blob));

      workerRef.current.onmessage = (e) => {
        setResult(e.data);
        setLoading(false);
      };

      workerRef.current.onerror = (e) => {
        setError(new Error(e.message));
        setLoading(false);
      };
    }

    setLoading(true);
    setError(null);
    workerRef.current.postMessage(data);
  }, dependencies);

  useEffect(() => {
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  return { execute, result, loading, error };
}
