import React from 'react';
import { useTheme } from '../../themes/ThemeProvider';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  'aria-label'?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  onClick,
  type = 'button',
  className = '',
  'aria-label': ariaLabel,
}) => {
  const { theme } = useTheme();

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
        };
      case 'sm':
        return {
          padding: `${theme.spacing[1.5]} ${theme.spacing[3]}`,
          fontSize: theme.typography.sizes.sm,
          borderRadius: theme.borderRadius.base,
        };
      case 'md':
        return {
          padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
          fontSize: theme.typography.sizes.base,
          borderRadius: theme.borderRadius.md,
        };
      case 'lg':
        return {
          padding: `${theme.spacing[2.5]} ${theme.spacing[6]}`,
          fontSize: theme.typography.sizes.lg,
          borderRadius: theme.borderRadius.lg,
        };
      case 'xl':
        return {
          padding: `${theme.spacing[3]} ${theme.spacing[8]}`,
          fontSize: theme.typography.sizes.xl,
          borderRadius: theme.borderRadius.xl,
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

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      className={className}
      style={buttonStyles}
    >
      {loading && (
        <span
          style={{
            width: '1em',
            height: '1em',
            border: '2px solid transparent',
            borderTop: '2px solid currentColor',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
      )}
      {children}
    </button>
  );
};
