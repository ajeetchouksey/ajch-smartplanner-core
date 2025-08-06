import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Hook for managing keyboard navigation and focus management
 * Provides comprehensive keyboard navigation support for complex components
 */
export function useKeyboardNavigation<T extends HTMLElement = HTMLElement>({
  onEscape,
  onEnter,
  onArrowKeys,
  trapFocus = false,
  autoFocus = false,
  restoreFocus = true,
}: {
  onEscape?: () => void;
  onEnter?: () => void;
  onArrowKeys?: (direction: 'up' | 'down' | 'left' | 'right') => void;
  trapFocus?: boolean;
  autoFocus?: boolean;
  restoreFocus?: boolean;
} = {}) {
  const ref = useRef<T>(null);
  const previousActiveElement = useRef<Element | null>(null);

  useEffect(() => {
    if (autoFocus && ref.current) {
      previousActiveElement.current = document.activeElement;
      ref.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    return () => {
      if (restoreFocus && previousActiveElement.current instanceof HTMLElement) {
        previousActiveElement.current.focus();
      }
    };
  }, [restoreFocus]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    switch (event.key) {
      case 'Escape':
        if (onEscape) {
          event.preventDefault();
          onEscape();
        }
        break;
      case 'Enter':
        if (onEnter) {
          event.preventDefault();
          onEnter();
        }
        break;
      case 'ArrowUp':
        if (onArrowKeys) {
          event.preventDefault();
          onArrowKeys('up');
        }
        break;
      case 'ArrowDown':
        if (onArrowKeys) {
          event.preventDefault();
          onArrowKeys('down');
        }
        break;
      case 'ArrowLeft':
        if (onArrowKeys) {
          event.preventDefault();
          onArrowKeys('left');
        }
        break;
      case 'ArrowRight':
        if (onArrowKeys) {
          event.preventDefault();
          onArrowKeys('right');
        }
        break;
      case 'Tab':
        if (trapFocus && ref.current) {
          const focusableElements = ref.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          const firstElement = focusableElements[0] as HTMLElement;
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

          if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault();
            lastElement?.focus();
          } else if (!event.shiftKey && document.activeElement === lastElement) {
            event.preventDefault();
            firstElement?.focus();
          }
        }
        break;
    }
  }, [onEscape, onEnter, onArrowKeys, trapFocus]);

  useEffect(() => {
    const element = ref.current;
    if (element) {
      element.addEventListener('keydown', handleKeyDown);
      return () => element.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleKeyDown]);

  return ref;
}

/**
 * Hook for managing focus within a container
 * Provides focus trapping and restoration capabilities
 */
export function useFocusManagement<T extends HTMLElement = HTMLElement>(
  trapFocus: boolean = false
) {
  const ref = useRef<T>(null);
  const [isActive, setIsActive] = useState(false);

  const focusFirst = useCallback(() => {
    if (!ref.current) return;
    
    const focusableElements = ref.current.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    firstElement?.focus();
  }, []);

  const focusLast = useCallback(() => {
    if (!ref.current) return;
    
    const focusableElements = ref.current.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    lastElement?.focus();
  }, []);

  useEffect(() => {
    if (!trapFocus || !isActive) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab' && ref.current) {
        const focusableElements = ref.current.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [trapFocus, isActive]);

  return {
    ref,
    isActive,
    setIsActive,
    focusFirst,
    focusLast,
  };
}

/**
 * Hook for managing roving tabindex pattern
 * Useful for toolbars, menus, and other composite widgets
 */
export function useRovingTabIndex<T extends HTMLElement = HTMLElement>(
  items: string[],
  defaultActiveIndex: number = 0
) {
  const [activeIndex, setActiveIndex] = useState(defaultActiveIndex);
  const containerRef = useRef<T>(null);

  const moveToNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const moveToPrevious = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  const moveToFirst = useCallback(() => {
    setActiveIndex(0);
  }, []);

  const moveToLast = useCallback(() => {
    setActiveIndex(items.length - 1);
  }, [items.length]);

  const getTabIndex = useCallback((index: number) => {
    return index === activeIndex ? 0 : -1;
  }, [activeIndex]);

  const getItemProps = useCallback((index: number) => ({
    tabIndex: getTabIndex(index),
    'aria-selected': index === activeIndex,
    onFocus: () => setActiveIndex(index),
    onKeyDown: (event: React.KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowDown':
        case 'ArrowRight':
          event.preventDefault();
          moveToNext();
          break;
        case 'ArrowUp':
        case 'ArrowLeft':
          event.preventDefault();
          moveToPrevious();
          break;
        case 'Home':
          event.preventDefault();
          moveToFirst();
          break;
        case 'End':
          event.preventDefault();
          moveToLast();
          break;
      }
    },
  }), [activeIndex, moveToNext, moveToPrevious, moveToFirst, moveToLast, getTabIndex]);

  return {
    containerRef,
    activeIndex,
    setActiveIndex,
    getItemProps,
    getTabIndex,
    moveToNext,
    moveToPrevious,
    moveToFirst,
    moveToLast,
  };
}
