import React, { forwardRef, useId, useState } from 'react';
import { useTheme } from '../../themes/ThemeProvider';
import { useAriaLabeling, useLiveRegion } from '../../hooks/accessibility';
import { generateAccessibleId } from '../../utils/accessibility/wcagUtils';

export interface AccessibleInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  description?: string;
  error?: string;
  warning?: string;
  success?: string;
  required?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'outline' | 'filled' | 'flushed';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  showErrorIcon?: boolean;
  showSuccessIcon?: boolean;
  announceChanges?: boolean;
}

export const AccessibleInput = forwardRef<HTMLInputElement, AccessibleInputProps>(({
  label,
  description,
  error,
  warning,
  success,
  required = false,
  size = 'md',
  variant = 'outline',
  leftIcon,
  rightIcon,
  fullWidth = false,
  showErrorIcon = true,
  showSuccessIcon = true,
  announceChanges = false,
  disabled,
  onChange,
  onBlur,
  onFocus,
  className = '',
  ...props
}, ref) => {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const { announce } = useLiveRegion();
  const { getLabelProps, getDescriptionProps } = useAriaLabeling();

  // Generate unique IDs
  const inputId = useId();
  const labelId = generateAccessibleId('label');
  const descriptionId = description ? generateAccessibleId('description') : undefined;
  const errorId = error ? generateAccessibleId('error') : undefined;
  const warningId = warning ? generateAccessibleId('warning') : undefined;
  const successId = success ? generateAccessibleId('success') : undefined;

  // Determine validation state
  const validationState = error ? 'error' : warning ? 'warning' : success ? 'success' : 'default';
  const isInvalid = validationState === 'error';

  // Build describedBy IDs
  const describedByIds = [
    descriptionId,
    errorId,
    warningId,
    successId,
  ].filter(Boolean).join(' ');

  // Handle events with announcements
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(event);
    
    if (announceChanges && event.target.value) {
      announce(`Input value changed to ${event.target.value}`, 'polite');
    }
  };

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(event);
    
    if (error) {
      announce(`Error: ${error}`, 'assertive');
    } else if (warning) {
      announce(`Warning: ${warning}`, 'polite');
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    onBlur?.(event);
  };

  // Styling
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          padding: `${theme.spacing[1.5]} ${theme.spacing[3]}`,
          fontSize: theme.typography.sizes.sm,
          borderRadius: theme.borderRadius.base,
          minHeight: '32px',
        };
      case 'md':
        return {
          padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
          fontSize: theme.typography.sizes.base,
          borderRadius: theme.borderRadius.md,
          minHeight: '40px',
        };
      case 'lg':
        return {
          padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
          fontSize: theme.typography.sizes.lg,
          borderRadius: theme.borderRadius.lg,
          minHeight: '48px',
        };
      default:
        return {};
    }
  };

  const getVariantStyles = () => {
    const colors = {
      default: theme.colors.neutral[300],
      error: theme.colors.error[500],
      warning: theme.colors.warning[500],
      success: theme.colors.success[500],
      focus: theme.colors.primary[500],
    };

    const borderColor = isInvalid ? colors.error : 
                       warning ? colors.warning : 
                       success ? colors.success : 
                       isFocused ? colors.focus : colors.default;

    switch (variant) {
      case 'outline':
        return {
          border: `2px solid ${borderColor}`,
          backgroundColor: theme.colorMode === 'light' ? 'white' : theme.colors.neutral[800],
        };
      case 'filled':
        return {
          border: '2px solid transparent',
          backgroundColor: theme.colorMode === 'light' ? theme.colors.neutral[100] : theme.colors.neutral[700],
          borderColor: isFocused ? borderColor : 'transparent',
        };
      case 'flushed':
        return {
          border: 'none',
          borderBottom: `2px solid ${borderColor}`,
          backgroundColor: 'transparent',
          borderRadius: 0,
        };
      default:
        return {};
    }
  };

  const sizeStyles = getSizeStyles();
  const variantStyles = getVariantStyles();

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
  };

  const labelStyles: React.CSSProperties = {
    display: 'block',
    marginBottom: theme.spacing[1],
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    color: theme.colorMode === 'light' ? theme.colors.neutral[700] : theme.colors.neutral[300],
  };

  const descriptionStyles: React.CSSProperties = {
    marginTop: theme.spacing[1],
    fontSize: theme.typography.sizes.xs,
    color: theme.colorMode === 'light' ? theme.colors.neutral[600] : theme.colors.neutral[400],
  };

  const messageStyles: React.CSSProperties = {
    marginTop: theme.spacing[1],
    fontSize: theme.typography.sizes.xs,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing[1],
  };

  const errorStyles: React.CSSProperties = {
    ...messageStyles,
    color: theme.colors.error[600],
  };

  const warningStyles: React.CSSProperties = {
    ...messageStyles,
    color: theme.colors.warning[600],
  };

  const successStyles: React.CSSProperties = {
    ...messageStyles,
    color: theme.colors.success[600],
  };

  const containerStyles: React.CSSProperties = {
    width: fullWidth ? '100%' : 'auto',
  };

  // Icons
  const ErrorIcon = () => (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
  );

  const WarningIcon = () => (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
  );

  const SuccessIcon = () => (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  );

  return (
    <div style={containerStyles} className={className}>
      {/* Label */}
      {label && (
        <label
          id={labelId}
          htmlFor={inputId}
          style={labelStyles}
        >
          {label}
          {required && (
            <span style={{ color: theme.colors.error[500], marginLeft: theme.spacing[1] }} aria-label="required">
              *
            </span>
          )}
        </label>
      )}

      {/* Description */}
      {description && (
        <div id={descriptionId} style={descriptionStyles}>
          {description}
        </div>
      )}

      {/* Input */}
      <input
        ref={ref}
        id={inputId}
        disabled={disabled}
        required={required}
        aria-invalid={isInvalid}
        aria-required={required}
        aria-labelledby={label ? labelId : undefined}
        aria-describedby={describedByIds || undefined}
        style={inputStyles}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />

      {/* Error Message */}
      {error && (
        <div id={errorId} role="alert" style={errorStyles}>
          {showErrorIcon && <ErrorIcon />}
          {error}
        </div>
      )}

      {/* Warning Message */}
      {warning && !error && (
        <div id={warningId} style={warningStyles}>
          {showErrorIcon && <WarningIcon />}
          {warning}
        </div>
      )}

      {/* Success Message */}
      {success && !error && !warning && (
        <div id={successId} style={successStyles}>
          {showSuccessIcon && <SuccessIcon />}
          {success}
        </div>
      )}
    </div>
  );
});

AccessibleInput.displayName = 'AccessibleInput';
