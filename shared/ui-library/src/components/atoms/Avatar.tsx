import React from 'react';
import { useTheme } from '../../themes/ThemeProvider';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  name,
  size = 'md',
  className = '',
}) => {
  const { theme } = useTheme();

  const getSizeStyles = (size: AvatarSize) => {
    const sizeMap = {
      xs: theme.spacing[6],    // 24px
      sm: theme.spacing[8],    // 32px
      md: theme.spacing[10],   // 40px
      lg: theme.spacing[12],   // 48px
      xl: theme.spacing[16],   // 64px
      '2xl': theme.spacing[20], // 80px
    };

    const fontSize = {
      xs: theme.typography.sizes.xs,
      sm: theme.typography.sizes.sm,
      md: theme.typography.sizes.base,
      lg: theme.typography.sizes.lg,
      xl: theme.typography.sizes.xl,
      '2xl': theme.typography.sizes['2xl'],
    };

    return {
      width: sizeMap[size],
      height: sizeMap[size],
      fontSize: fontSize[size],
    };
  };

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const sizeStyles = getSizeStyles(size);

  const avatarStyles: React.CSSProperties = {
    ...sizeStyles,
    borderRadius: theme.borderRadius.full,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: theme.typography.fonts.sans,
    fontWeight: theme.typography.weights.medium,
    backgroundColor: theme.colors.neutral[200],
    color: theme.colors.neutral[700],
    overflow: 'hidden',
    flexShrink: 0,
  };

  const imageStyles: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  };

  if (src) {
    return (
      <div className={className} style={avatarStyles}>
        <img
          src={src}
          alt={alt || name || 'Avatar'}
          style={imageStyles}
          onError={(e) => {
            // Fallback to initials if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            if (target.nextSibling) {
              (target.nextSibling as HTMLElement).style.display = 'flex';
            }
          }}
        />
        {name && (
          <span style={{ display: 'none' }}>
            {getInitials(name)}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={className} style={avatarStyles}>
      {name ? getInitials(name) : '?'}
    </div>
  );
};
