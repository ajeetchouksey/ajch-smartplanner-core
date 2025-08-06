import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Touch gesture detection hook
 * Provides comprehensive touch gesture support including swipe, pinch, tap, and long press
 */
export interface TouchGestureConfig {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onPinchStart?: (scale: number) => void;
  onPinch?: (scale: number, delta: number) => void;
  onPinchEnd?: (scale: number) => void;
  onTap?: (x: number, y: number) => void;
  onDoubleTap?: (x: number, y: number) => void;
  onLongPress?: (x: number, y: number) => void;
  onTouchStart?: (touches: TouchList) => void;
  onTouchMove?: (touches: TouchList) => void;
  onTouchEnd?: (touches: TouchList) => void;
  
  // Configuration
  swipeThreshold?: number;
  longPressDelay?: number;
  doubleTapDelay?: number;
  pinchThreshold?: number;
  preventDefault?: boolean;
}

export function useTouchGestures<T extends HTMLElement = HTMLElement>(
  config: TouchGestureConfig = {}
) {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onPinchStart,
    onPinch,
    onPinchEnd,
    onTap,
    onDoubleTap,
    onLongPress,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    swipeThreshold = 50,
    longPressDelay = 500,
    doubleTapDelay = 300,
    pinchThreshold = 10,
    preventDefault = true,
  } = config;

  const ref = useRef<T>(null);
  const touchState = useRef({
    startX: 0,
    startY: 0,
    startTime: 0,
    lastTapTime: 0,
    initialDistance: 0,
    currentScale: 1,
    isPinching: false,
    longPressTimer: null as NodeJS.Timeout | null,
  });

  const getDistance = useCallback((touch1: Touch, touch2: Touch) => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);

  const handleTouchStart = useCallback((event: TouchEvent) => {
    if (preventDefault) event.preventDefault();
    
    const touches = event.touches;
    const touch = touches[0];
    const now = Date.now();

    touchState.current.startX = touch.clientX;
    touchState.current.startY = touch.clientY;
    touchState.current.startTime = now;

    onTouchStart?.(touches);

    // Handle pinch gesture
    if (touches.length === 2) {
      touchState.current.isPinching = true;
      touchState.current.initialDistance = getDistance(touches[0], touches[1]);
      onPinchStart?.(1);
    } else {
      touchState.current.isPinching = false;
      
      // Set up long press detection
      if (onLongPress) {
        touchState.current.longPressTimer = setTimeout(() => {
          onLongPress(touch.clientX, touch.clientY);
        }, longPressDelay);
      }
    }
  }, [onTouchStart, onPinchStart, onLongPress, getDistance, longPressDelay, preventDefault]);

  const handleTouchMove = useCallback((event: TouchEvent) => {
    if (preventDefault) event.preventDefault();
    
    const touches = event.touches;
    onTouchMove?.(touches);

    // Clear long press timer on move
    if (touchState.current.longPressTimer) {
      clearTimeout(touchState.current.longPressTimer);
      touchState.current.longPressTimer = null;
    }

    // Handle pinch gesture
    if (touches.length === 2 && touchState.current.isPinching) {
      const currentDistance = getDistance(touches[0], touches[1]);
      const scale = currentDistance / touchState.current.initialDistance;
      const delta = scale - touchState.current.currentScale;
      
      touchState.current.currentScale = scale;
      onPinch?.(scale, delta);
    }
  }, [onTouchMove, onPinch, getDistance, preventDefault]);

  const handleTouchEnd = useCallback((event: TouchEvent) => {
    if (preventDefault) event.preventDefault();
    
    const touches = event.changedTouches;
    const touch = touches[0];
    const now = Date.now();
    const duration = now - touchState.current.startTime;
    const deltaX = touch.clientX - touchState.current.startX;
    const deltaY = touch.clientY - touchState.current.startY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    onTouchEnd?.(event.touches);

    // Clear long press timer
    if (touchState.current.longPressTimer) {
      clearTimeout(touchState.current.longPressTimer);
      touchState.current.longPressTimer = null;
    }

    // Handle pinch end
    if (touchState.current.isPinching) {
      touchState.current.isPinching = false;
      onPinchEnd?.(touchState.current.currentScale);
      touchState.current.currentScale = 1;
      return;
    }

    // Handle swipe gestures
    if (distance > swipeThreshold) {
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      if (absX > absY) {
        // Horizontal swipe
        if (deltaX > 0) {
          onSwipeRight?.();
        } else {
          onSwipeLeft?.();
        }
      } else {
        // Vertical swipe
        if (deltaY > 0) {
          onSwipeDown?.();
        } else {
          onSwipeUp?.();
        }
      }
      return;
    }

    // Handle tap and double tap
    if (distance < pinchThreshold && duration < 300) {
      const timeSinceLastTap = now - touchState.current.lastTapTime;
      
      if (timeSinceLastTap < doubleTapDelay && onDoubleTap) {
        onDoubleTap(touch.clientX, touch.clientY);
        touchState.current.lastTapTime = 0; // Reset to prevent triple tap
      } else {
        touchState.current.lastTapTime = now;
        // Delay single tap to allow for double tap detection
        setTimeout(() => {
          if (now === touchState.current.lastTapTime) {
            onTap?.(touch.clientX, touch.clientY);
          }
        }, doubleTapDelay);
      }
    }
  }, [
    onTouchEnd,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onPinchEnd,
    onTap,
    onDoubleTap,
    swipeThreshold,
    pinchThreshold,
    doubleTapDelay,
    preventDefault,
  ]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.addEventListener('touchstart', handleTouchStart, { passive: !preventDefault });
    element.addEventListener('touchmove', handleTouchMove, { passive: !preventDefault });
    element.addEventListener('touchend', handleTouchEnd, { passive: !preventDefault });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      
      // Cleanup timer
      if (touchState.current.longPressTimer) {
        clearTimeout(touchState.current.longPressTimer);
      }
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, preventDefault]);

  return ref;
}

