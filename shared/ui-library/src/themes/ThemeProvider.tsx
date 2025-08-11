import React, { createContext, useContext, useState, ReactNode } from 'react';
import { colors, typography, spacing, borderRadius, shadows, zIndex, transitions, gradients, effects, animations } from './tokens';

export type AppTheme = 'travel' | 'finance' | 'health' | 'day' | 'default';
export type ColorMode = 'light' | 'dark';

export interface Theme {
  colors: typeof colors;
  typography: typeof typography;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  shadows: typeof shadows;
  zIndex: typeof zIndex;
  transitions: typeof transitions;
  gradients: typeof gradients;
  effects: typeof effects;
  animations: typeof animations;
  appTheme: AppTheme;
  colorMode: ColorMode;
}

const defaultTheme: Theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  zIndex,
  transitions,
  gradients,
  effects,
  animations,
  appTheme: 'default',
  colorMode: 'light',
};

interface ThemeContextType {
  theme: Theme;
  setAppTheme: (theme: AppTheme) => void;
  setColorMode: (mode: ColorMode) => void;
  toggleColorMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
  initialAppTheme?: AppTheme;
  initialColorMode?: ColorMode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialAppTheme = 'default',
  initialColorMode = 'light',
}) => {
  const [appTheme, setAppThemeState] = useState<AppTheme>(initialAppTheme);
  const [colorMode, setColorModeState] = useState<ColorMode>(initialColorMode);

  const theme: Theme = {
    ...defaultTheme,
    appTheme,
    colorMode,
  };

  const setAppTheme = (newTheme: AppTheme) => {
    setAppThemeState(newTheme);
  };

  const setColorMode = (mode: ColorMode) => {
    setColorModeState(mode);
  };

  const toggleColorMode = () => {
    setColorModeState(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setAppTheme,
        setColorMode,
        toggleColorMode,
      }}
    >
      <div 
        data-theme={appTheme}
        data-color-mode={colorMode}
        style={{
          colorScheme: colorMode,
          backgroundColor: colorMode === 'light' ? theme.colors.neutral[50] : theme.colors.neutral[900],
          color: colorMode === 'light' ? theme.colors.neutral[900] : theme.colors.neutral[50],
          minHeight: '100vh',
          fontFamily: theme.typography.fonts.sans,
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
