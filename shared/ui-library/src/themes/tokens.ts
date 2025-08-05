// Design tokens for SmartPlanner UI Library - AI-Powered Modern Theme
export const colors = {
  // Primary - Neural Network Blue (AI Intelligence)
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },

  // Secondary - Cyber Purple (AI Sophistication)
  secondary: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d946ef',
    400: '#c026d3',
    500: '#a21caf',
    600: '#86198f',
    700: '#701a75',
    800: '#581c87',
    900: '#3b0764',
  },

  // Success - Neon Green (AI Achievement)
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },

  // Warning - Electric Orange (AI Alert)
  warning: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316',
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
  },

  // Error - Neural Red (AI Error)
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },

  // Neutral - Modern Dark Theme
  neutral: {
    50: '#fafbfc',
    100: '#f1f3f5',
    200: '#e9ecef',
    300: '#d3d9e0',
    400: '#9ba4b0',
    500: '#6c7582',
    600: '#495057',
    700: '#343a40',
    800: '#212529',
    900: '#0d1117',
  },

  // App-specific AI themes
  travel: {
    primary: '#06b6d4', // Cyan for exploration
    secondary: '#0891b2',
    accent: '#22d3ee',
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 50%, #22d3ee 100%)',
  },
  finance: {
    primary: '#059669', // Green for growth
    secondary: '#047857',
    accent: '#10b981',
    gradient: 'linear-gradient(135deg, #059669 0%, #047857 50%, #10b981 100%)',
  },
  health: {
    primary: '#dc2626', // Red for vitality
    secondary: '#b91c1c',
    accent: '#ef4444',
    gradient: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #ef4444 100%)',
  },
  day: {
    primary: '#7c3aed', // Purple for productivity
    secondary: '#6d28d9',
    accent: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #8b5cf6 100%)',
  },
};

// AI-inspired gradients and effects
export const gradients = {
  neural: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  cyber: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  matrix: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  quantum: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  hologram: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  plasma: 'linear-gradient(135deg, #ee9ca7 0%, #ffdde1 100%)',
  mesh: 'radial-gradient(circle at 20% 80%, #120078 0%, transparent 50%), radial-gradient(circle at 80% 20%, #ff006e 0%, transparent 50%), radial-gradient(circle at 40% 40%, #8338ec 0%, transparent 50%)',
};

export const typography = {
  fonts: {
    sans: [
      'Inter',
      'system-ui',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'Oxygen',
      'Ubuntu',
      'Cantarell',
      'Fira Sans',
      'Droid Sans',
      'Helvetica Neue',
      'sans-serif',
    ].join(', '),
    mono: [
      'JetBrains Mono',
      'Fira Code',
      'Cascadia Code',
      'Menlo',
      'Monaco',
      'Consolas',
      'Liberation Mono',
      'Courier New',
      'monospace',
    ].join(', '),
    display: [
      'Space Grotesk',
      'Inter',
      'system-ui',
      'sans-serif',
    ].join(', '),
  },

  sizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
    '6xl': '3.75rem', // 60px
    '7xl': '4.5rem',  // 72px
    '8xl': '6rem',    // 96px
    '9xl': '8rem',    // 128px
  },

  weights: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },

  lineHeights: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },
};

export const spacing = {
  0: '0',
  px: '1px',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  11: '2.75rem',    // 44px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  28: '7rem',       // 112px
  32: '8rem',       // 128px
  36: '9rem',       // 144px
  40: '10rem',      // 160px
  44: '11rem',      // 176px
  48: '12rem',      // 192px
  52: '13rem',      // 208px
  56: '14rem',      // 224px
  60: '15rem',      // 240px
  64: '16rem',      // 256px
  72: '18rem',      // 288px
  80: '20rem',      // 320px
  96: '24rem',      // 384px
};

export const borderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px
  base: '0.25rem',  // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px',
};

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  // AI-inspired modern shadows
  neural: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  cyber: '0 10px 40px 0 rgba(168, 85, 247, 0.4)',
  glow: '0 0 20px rgba(59, 130, 246, 0.5)',
  neon: '0 0 30px rgba(34, 197, 94, 0.6)',
  floating: '0 20px 40px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  none: '0 0 #0000',
};

// Glassmorphism and modern effects
export const effects = {
  glassmorphism: {
    light: {
      background: 'rgba(255, 255, 255, 0.25)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(255, 255, 255, 0.18)',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    },
    dark: {
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
    },
  },
  neural: {
    pattern: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='M20 20c0-16.569-13.431-30-30-30s-30 13.431-30 30 13.431 30 30 30 30-13.431 30-30' stroke='%23667eea' stroke-width='1' stroke-opacity='0.1'/%3E%3C/g%3E%3C/svg%3E")`,
    animation: 'neuralPulse 3s ease-in-out infinite',
  },
  particles: {
    background: `radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), 
                 radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%), 
                 radial-gradient(circle at 40% 40%, rgba(120, 219, 226, 0.3) 0%, transparent 50%)`,
  },
};

export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
};

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

export const transitions = {
  none: 'none',
  all: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
  default: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
  colors: 'color 150ms cubic-bezier(0.4, 0, 0.2, 1), background-color 150ms cubic-bezier(0.4, 0, 0.2, 1), border-color 150ms cubic-bezier(0.4, 0, 0.2, 1)',
  opacity: 'opacity 150ms cubic-bezier(0.4, 0, 0.2, 1)',
  shadow: 'box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1)',
  transform: 'transform 150ms cubic-bezier(0.4, 0, 0.2, 1)',
  // AI-inspired modern transitions
  neural: 'all 300ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  smooth: 'all 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  bounce: 'all 400ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  elastic: 'all 600ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
};

// AI-powered animations and keyframes
export const animations = {
  // Neural network pulse effect
  neuralPulse: `
    @keyframes neuralPulse {
      0% { opacity: 0.4; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.05); }
      100% { opacity: 0.4; transform: scale(1); }
    }
  `,
  // Floating element animation
  float: `
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
      100% { transform: translateY(0px); }
    }
  `,
  // Gradient shift for AI backgrounds
  gradientShift: `
    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
  `,
  // Particle movement
  particleFloat: `
    @keyframes particleFloat {
      0% { transform: translateY(0px) rotate(0deg); opacity: 1; }
      100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
    }
  `,
};
