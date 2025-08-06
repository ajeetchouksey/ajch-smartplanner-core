/**
 * WCAG 2.1 AA Accessibility Utilities
 * Provides utilities for implementing WCAG compliance
 */

/**
 * Generate a unique ID for accessibility attributes
 */
export const generateAccessibleId = (prefix: string = 'a11y'): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}-${Date.now()}`;
};

/**
 * Check if an element is focusable
 */
export const isFocusable = (element: HTMLElement): boolean => {
  const focusableSelectors = [
    'button:not([disabled])',
    '[href]',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
  ];

  return focusableSelectors.some(selector => element.matches(selector));
};

/**
 * Get all focusable elements within a container
 */
export const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
  const focusableSelectors = [
    'button:not([disabled])',
    '[href]',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
  ];

  const elements = container.querySelectorAll(focusableSelectors.join(','));
  return Array.from(elements) as HTMLElement[];
};

/**
 * Focus the first focusable element in a container
 */
export const focusFirstElement = (container: HTMLElement): boolean => {
  const focusableElements = getFocusableElements(container);
  if (focusableElements.length > 0) {
    focusableElements[0].focus();
    return true;
  }
  return false;
};

/**
 * Focus the last focusable element in a container
 */
export const focusLastElement = (container: HTMLElement): boolean => {
  const focusableElements = getFocusableElements(container);
  if (focusableElements.length > 0) {
    focusableElements[focusableElements.length - 1].focus();
    return true;
  }
  return false;
};

/**
 * Trap focus within a container
 */
export const trapFocus = (container: HTMLElement, event: KeyboardEvent): void => {
  if (event.key !== 'Tab') return;

  const focusableElements = getFocusableElements(container);
  if (focusableElements.length === 0) return;

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
};

/**
 * ARIA role definitions and their expected behaviors
 */
export const ARIA_ROLES = {
  // Widget roles
  button: {
    keyboard: ['Space', 'Enter'] as readonly string[],
    properties: ['aria-pressed', 'aria-expanded', 'aria-describedby'],
  },
  checkbox: {
    keyboard: ['Space'] as readonly string[],
    properties: ['aria-checked', 'aria-describedby'],
  },
  combobox: {
    keyboard: ['ArrowDown', 'ArrowUp', 'Enter', 'Escape'] as readonly string[],
    properties: ['aria-expanded', 'aria-autocomplete', 'aria-owns', 'aria-activedescendant'],
  },
  grid: {
    keyboard: ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown'] as readonly string[],
    properties: ['aria-rowcount', 'aria-colcount'],
  },
  listbox: {
    keyboard: ['ArrowUp', 'ArrowDown', 'Home', 'End'] as readonly string[],
    properties: ['aria-multiselectable', 'aria-expanded', 'aria-activedescendant'],
  },
  menu: {
    keyboard: ['ArrowUp', 'ArrowDown', 'Home', 'End', 'Enter', 'Escape'] as readonly string[],
    properties: ['aria-expanded', 'aria-activedescendant'],
  },
  menubar: {
    keyboard: ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'Enter', 'Escape'] as readonly string[],
    properties: ['aria-expanded', 'aria-activedescendant'],
  },
  radiogroup: {
    keyboard: ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'] as readonly string[],
    properties: ['aria-required', 'aria-describedby'],
  },
  slider: {
    keyboard: ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown'] as readonly string[],
    properties: ['aria-valuemin', 'aria-valuemax', 'aria-valuenow', 'aria-valuetext'],
  },
  tablist: {
    keyboard: ['ArrowLeft', 'ArrowRight', 'Home', 'End'] as readonly string[],
    properties: ['aria-orientation'],
  },
  tab: {
    keyboard: ['Space', 'Enter'] as readonly string[],
    properties: ['aria-selected', 'aria-controls'],
  },
  tree: {
    keyboard: ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'Enter', 'Space'] as readonly string[],
    properties: ['aria-multiselectable', 'aria-expanded'],
  },
} as const;

/**
 * WCAG color contrast requirements
 */
export const CONTRAST_REQUIREMENTS = {
  AA: {
    normal: 4.5,
    large: 3.0,
  },
  AAA: {
    normal: 7.0,
    large: 4.5,
  },
} as const;

/**
 * Calculate color contrast ratio
 */
export const calculateContrastRatio = (foreground: string, background: string): number => {
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const getLuminance = (r: number, g: number, b: number) => {
    const rsRGB = r / 255;
    const gsRGB = g / 255;
    const bsRGB = b / 255;

    const rLin = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
    const gLin = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
    const bLin = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

    return 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;
  };

  const fgRgb = hexToRgb(foreground);
  const bgRgb = hexToRgb(background);

  if (!fgRgb || !bgRgb) return 1;

  const fgLuminance = getLuminance(fgRgb.r, fgRgb.g, fgRgb.b);
  const bgLuminance = getLuminance(bgRgb.r, bgRgb.g, bgRgb.b);

  const lighter = Math.max(fgLuminance, bgLuminance);
  const darker = Math.min(fgLuminance, bgLuminance);

  return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Check if contrast meets WCAG requirements
 */
export const meetsContrastRequirement = (
  contrast: number,
  level: 'AA' | 'AAA' = 'AA',
  textSize: 'normal' | 'large' = 'normal'
): boolean => {
  const requirement = CONTRAST_REQUIREMENTS[level][textSize];
  return contrast >= requirement;
};

/**
 * Common ARIA patterns for complex widgets
 */
export const ARIA_PATTERNS = {
  /**
   * Accordion pattern
   */
  accordion: {
    container: {
      role: 'region',
    },
    trigger: {
      role: 'button',
      'aria-expanded': false,
      'aria-controls': 'panel-id',
    },
    panel: {
      role: 'region',
      'aria-labelledby': 'trigger-id',
      hidden: true,
    },
  },

  /**
   * Dialog pattern
   */
  dialog: {
    container: {
      role: 'dialog',
      'aria-modal': true,
      'aria-labelledby': 'title-id',
      'aria-describedby': 'description-id',
    },
    backdrop: {
      'aria-hidden': true,
    },
  },

  /**
   * Dropdown pattern
   */
  dropdown: {
    trigger: {
      role: 'button',
      'aria-haspopup': true,
      'aria-expanded': false,
      'aria-controls': 'menu-id',
    },
    menu: {
      role: 'menu',
      'aria-labelledby': 'trigger-id',
    },
    menuItem: {
      role: 'menuitem',
      tabindex: -1,
    },
  },

  /**
   * Tooltip pattern
   */
  tooltip: {
    trigger: {
      'aria-describedby': 'tooltip-id',
    },
    tooltip: {
      role: 'tooltip',
      'aria-hidden': true,
    },
  },

  /**
   * Tab pattern
   */
  tabs: {
    tablist: {
      role: 'tablist',
      'aria-orientation': 'horizontal',
    },
    tab: {
      role: 'tab',
      'aria-selected': false,
      'aria-controls': 'panel-id',
      tabindex: -1,
    },
    panel: {
      role: 'tabpanel',
      'aria-labelledby': 'tab-id',
      tabindex: 0,
    },
  },
} as const;

/**
 * Keyboard event handlers for common patterns
 */
export const createKeyboardHandler = (
  pattern: keyof typeof ARIA_ROLES,
  callbacks: Record<string, () => void>
) => {
  return (event: KeyboardEvent) => {
    const allowedKeys = ARIA_ROLES[pattern]?.keyboard || [];
    
    if ((allowedKeys as readonly string[]).includes(event.key)) {
      event.preventDefault();
      event.stopPropagation();
      
      const callback = callbacks[event.key];
      if (callback) {
        callback();
      }
    }
  };
};

/**
 * Validate ARIA properties for a given role
 */
export const validateAriaProperties = (
  element: HTMLElement,
  role: keyof typeof ARIA_ROLES
): { valid: boolean; missing: string[]; invalid: string[] } => {
  const roleDefinition = ARIA_ROLES[role];
  if (!roleDefinition) {
    return { valid: false, missing: [], invalid: [`Invalid role: ${role}`] };
  }

  const requiredProperties = roleDefinition.properties.filter(prop => 
    prop.startsWith('aria-') && !prop.includes('describedby')
  );
  
  const missing: string[] = [];
  const invalid: string[] = [];

  requiredProperties.forEach(prop => {
    const value = element.getAttribute(prop);
    if (value === null) {
      missing.push(prop);
    }
  });

  return {
    valid: missing.length === 0 && invalid.length === 0,
    missing,
    invalid,
  };
};
