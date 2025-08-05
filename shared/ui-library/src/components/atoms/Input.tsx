import React, { forwardRef } from 'react';
import { useTheme } from '../../themes/ThemeProvider';

export type InputSize = 'sm' | 'md' | 'lg';
export type InputVariant = 'outline' | 'filled' | 'flushed';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: InputSize;
  variant?: InputVariant;
  error?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  size = 'md',
  variant = 'outline',
  error = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  disabled = false,
  className = '',
  style,
  ...props
}, ref) => {
  const { theme } = useTheme();

  const getSizeStyles = (size: InputSize) => {
    switch (size) {
      case 'sm':
        return {
          padding: `${theme.spacing[1.5]} ${theme.spacing[3]}`,
          fontSize: theme.typography.sizes.sm,
          borderRadius: theme.borderRadius.base,
        };
      case 'md':
        return {
          padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
          fontSize: theme.typography.sizes.base,
          borderRadius: theme.borderRadius.md,
        };
      case 'lg':
        return {
          padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
          fontSize: theme.typography.sizes.lg,
          borderRadius: theme.borderRadius.lg,
        };
      default:
        return {};
    }
  };

  const getVariantStyles = (variant: InputVariant) => {
    const baseColor = theme.colorMode === 'light' ? theme.colors.neutral[300] : theme.colors.neutral[600];
    const focusColor = theme.appTheme !== 'default' 
      ? (theme.colors[theme.appTheme as keyof typeof theme.colors] as { primary: string }).primary
      : theme.colors.primary[600];

    switch (variant) {
      case 'outline':
        return {
          border: `1px solid ${error ? theme.colors.error[500] : baseColor}`,
          backgroundColor: theme.colorMode === 'light' ? 'white' : theme.colors.neutral[800],
          ':focus': {
            borderColor: error ? theme.colors.error[500] : focusColor,
            boxShadow: `0 0 0 3px ${error ? theme.colors.error[100] : theme.colors.primary[100]}`,
          },
        };
      case 'filled':
        return {
          border: 'none',
          backgroundColor: theme.colorMode === 'light' ? theme.colors.neutral[100] : theme.colors.neutral[700],
          ':focus': {
            backgroundColor: theme.colorMode === 'light' ? 'white' : theme.colors.neutral[800],
            boxShadow: `0 0 0 3px ${error ? theme.colors.error[100] : theme.colors.primary[100]}`,
          },
        };
      case 'flushed':
        return {
          border: 'none',
          borderBottom: `2px solid ${error ? theme.colors.error[500] : baseColor}`,
          backgroundColor: 'transparent',
          borderRadius: '0',
          ':focus': {
            borderBottomColor: error ? theme.colors.error[500] : focusColor,
          },
        };
      default:
        return {};
    }
  };

  const sizeStyles = getSizeStyles(size);
  const variantStyles = getVariantStyles(variant);

  const inputStyles: React.CSSProperties = {
    ...sizeStyles,
    ...variantStyles,
    fontFamily: theme.typography.fonts.sans,
    color: theme.colorMode === 'light' ? theme.colors.neutral[900] : theme.colors.neutral[100],
    width: fullWidth ? '100%' : 'auto',
    transition: theme.transitions.all,
    outline: 'none',
    opacity: disabled ? 0.6 : 1,
    cursor: disabled ? 'not-allowed' : 'text',
    ...style,
  };

  const containerStyles: React.CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    width: fullWidth ? '100%' : 'auto',
  };

  const iconStyles: React.CSSProperties = {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.colors.neutral[500],
    pointerEvents: 'none',
    zIndex: 1,
  };

  const leftIconStyles: React.CSSProperties = {
    ...iconStyles,
    left: theme.spacing[3],
  };

  const rightIconStyles: React.CSSProperties = {
    ...iconStyles,
    right: theme.spacing[3],
  };

  const inputWithIconStyles: React.CSSProperties = {
    ...inputStyles,
    paddingLeft: leftIcon ? theme.spacing[10] : inputStyles.paddingLeft,
    paddingRight: rightIcon ? theme.spacing[10] : inputStyles.paddingRight,
  };

  if (leftIcon || rightIcon) {
    return (
      <div style={containerStyles} className={className}>
        {leftIcon && <div style={leftIconStyles}>{leftIcon}</div>}
        <input
          ref={ref}
          disabled={disabled}
          style={inputWithIconStyles}
          {...props}
        />
        {rightIcon && <div style={rightIconStyles}>{rightIcon}</div>}
      </div>
    );
  }

  return (
    <input
      ref={ref}
      disabled={disabled}
      className={className}
      style={inputStyles}
      {...props}
    />
  );
});

Input.displayName = 'Input';
