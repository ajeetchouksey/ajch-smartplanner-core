import React, { forwardRef, useRef, useImperativeHandle } from 'react';
import { useTheme } from '../../themes/ThemeProvider';
import { useKeyboardNavigation, useAriaLabeling, useLiveRegion } from '../../hooks/accessibility';
import { generateAccessibleId } from '../../utils/accessibility/wcagUtils';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'warning' | 'link';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ButtonType = 'button' | 'submit' | 'reset';

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  type?: ButtonType;
  loading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  pressed?: boolean;
  expanded?: boolean;
  controls?: string;
  describedBy?: string;
  label?: string;
  announcement?: string;
  onPress?: () => void;
  children: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  type = 'button',
  loading = false,
  loadingText,
  leftIcon,
  rightIcon,
  fullWidth = false,
  pressed,
  expanded,
  controls,
  describedBy,
  label,
  announcement,
  disabled,
  onPress,
  onClick,
  className = '',
  children,
  ...props
}, ref) => {
  const { theme } = useTheme();
  const internalRef = useRef<HTMLButtonElement>(null);
  const { announce } = useLiveRegion();
  const { getLabelProps, getDescriptionProps, getPressedProps, getExpandedProps, getDisabledProps } = useAriaLabeling();

  useImperativeHandle(ref, () => internalRef.current!);

  // Handle keyboard navigation
  useKeyboardNavigation({
    onEnter: () => {
      if (!disabled && !loading) {
        onPress?.();
        if (announcement) {
          announce(announcement, 'polite');
        }
      }
    },
  });

  // Handle click events
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (loading || disabled) {
      event.preventDefault();
      return;
    }

    onClick?.(event);
    onPress?.();
    
    if (announcement) {
      announce(announcement, 'polite');
    }
  };

  // Generate IDs for accessibility
  const buttonId = generateAccessibleId('button');
  const loadingId = generateAccessibleId('loading');

  const getVariantStyles = (variant: ButtonVariant) => {
    const appThemeColors = theme.appTheme !== 'default' 
      ? theme.colors[theme.appTheme as keyof typeof theme.colors] as { primary: string; secondary: string }
      : null;

    const primaryColor = appThemeColors?.primary || theme.colors.primary[600];
    const primaryHover = appThemeColors?.secondary || theme.colors.primary[700];

    switch (variant) {
      case 'primary':
        return {
          backgroundColor: primaryColor,
          color: 'white',
          border: 'none',
          ':hover': {
            backgroundColor: primaryHover,
          },
        };
      case 'secondary':
        return {
          backgroundColor: theme.colors.secondary[100],
          color: theme.colors.secondary[900],
          border: `1px solid ${theme.colors.secondary[300]}`,
          ':hover': {
            backgroundColor: theme.colors.secondary[200],
          },
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: primaryColor,
          border: `1px solid ${primaryColor}`,
          ':hover': {
            backgroundColor: theme.colors.primary[50],
          },
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: primaryColor,
          border: 'none',
          ':hover': {
            backgroundColor: theme.colors.primary[50],
          },
        };
      case 'danger':
        return {
          backgroundColor: theme.colors.error[600],
          color: 'white',
          border: 'none',
          ':hover': {
            backgroundColor: theme.colors.error[700],
          },
        };
      case 'success':
        return {
          backgroundColor: theme.colors.success[600],
          color: 'white',
          border: 'none',
          ':hover': {
            backgroundColor: theme.colors.success[700],
          },
        };
      case 'warning':
        return {
          backgroundColor: theme.colors.warning[600],
          color: 'white',
          border: 'none',
          ':hover': {
            backgroundColor: theme.colors.warning[700],
          },
        };
      case 'link':
        return {
          backgroundColor: 'transparent',
          color: primaryColor,
          border: 'none',
          textDecoration: 'underline',
          padding: 0,
          ':hover': {
            color: primaryHover,
          },
        };
      default:
        return {};
    }
  };

  const getSizeStyles = (size: ButtonSize) => {
    switch (size) {
      case 'xs':
        return {
          padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
          fontSize: theme.typography.sizes.xs,
          borderRadius: theme.borderRadius.sm,
          minHeight: '24px',
        };
      case 'sm':
        return {
          padding: `${theme.spacing[1.5]} ${theme.spacing[3]}`,
          fontSize: theme.typography.sizes.sm,
          borderRadius: theme.borderRadius.base,
          minHeight: '32px',
        };
      case 'md':
        return {
          padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
          fontSize: theme.typography.sizes.base,
          borderRadius: theme.borderRadius.md,
          minHeight: '40px',
        };
      case 'lg':
        return {
          padding: `${theme.spacing[2.5]} ${theme.spacing[6]}`,
          fontSize: theme.typography.sizes.lg,
          borderRadius: theme.borderRadius.lg,
          minHeight: '48px',
        };
      case 'xl':
        return {
          padding: `${theme.spacing[3]} ${theme.spacing[8]}`,
          fontSize: theme.typography.sizes.xl,
          borderRadius: theme.borderRadius.xl,
          minHeight: '56px',
        };
      default:
        return {};
    }
  };

  const variantStyles = getVariantStyles(variant);
  const sizeStyles = getSizeStyles(size);

  const buttonStyles: React.CSSProperties = {
    ...variantStyles,
    ...sizeStyles,
    fontFamily: theme.typography.fonts.sans,
    fontWeight: theme.typography.weights.medium,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.6 : 1,
    transition: theme.transitions.all,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing[2],
    width: fullWidth ? '100%' : 'auto',
    position: 'relative',
    outline: 'none',
    boxShadow: 'none',
  };

  // Enhanced CSS classes for focus management
  const accessibilityClasses = [
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    `focus:ring-${theme.colors.primary[500]}`,
    'focus-visible:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-offset-2',
    `focus-visible:ring-${theme.colors.primary[500]}`,
  ].join(' ');

  // Build aria props
  const ariaProps = {
    ...getLabelProps(label),
    ...getDescriptionProps(undefined, describedBy),
    ...getPressedProps(pressed ?? false),
    ...(expanded !== undefined ? getExpandedProps(expanded) : {}),
    ...getDisabledProps(disabled || loading || false),
    ...(controls ? { 'aria-controls': controls } : {}),
    ...(loading ? { 'aria-describedby': loadingId } : {}),
  };

  return (
    <button
      ref={internalRef}
      id={buttonId}
      type={type}
      disabled={disabled || loading}
      onClick={handleClick}
      className={`${accessibilityClasses} ${className}`}
      style={buttonStyles}
      {...ariaProps}
      {...props}
    >
      {loading && (
        <>
          <span
            style={{
              width: '1em',
              height: '1em',
              border: '2px solid transparent',
              borderTop: '2px solid currentColor',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              marginRight: theme.spacing[1],
            }}
            aria-hidden="true"
          />
          <span id={loadingId} className="sr-only">
            {loadingText || 'Loading...'}
          </span>
        </>
      )}

      {!loading && leftIcon && (
        <span style={{ marginRight: theme.spacing[1] }} aria-hidden="true">
          {leftIcon}
        </span>
      )}

      <span>{children}</span>

      {!loading && rightIcon && (
        <span style={{ marginLeft: theme.spacing[1] }} aria-hidden="true">
          {rightIcon}
        </span>
      )}
    </button>
  );
});

Button.displayName = 'Button';
