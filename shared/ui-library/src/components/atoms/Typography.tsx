import React from 'react';
import { useTheme } from '../../themes/ThemeProvider';

export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
export type HeadingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
export type HeadingWeight = 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';

export interface HeadingProps {
  level?: HeadingLevel;
  size?: HeadingSize;
  weight?: HeadingWeight;
  color?: string;
  children: React.ReactNode;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
}

export const Heading: React.FC<HeadingProps> = ({
  level = 'h2',
  size,
  weight = 'semibold',
  color,
  children,
  className = '',
  id,
  style = {},
}) => {
  const { theme } = useTheme();

  // Default size mapping based on heading level
  const getDefaultSize = (level: HeadingLevel): HeadingSize => {
    const sizeMap: Record<HeadingLevel, HeadingSize> = {
      h1: '4xl',
      h2: '3xl',
      h3: '2xl',
      h4: 'xl',
      h5: 'lg',
      h6: 'md',
    };
    return sizeMap[level];
  };

  const finalSize = size || getDefaultSize(level);

  const styles: React.CSSProperties = {
    fontSize: theme.typography.sizes[finalSize],
    fontWeight: theme.typography.weights[weight],
    fontFamily: theme.typography.fonts.sans,
    lineHeight: theme.typography.lineHeights.tight,
    color: color || (theme.colorMode === 'light' ? theme.colors.neutral[900] : theme.colors.neutral[50]),
    margin: 0,
    ...style, // Merge user-provided styles
  };

  const Component = level;

  return (
    <Component
      id={id}
      className={className}
      style={styles}
    >
      {children}
    </Component>
  );
};export interface TextProps {
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  weight?: HeadingWeight;
  color?: string;
  children: React.ReactNode;
  className?: string;
  as?: 'p' | 'span' | 'div';
  style?: React.CSSProperties;
}

export const Text: React.FC<TextProps> = ({
  size = 'base',
  weight = 'normal',
  color,
  children,
  className = '',
  as: Component = 'p',
  style = {},
}) => {
  const { theme } = useTheme();

  const styles: React.CSSProperties = {
    fontSize: theme.typography.sizes[size],
    fontWeight: theme.typography.weights[weight],
    fontFamily: theme.typography.fonts.sans,
    lineHeight: theme.typography.lineHeights.normal,
    color: color || (theme.colorMode === 'light' ? theme.colors.neutral[700] : theme.colors.neutral[300]),
    margin: 0,
    ...style, // Merge user-provided styles
  };

  return (
    <Component
      className={className}
      style={styles}
    >
      {children}
    </Component>
  );
};
