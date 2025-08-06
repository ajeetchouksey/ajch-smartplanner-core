import React, { useState } from 'react';
import { useTheme } from '../../themes/ThemeProvider';
import { useTouchGestures, useMobileViewport } from '../../hooks/mobile/useTouchGestures';
import { useAccessibilityPreferences } from '../../hooks/accessibility';

export interface MobileOptimizedCardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  image?: string;
  imageAlt?: string;
  onTap?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onLongPress?: () => void;
  className?: string;
  variant?: 'elevated' | 'outlined' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  disabled?: boolean;
  loading?: boolean;
  // Mobile-specific props
  enableSwipe?: boolean;
  enableLongPress?: boolean;
  hapticFeedback?: boolean;
  touchHighlight?: boolean;
}

export const MobileOptimizedCard: React.FC<MobileOptimizedCardProps> = ({
  children,
  title,
  subtitle,
  image,
  imageAlt,
  onTap,
  onSwipeLeft,
  onSwipeRight,
  onLongPress,
  className = '',
  variant = 'elevated',
  size = 'md',
  interactive = false,
  disabled = false,
  loading = false,
  enableSwipe = true,
  enableLongPress = true,
  hapticFeedback = true,
  touchHighlight = true,
}) => {
  const { theme } = useTheme();
  const { isMobile, isTablet } = useMobileViewport();
  const { reducedMotion, highContrast } = useAccessibilityPreferences();
  const [isPressed, setIsPressed] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  // Trigger haptic feedback (if supported)
  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (hapticFeedback && 'vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30],
      };
      navigator.vibrate(patterns[type]);
    }
  };

  // Touch gesture handlers
  const gestureRef = useTouchGestures<HTMLDivElement>({
    onTap: () => {
      if (disabled || loading) return;
      triggerHaptic('light');
      onTap?.();
    },
    onSwipeLeft: enableSwipe ? () => {
      if (disabled || loading) return;
      triggerHaptic('medium');
      setSwipeDirection('left');
      onSwipeLeft?.();
      setTimeout(() => setSwipeDirection(null), 300);
    } : undefined,
    onSwipeRight: enableSwipe ? () => {
      if (disabled || loading) return;
      triggerHaptic('medium');
      setSwipeDirection('right');
      onSwipeRight?.();
      setTimeout(() => setSwipeDirection(null), 300);
    } : undefined,
    onLongPress: enableLongPress ? () => {
      if (disabled || loading) return;
      triggerHaptic('heavy');
      onLongPress?.();
    } : undefined,
    onTouchStart: () => {
      if (touchHighlight && !disabled && !loading) {
        setIsPressed(true);
      }
    },
    onTouchEnd: () => {
      setIsPressed(false);
    },
  });

  // Responsive sizing
  const getResponsiveSize = () => {
    if (isMobile) {
      return {
        sm: { padding: theme.spacing[3], minHeight: '80px' },
        md: { padding: theme.spacing[4], minHeight: '100px' },
        lg: { padding: theme.spacing[5], minHeight: '120px' },
      }[size];
    } else if (isTablet) {
      return {
        sm: { padding: theme.spacing[4], minHeight: '90px' },
        md: { padding: theme.spacing[5], minHeight: '110px' },
        lg: { padding: theme.spacing[6], minHeight: '130px' },
      }[size];
    } else {
      return {
        sm: { padding: theme.spacing[4], minHeight: '100px' },
        md: { padding: theme.spacing[6], minHeight: '120px' },
        lg: { padding: theme.spacing[8], minHeight: '140px' },
      }[size];
    }
  };

  // Touch target sizing (minimum 44px for accessibility)
  const getTouchTargetSize = () => {
    const minSize = 44; // WCAG 2.1 AA minimum touch target size
    const responsiveHeight = getResponsiveSize()?.minHeight;
    const heightValue = typeof responsiveHeight === 'string' ? 
      parseInt(responsiveHeight.replace('px', '')) : responsiveHeight || minSize;
    return Math.max(minSize, heightValue);
  };

  // Variant styles
  const getVariantStyles = () => {
    const baseColor = theme.colorMode === 'light' ? 'white' : theme.colors.neutral[800];
    const borderColor = theme.colorMode === 'light' ? theme.colors.neutral[200] : theme.colors.neutral[700];
    
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: baseColor,
          boxShadow: highContrast ? 'none' : 
            '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          border: highContrast ? `2px solid ${borderColor}` : 'none',
        };
      case 'outlined':
        return {
          backgroundColor: baseColor,
          border: `1px solid ${borderColor}`,
          boxShadow: 'none',
        };
      case 'filled':
        return {
          backgroundColor: theme.colorMode === 'light' ? theme.colors.neutral[50] : theme.colors.neutral[700],
          border: 'none',
          boxShadow: 'none',
        };
      default:
        return {};
    }
  };

  const responsiveSize = getResponsiveSize();
  const variantStyles = getVariantStyles();
  const touchTargetSize = getTouchTargetSize();

  const cardStyles: React.CSSProperties = {
    ...variantStyles,
    ...responsiveSize,
    borderRadius: theme.borderRadius.lg,
    transition: reducedMotion ? 'none' : theme.transitions.all,
    cursor: interactive && !disabled ? 'pointer' : 'default',
    opacity: disabled ? 0.6 : loading ? 0.8 : 1,
    position: 'relative',
    overflow: 'hidden',
    minHeight: touchTargetSize,
    
    // Touch feedback
    transform: isPressed && touchHighlight ? 'scale(0.98)' : 
               swipeDirection === 'left' ? 'translateX(-10px)' :
               swipeDirection === 'right' ? 'translateX(10px)' : 'scale(1)',
    
    // High contrast mode adjustments
    outline: highContrast && interactive ? `2px solid ${theme.colors.primary[500]}` : 'none',
  };

  const headerStyles: React.CSSProperties = {
    marginBottom: (title || subtitle) ? theme.spacing[3] : 0,
  };

  const titleStyles: React.CSSProperties = {
    fontSize: isMobile ? theme.typography.sizes.lg : theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colorMode === 'light' ? theme.colors.neutral[900] : theme.colors.neutral[100],
    margin: 0,
    marginBottom: subtitle ? theme.spacing[1] : 0,
    lineHeight: theme.typography.lineHeights.tight,
  };

  const subtitleStyles: React.CSSProperties = {
    fontSize: isMobile ? theme.typography.sizes.sm : theme.typography.sizes.base,
    color: theme.colorMode === 'light' ? theme.colors.neutral[600] : theme.colors.neutral[400],
    margin: 0,
    lineHeight: theme.typography.lineHeights.normal,
  };

  const imageStyles: React.CSSProperties = {
    width: '100%',
    height: isMobile ? '150px' : '200px',
    objectFit: 'cover',
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing[3],
  };

  const loadingOverlayStyles: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  };

  const loadingSpinnerStyles: React.CSSProperties = {
    width: '24px',
    height: '24px',
    border: `2px solid ${theme.colors.neutral[300]}`,
    borderTop: `2px solid ${theme.colors.primary[500]}`,
    borderRadius: '50%',
    animation: reducedMotion ? 'none' : 'spin 1s linear infinite',
  };

  // ARIA attributes for accessibility
  const ariaProps = {
    role: interactive ? 'button' : undefined,
    tabIndex: interactive && !disabled ? 0 : undefined,
    'aria-disabled': disabled,
    'aria-busy': loading,
    'aria-label': title ? `${title}${subtitle ? `, ${subtitle}` : ''}` : undefined,
  };

  return (
    <div
      ref={gestureRef}
      style={cardStyles}
      className={className}
      {...ariaProps}
    >
      {loading && (
        <div style={loadingOverlayStyles}>
          <div style={loadingSpinnerStyles} />
        </div>
      )}

      {image && (
        <img
          src={image}
          alt={imageAlt || title || 'Card image'}
          style={imageStyles}
        />
      )}

      {(title || subtitle) && (
        <div style={headerStyles}>
          {title && <h3 style={titleStyles}>{title}</h3>}
          {subtitle && <p style={subtitleStyles}>{subtitle}</p>}
        </div>
      )}

      <div>
        {children}
      </div>

      {/* Visual feedback for swipe directions */}
      {enableSwipe && (
        <>
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '10px',
              transform: 'translateY(-50%)',
              opacity: swipeDirection === 'right' ? 1 : 0,
              transition: reducedMotion ? 'none' : 'opacity 0.2s ease',
              color: theme.colors.primary[500],
              fontSize: '24px',
            }}
          >
            ←
          </div>
          <div
            style={{
              position: 'absolute',
              top: '50%',
              right: '10px',
              transform: 'translateY(-50%)',
              opacity: swipeDirection === 'left' ? 1 : 0,
              transition: reducedMotion ? 'none' : 'opacity 0.2s ease',
              color: theme.colors.primary[500],
              fontSize: '24px',
            }}
          >
            →
          </div>
        </>
      )}
    </div>
  );
};