/**
 * Hook for detecting mobile viewport and orientation changes
 */
export function useMobileViewport() {
  const [viewport, setViewport] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
    orientation: typeof window !== 'undefined' && window.innerHeight > window.innerWidth ? 'portrait' : 'landscape',
    isMobile: typeof window !== 'undefined' ? window.innerWidth < 768 : false,
    isTablet: typeof window !== 'undefined' ? window.innerWidth >= 768 && window.innerWidth < 1024 : false,
    isDesktop: typeof window !== 'undefined' ? window.innerWidth >= 1024 : false,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setViewport({
        width,
        height,
        orientation: height > width ? 'portrait' : 'landscape',
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
      });
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return viewport;
}

/**
 * Hook for handling pull-to-refresh functionality
 */
export function usePullToRefresh(
  onRefresh: () => Promise<void> | void,
  threshold: number = 80,
  enabled: boolean = true
) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const elementRef = useRef<HTMLElement>(null);
  const startY = useRef(0);
  const isPulling = useRef(false);

  const handleTouchStart = useCallback((event: TouchEvent) => {
    if (!enabled || isRefreshing) return;
    
    const element = elementRef.current;
    if (!element || element.scrollTop > 0) return;

    startY.current = event.touches[0].clientY;
    isPulling.current = true;
  }, [enabled, isRefreshing]);

  const handleTouchMove = useCallback((event: TouchEvent) => {
    if (!enabled || !isPulling.current || isRefreshing) return;

    const element = elementRef.current;
    if (!element || element.scrollTop > 0) {
      isPulling.current = false;
      setPullDistance(0);
      return;
    }

    const currentY = event.touches[0].clientY;
    const distance = Math.max(0, currentY - startY.current);
    
    if (distance > 0) {
      event.preventDefault();
      setPullDistance(distance);
    }
  }, [enabled, isRefreshing]);

  const handleTouchEnd = useCallback(async () => {
    if (!enabled || !isPulling.current) return;

    isPulling.current = false;

    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }

    setPullDistance(0);
  }, [enabled, pullDistance, threshold, isRefreshing, onRefresh]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    ref: elementRef,
    isRefreshing,
    pullDistance,
    isTriggered: pullDistance >= threshold,
  };
}

/**
 * Hook for handling safe area insets on mobile devices
 */
export function useSafeArea() {
  const [safeArea, setSafeArea] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });

  useEffect(() => {
    const updateSafeArea = () => {
      const computedStyle = getComputedStyle(document.documentElement);
      
      setSafeArea({
        top: parseInt(computedStyle.getPropertyValue('--safe-area-inset-top') || '0'),
        right: parseInt(computedStyle.getPropertyValue('--safe-area-inset-right') || '0'),
        bottom: parseInt(computedStyle.getPropertyValue('--safe-area-inset-bottom') || '0'),
        left: parseInt(computedStyle.getPropertyValue('--safe-area-inset-left') || '0'),
      });
    };

    // Set CSS custom properties for safe area
    const style = document.createElement('style');
    style.textContent = `
      :root {
        --safe-area-inset-top: env(safe-area-inset-top, 0px);
        --safe-area-inset-right: env(safe-area-inset-right, 0px);
        --safe-area-inset-bottom: env(safe-area-inset-bottom, 0px);
        --safe-area-inset-left: env(safe-area-inset-left, 0px);
      }
    `;
    document.head.appendChild(style);

    updateSafeArea();

    window.addEventListener('resize', updateSafeArea);
    window.addEventListener('orientationchange', updateSafeArea);

    return () => {
      window.removeEventListener('resize', updateSafeArea);
      window.removeEventListener('orientationchange', updateSafeArea);
      document.head.removeChild(style);
    };
  }, []);

  return safeArea;
}
