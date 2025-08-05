import React from 'react';
import { useTheme } from '../../themes/ThemeProvider';

export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
}) => {
  const { theme } = useTheme();

  const getVariantStyles = (variant: BadgeVariant) => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: theme.colors.primary[100],
          color: theme.colors.primary[800],
        };
      case 'secondary':
        return {
          backgroundColor: theme.colors.secondary[100],
          color: theme.colors.secondary[800],
        };
      case 'success':
        return {
          backgroundColor: theme.colors.success[100],
          color: theme.colors.success[800],
        };
      case 'warning':
        return {
          backgroundColor: theme.colors.warning[100],
          color: theme.colors.warning[800],
        };
      case 'error':
        return {
          backgroundColor: theme.colors.error[100],
          color: theme.colors.error[800],
        };
      case 'neutral':
        return {
          backgroundColor: theme.colors.neutral[100],
          color: theme.colors.neutral[800],
        };
      default:
        return {};
    }
  };

  const getSizeStyles = (size: BadgeSize) => {
    switch (size) {
      case 'sm':
        return {
          padding: `${theme.spacing[0.5]} ${theme.spacing[2]}`,
          fontSize: theme.typography.sizes.xs,
          borderRadius: theme.borderRadius.sm,
        };
      case 'md':
        return {
          padding: `${theme.spacing[1]} ${theme.spacing[2.5]}`,
          fontSize: theme.typography.sizes.sm,
          borderRadius: theme.borderRadius.base,
        };
      case 'lg':
        return {
          padding: `${theme.spacing[1.5]} ${theme.spacing[3]}`,
          fontSize: theme.typography.sizes.base,
          borderRadius: theme.borderRadius.md,
        };
      default:
        return {};
    }
  };

  const variantStyles = getVariantStyles(variant);
  const sizeStyles = getSizeStyles(size);

  const badgeStyles: React.CSSProperties = {
    ...variantStyles,
    ...sizeStyles,
    fontFamily: theme.typography.fonts.sans,
    fontWeight: theme.typography.weights.medium,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    whiteSpace: 'nowrap',
  };

  return (
    <span className={className} style={badgeStyles}>
      {children}
    </span>
  );
};
