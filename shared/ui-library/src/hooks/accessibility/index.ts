import { useState, useEffect, useCallback } from 'react';

/**
 * Media query breakpoints for responsive design
 */
export const BREAKPOINTS = {
  xs: '(max-width: 575px)',
  sm: '(min-width: 576px) and (max-width: 767px)',
  md: '(min-width: 768px) and (max-width: 991px)',
  lg: '(min-width: 992px) and (max-width: 1199px)',
  xl: '(min-width: 1200px)',
  mobile: '(max-width: 767px)',
  tablet: '(min-width: 768px) and (max-width: 1023px)',
  desktop: '(min-width: 1024px)',
  touchDevice: '(pointer: coarse)',
  reducedMotion: '(prefers-reduced-motion: reduce)',
  highContrast: '(prefers-contrast: high)',
  darkMode: '(prefers-color-scheme: dark)',
} as const;

/**
 * Hook for detecting user preferences related to accessibility
 */
export function useAccessibilityPreferences() {
  const [preferences, setPreferences] = useState({
    reducedMotion: false,
    highContrast: false,
    darkMode: false,
    largeText: false,
  });

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia(BREAKPOINTS.reducedMotion);
    const highContrastQuery = window.matchMedia(BREAKPOINTS.highContrast);
    const darkModeQuery = window.matchMedia(BREAKPOINTS.darkMode);

    const updatePreferences = () => {
      setPreferences({
        reducedMotion: reducedMotionQuery.matches,
        highContrast: highContrastQuery.matches,
        darkMode: darkModeQuery.matches,
        largeText: parseFloat(getComputedStyle(document.documentElement).fontSize) > 16,
      });
    };

    // Initial check
    updatePreferences();

    // Listen for changes
    reducedMotionQuery.addEventListener('change', updatePreferences);
    highContrastQuery.addEventListener('change', updatePreferences);
    darkModeQuery.addEventListener('change', updatePreferences);

    return () => {
      reducedMotionQuery.removeEventListener('change', updatePreferences);
      highContrastQuery.removeEventListener('change', updatePreferences);
      darkModeQuery.removeEventListener('change', updatePreferences);
    };
  }, []);

  return preferences;
}

/**
 * Hook for responsive breakpoint detection
 */
export function useResponsive() {
  const [breakpoint, setBreakpoint] = useState<{
    xs: boolean;
    sm: boolean;
    md: boolean;
    lg: boolean;
    xl: boolean;
    mobile: boolean;
    tablet: boolean;
    desktop: boolean;
    touchDevice: boolean;
  }>({
    xs: false,
    sm: false,
    md: false,
    lg: false,
    xl: false,
    mobile: false,
    tablet: false,
    desktop: false,
    touchDevice: false,
  });

  useEffect(() => {
    const mediaQueries = {
      xs: window.matchMedia(BREAKPOINTS.xs),
      sm: window.matchMedia(BREAKPOINTS.sm),
      md: window.matchMedia(BREAKPOINTS.md),
      lg: window.matchMedia(BREAKPOINTS.lg),
      xl: window.matchMedia(BREAKPOINTS.xl),
      mobile: window.matchMedia(BREAKPOINTS.mobile),
      tablet: window.matchMedia(BREAKPOINTS.tablet),
      desktop: window.matchMedia(BREAKPOINTS.desktop),
      touchDevice: window.matchMedia(BREAKPOINTS.touchDevice),
    };

    const updateBreakpoint = () => {
      setBreakpoint({
        xs: mediaQueries.xs.matches,
        sm: mediaQueries.sm.matches,
        md: mediaQueries.md.matches,
        lg: mediaQueries.lg.matches,
        xl: mediaQueries.xl.matches,
        mobile: mediaQueries.mobile.matches,
        tablet: mediaQueries.tablet.matches,
        desktop: mediaQueries.desktop.matches,
        touchDevice: mediaQueries.touchDevice.matches,
      });
    };

    // Initial check
    updateBreakpoint();

    // Listen for changes
    Object.values(mediaQueries).forEach(mq => {
      mq.addEventListener('change', updateBreakpoint);
    });

    return () => {
      Object.values(mediaQueries).forEach(mq => {
        mq.removeEventListener('change', updateBreakpoint);
      });
    };
  }, []);

  return breakpoint;
}

/**
 * Hook for color contrast calculation and validation
 */
export function useColorContrast() {
  const calculateContrast = useCallback((foreground: string, background: string): number => {
    // Convert hex to RGB
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    };

    // Calculate relative luminance
    const getLuminance = (r: number, g: number, b: number) => {
      const rs = r / 255;
      const gs = g / 255;
      const bs = b / 255;

      const rLin = rs <= 0.03928 ? rs / 12.92 : Math.pow((rs + 0.055) / 1.055, 2.4);
      const gLin = gs <= 0.03928 ? gs / 12.92 : Math.pow((gs + 0.055) / 1.055, 2.4);
      const bLin = bs <= 0.03928 ? bs / 12.92 : Math.pow((bs + 0.055) / 1.055, 2.4);

      return 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;
    };

    const fgRgb = hexToRgb(foreground);
    const bgRgb = hexToRgb(background);

    if (!fgRgb || !bgRgb) return 0;

    const fgLuminance = getLuminance(fgRgb.r, fgRgb.g, fgRgb.b);
    const bgLuminance = getLuminance(bgRgb.r, bgRgb.g, bgRgb.b);

    const lighter = Math.max(fgLuminance, bgLuminance);
    const darker = Math.min(fgLuminance, bgLuminance);

    return (lighter + 0.05) / (darker + 0.05);
  }, []);

  const checkContrastCompliance = useCallback((
    contrast: number,
    level: 'AA' | 'AAA' = 'AA',
    size: 'normal' | 'large' = 'normal'
  ) => {
    const requirements = {
      'AA': { normal: 4.5, large: 3 },
      'AAA': { normal: 7, large: 4.5 }
    };

    return contrast >= requirements[level][size];
  }, []);

  const getContrastRating = useCallback((contrast: number) => {
    if (contrast >= 7) return 'AAA';
    if (contrast >= 4.5) return 'AA';
    if (contrast >= 3) return 'AA Large';
    return 'Fail';
  }, []);

  return {
    calculateContrast,
    checkContrastCompliance,
    getContrastRating,
  };
}

/**
 * Hook for touch and gesture detection
 */
export function useTouchDetection() {
  const [touchCapabilities, setTouchCapabilities] = useState({
    hasTouch: false,
    hasFinePointer: false,
    hasCoarsePointer: false,
    primaryInputIsTouch: false,
  });

  useEffect(() => {
    const hasTouchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches;

    setTouchCapabilities({
      hasTouch: hasTouchSupport,
      hasFinePointer: finePointer,
      hasCoarsePointer: coarsePointer,
      primaryInputIsTouch: coarsePointer && hasTouchSupport,
    });
  }, []);

  return touchCapabilities;
}

/**
 * Export all accessibility hooks and utilities
 */
export { useKeyboardNavigation, useFocusManagement, useRovingTabIndex } from './useKeyboardNavigation';
export { useLiveRegion, useAriaLabeling, useFocusAnnouncement } from './useScreenReader';
