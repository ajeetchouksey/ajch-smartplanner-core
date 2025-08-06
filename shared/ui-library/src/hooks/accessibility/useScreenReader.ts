import { useRef, useEffect, useCallback } from 'react';

/**
 * Live region types for screen reader announcements
 */
export type LiveRegionPoliteness = 'polite' | 'assertive' | 'off';

/**
 * Hook for managing screen reader announcements via live regions
 * Provides WCAG-compliant live region functionality
 */
export function useLiveRegion() {
  const politeRegionRef = useRef<HTMLDivElement | null>(null);
  const assertiveRegionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Create live regions if they don't exist
    if (!politeRegionRef.current) {
      const politeRegion = document.createElement('div');
      politeRegion.setAttribute('aria-live', 'polite');
      politeRegion.setAttribute('aria-atomic', 'true');
      politeRegion.setAttribute('aria-relevant', 'additions text');
      politeRegion.style.position = 'absolute';
      politeRegion.style.left = '-10000px';
      politeRegion.style.width = '1px';
      politeRegion.style.height = '1px';
      politeRegion.style.overflow = 'hidden';
      document.body.appendChild(politeRegion);
      politeRegionRef.current = politeRegion;
    }

    if (!assertiveRegionRef.current) {
      const assertiveRegion = document.createElement('div');
      assertiveRegion.setAttribute('aria-live', 'assertive');
      assertiveRegion.setAttribute('aria-atomic', 'true');
      assertiveRegion.setAttribute('aria-relevant', 'additions text');
      assertiveRegion.style.position = 'absolute';
      assertiveRegion.style.left = '-10000px';
      assertiveRegion.style.width = '1px';
      assertiveRegion.style.height = '1px';
      assertiveRegion.style.overflow = 'hidden';
      document.body.appendChild(assertiveRegion);
      assertiveRegionRef.current = assertiveRegion;
    }

    return () => {
      if (politeRegionRef.current) {
        document.body.removeChild(politeRegionRef.current);
        politeRegionRef.current = null;
      }
      if (assertiveRegionRef.current) {
        document.body.removeChild(assertiveRegionRef.current);
        assertiveRegionRef.current = null;
      }
    };
  }, []);

  const announce = useCallback((
    message: string,
    politeness: LiveRegionPoliteness = 'polite',
    delay: number = 100
  ) => {
    if (!message.trim()) return;

    const targetRegion = politeness === 'assertive' 
      ? assertiveRegionRef.current 
      : politeRegionRef.current;

    if (!targetRegion) return;

    // Clear previous content
    targetRegion.textContent = '';

    // Announce after a small delay to ensure screen readers pick it up
    setTimeout(() => {
      if (targetRegion) {
        targetRegion.textContent = message;
      }
    }, delay);

    // Clear the message after announcement to allow re-announcement of same text
    setTimeout(() => {
      if (targetRegion) {
        targetRegion.textContent = '';
      }
    }, delay + 1000);
  }, []);

  const announcePolite = useCallback((message: string) => {
    announce(message, 'polite');
  }, [announce]);

  const announceAssertive = useCallback((message: string) => {
    announce(message, 'assertive');
  }, [announce]);

  return {
    announce,
    announcePolite,
    announceAssertive,
  };
}

/**
 * Hook for managing ARIA labels and descriptions
 * Provides utilities for dynamic ARIA attribute management
 */
export function useAriaLabeling() {
  const generateId = useCallback((prefix: string = 'aria') => {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const getLabelProps = useCallback((label?: string, labelledBy?: string) => {
    if (labelledBy) {
      return { 'aria-labelledby': labelledBy };
    }
    if (label) {
      return { 'aria-label': label };
    }
    return {};
  }, []);

  const getDescriptionProps = useCallback((description?: string, describedBy?: string) => {
    if (describedBy) {
      return { 'aria-describedby': describedBy };
    }
    if (description) {
      const id = generateId('description');
      return {
        'aria-describedby': id,
        descriptionId: id,
      };
    }
    return {};
  }, [generateId]);

  const getExpandedProps = useCallback((isExpanded: boolean) => ({
    'aria-expanded': isExpanded,
  }), []);

  const getSelectedProps = useCallback((isSelected: boolean) => ({
    'aria-selected': isSelected,
  }), []);

  const getCheckedProps = useCallback((isChecked: boolean | 'mixed') => ({
    'aria-checked': isChecked,
  }), []);

  const getDisabledProps = useCallback((isDisabled: boolean) => ({
    'aria-disabled': isDisabled,
  }), []);

  const getPressedProps = useCallback((isPressed: boolean) => ({
    'aria-pressed': isPressed,
  }), []);

  return {
    generateId,
    getLabelProps,
    getDescriptionProps,
    getExpandedProps,
    getSelectedProps,
    getCheckedProps,
    getDisabledProps,
    getPressedProps,
  };
}

/**
 * Hook for managing focus announcements
 * Announces focus changes for screen readers
 */
export function useFocusAnnouncement() {
  const { announcePolite } = useLiveRegion();

  const announceFocus = useCallback((elementInfo: {
    label?: string;
    role?: string;
    description?: string;
    state?: string;
  }) => {
    const parts: string[] = [];
    
    if (elementInfo.label) {
      parts.push(elementInfo.label);
    }
    
    if (elementInfo.role) {
      parts.push(elementInfo.role);
    }
    
    if (elementInfo.state) {
      parts.push(elementInfo.state);
    }
    
    if (elementInfo.description) {
      parts.push(elementInfo.description);
    }

    if (parts.length > 0) {
      announcePolite(parts.join(', '));
    }
  }, [announcePolite]);

  const announceNavigation = useCallback((
    currentIndex: number,
    totalItems: number,
    itemLabel?: string
  ) => {
    const message = itemLabel 
      ? `${itemLabel}, ${currentIndex + 1} of ${totalItems}`
      : `Item ${currentIndex + 1} of ${totalItems}`;
    announcePolite(message);
  }, [announcePolite]);

  const announceSelection = useCallback((
    selectedItems: number,
    totalItems: number,
    action: 'selected' | 'deselected' = 'selected'
  ) => {
    const message = selectedItems === 1
      ? `1 item ${action}. ${selectedItems} of ${totalItems} items selected.`
      : `${selectedItems} items ${action}. ${selectedItems} of ${totalItems} items selected.`;
    announcePolite(message);
  }, [announcePolite]);

  return {
    announceFocus,
    announceNavigation,
    announceSelection,
  };
}
