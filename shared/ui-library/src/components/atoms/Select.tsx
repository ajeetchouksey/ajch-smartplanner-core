import React, { forwardRef } from 'react';
import { useTheme } from '../../themes/ThemeProvider';

export type SelectSize = 'sm' | 'md' | 'lg';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  options: SelectOption[];
  size?: SelectSize;
  error?: boolean;
  fullWidth?: boolean;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  options,
  size = 'md',
  error = false,
  fullWidth = false,
  disabled = false,
  placeholder,
  className = '',
  style,
  ...props
}, ref) => {
  const { theme } = useTheme();

  const getSizeStyles = (size: SelectSize) => {
    switch (size) {
      case 'sm':
        return {
          padding: `${theme.spacing[1.5]} ${theme.spacing[8]} ${theme.spacing[1.5]} ${theme.spacing[3]}`,
          fontSize: theme.typography.sizes.sm,
          borderRadius: theme.borderRadius.base,
        };
      case 'md':
        return {
          padding: `${theme.spacing[2]} ${theme.spacing[8]} ${theme.spacing[2]} ${theme.spacing[3]}`,
          fontSize: theme.typography.sizes.base,
          borderRadius: theme.borderRadius.md,
        };
      case 'lg':
        return {
          padding: `${theme.spacing[3]} ${theme.spacing[10]} ${theme.spacing[3]} ${theme.spacing[4]}`,
          fontSize: theme.typography.sizes.lg,
          borderRadius: theme.borderRadius.lg,
        };
      default:
        return {};
    }
  };

  const sizeStyles = getSizeStyles(size);
  const baseColor = theme.colorMode === 'light' ? theme.colors.neutral[300] : theme.colors.neutral[600];
  const focusColor = theme.appTheme !== 'default' 
    ? (theme.colors[theme.appTheme as keyof typeof theme.colors] as { primary: string }).primary
    : theme.colors.primary[600];

  const selectStyles: React.CSSProperties = {
    ...sizeStyles,
    fontFamily: theme.typography.fonts.sans,
    color: theme.colorMode === 'light' ? theme.colors.neutral[900] : theme.colors.neutral[100],
    backgroundColor: theme.colorMode === 'light' ? 'white' : theme.colors.neutral[800],
    border: `1px solid ${error ? theme.colors.error[500] : baseColor}`,
    width: fullWidth ? '100%' : 'auto',
    transition: theme.transitions.all,
    outline: 'none',
    opacity: disabled ? 0.6 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
    backgroundPosition: 'right 0.5rem center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '1.5em 1.5em',
    ...style,
  };

  return (
    <select
      ref={ref}
      disabled={disabled}
      className={className}
      style={selectStyles}
      {...props}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
          disabled={option.disabled}
        >
          {option.label}
        </option>
      ))}
    </select>
  );
});

Select.displayName = 'Select';
