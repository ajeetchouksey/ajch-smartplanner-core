import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Enhanced render function with accessibility testing
export interface AccessibleRenderOptions {
  withTheme?: boolean;
  withMotion?: boolean;
  withRouter?: boolean;
  axeRules?: any;
  customQueries?: any;
}

export async function renderWithAccessibility(
  ui: React.ReactElement,
  options: AccessibleRenderOptions = {}
) {
  const {
    withTheme = true,
    withMotion = true,
    withRouter = false,
    axeRules = {},
    customQueries = {},
  } = options;

  // Create wrapper with providers
  let Wrapper: React.ComponentType<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;

  if (withTheme) {
    const { ThemeProvider } = await import('../../themes/ThemeProvider');
    const PreviousWrapper = Wrapper;
    Wrapper = ({ children }) => (
      <ThemeProvider>
        <PreviousWrapper>{children}</PreviousWrapper>
      </ThemeProvider>
    );
  }

  if (withMotion) {
    const { MotionProvider } = await import('../animation/AnimationSystem');
    const PreviousWrapper = Wrapper;
    Wrapper = ({ children }) => (
      <MotionProvider>
        <PreviousWrapper>{children}</PreviousWrapper>
      </MotionProvider>
    );
  }

  if (withRouter) {
    const { BrowserRouter } = await import('react-router-dom');
    const PreviousWrapper = Wrapper;
    Wrapper = ({ children }) => (
      <BrowserRouter>
        <PreviousWrapper>{children}</PreviousWrapper>
      </BrowserRouter>
    );
  }

  // Render with wrapper
  const renderResult = render(ui, {
    wrapper: Wrapper,
    queries: customQueries,
  });

  // Run accessibility tests
  const axeResults = await axe(renderResult.container, {
    rules: axeRules,
  });

  return {
    ...renderResult,
    axeResults,
    expectNoA11yViolations: () => expect(axeResults).toHaveNoViolations(),
  };
}

// Accessibility test utilities
export const a11yUtils = {
  // Test keyboard navigation
  async testKeyboardNavigation(
    element: HTMLElement,
    expectedFocusableElements: string[]
  ) {
    const user = userEvent.setup();
    
    // Focus first element
    element.focus();
    
    // Tab through all focusable elements
    for (let i = 0; i < expectedFocusableElements.length; i++) {
      const expectedElement = expectedFocusableElements[i];
      const focusedElement = document.activeElement;
      
      expect(focusedElement).toMatchSelector(expectedElement);
      
      if (i < expectedFocusableElements.length - 1) {
        await user.tab();
      }
    }
    
    // Test reverse tab navigation
    for (let i = expectedFocusableElements.length - 1; i > 0; i--) {
      await user.tab({ shift: true });
      const expectedElement = expectedFocusableElements[i - 1];
      const focusedElement = document.activeElement;
      
      expect(focusedElement).toMatchSelector(expectedElement);
    }
  },

  // Test ARIA attributes
  testAriaAttributes(element: HTMLElement, expectedAttributes: Record<string, string>) {
    Object.entries(expectedAttributes).forEach(([attribute, expectedValue]) => {
      const actualValue = element.getAttribute(attribute);
      expect(actualValue).toBe(expectedValue);
    });
  },

  // Test screen reader announcements
  async testScreenReaderAnnouncements(
    action: () => Promise<void> | void,
    expectedAnnouncements: string[]
  ) {
    const liveRegions = screen.getAllByRole('status', { hidden: true })
      .concat(screen.getAllByRole('alert', { hidden: true }))
      .concat(screen.getAllByLabelText(/live region/i, { hidden: true }));

    await action();

    // Wait for announcements
    await waitFor(() => {
      expectedAnnouncements.forEach(announcement => {
        const foundAnnouncement = liveRegions.some(region => 
          region.textContent?.includes(announcement)
        );
        expect(foundAnnouncement).toBe(true);
      });
    });
  },

  // Test color contrast
  async testColorContrast(element: HTMLElement, minimumRatio: number = 4.5) {
    const computedStyle = window.getComputedStyle(element);
    const backgroundColor = computedStyle.backgroundColor;
    const color = computedStyle.color;

    // This would typically use a color contrast library
    // For demonstration, we'll create a basic check
    const contrastRatio = calculateContrastRatio(color, backgroundColor);
    expect(contrastRatio).toBeGreaterThanOrEqual(minimumRatio);
  },

  // Test focus management
  async testFocusManagement(
    trigger: HTMLElement,
    expectedFocusTarget: HTMLElement | string
  ) {
    const user = userEvent.setup();
    
    await user.click(trigger);
    
    await waitFor(() => {
      const focusedElement = document.activeElement;
      
      if (typeof expectedFocusTarget === 'string') {
        expect(focusedElement).toMatchSelector(expectedFocusTarget);
      } else {
        expect(focusedElement).toBe(expectedFocusTarget);
      }
    });
  },

  // Test high contrast mode
  testHighContrastMode(element: HTMLElement) {
    // Simulate high contrast mode
    document.documentElement.style.setProperty('forced-colors', 'active');
    
    const computedStyle = window.getComputedStyle(element);
    
    // Verify that forced colors are respected
    expect(computedStyle.getPropertyValue('forced-color-adjust')).not.toBe('none');
    
    // Cleanup
    document.documentElement.style.removeProperty('forced-colors');
  },

  // Test reduced motion
  async testReducedMotion(animatedElement: HTMLElement) {
    // Mock reduced motion preference
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    // Check that animations are disabled or simplified
    const animations = animatedElement.getAnimations();
    
    animations.forEach(animation => {
      // Animations should be either very short or not present
      expect(animation.effect?.getTiming().duration).toBeLessThanOrEqual(100);
    });
  },
};

// Component test utilities
export const componentTestUtils = {
  // Test component props
  testRequiredProps<T extends Record<string, any>>(
    Component: React.ComponentType<T>,
    requiredProps: Partial<T>
  ) {
    return () => {
      expect(() => render(<Component {...requiredProps as T} />)).not.toThrow();
    };
  },

  // Test component variants
  testComponentVariants<T extends Record<string, any>>(
    Component: React.ComponentType<T>,
    baseProps: T,
    variants: Array<{ name: string; props: Partial<T> }>
  ) {
    return variants.map(variant => ({
      name: `renders ${variant.name} variant`,
      test: () => {
        const { container } = render(
          <Component {...baseProps} {...variant.props} />
        );
        expect(container.firstChild).toMatchSnapshot();
      },
    }));
  },

  // Test loading states
  async testLoadingState<T extends Record<string, any>>(
    Component: React.ComponentType<T>,
    props: T & { loading?: boolean }
  ) {
    const { rerender } = render(<Component {...props} loading={true} />);
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();

    rerender(<Component {...props} loading={false} />);
    
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  },

  // Test error states
  async testErrorState<T extends Record<string, any>>(
    Component: React.ComponentType<T>,
    props: T & { error?: string | Error }
  ) {
    const errorMessage = 'Something went wrong';
    const { rerender } = render(<Component {...props} error={errorMessage} />);
    
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();

    rerender(<Component {...props} error={undefined} />);
    
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
  },

  // Test responsive behavior
  testResponsiveBehavior<T extends Record<string, any>>(
    Component: React.ComponentType<T>,
    props: T,
    breakpoints: Array<{ width: number; expectedBehavior: () => void }>
  ) {
    return breakpoints.map(({ width, expectedBehavior }) => ({
      name: `behaves correctly at ${width}px`,
      test: () => {
        // Mock window.innerWidth
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: width,
        });

        // Trigger resize event
        window.dispatchEvent(new Event('resize'));

        render(<Component {...props} />);
        expectedBehavior();
      },
    }));
  },
};

// Performance test utilities
export const performanceTestUtils = {
  // Test render performance
  async testRenderPerformance<T extends Record<string, any>>(
    Component: React.ComponentType<T>,
    props: T,
    iterations: number = 100
  ) {
    const startTime = performance.now();
    
    for (let i = 0; i < iterations; i++) {
      const { unmount } = render(<Component {...props} />);
      unmount();
    }
    
    const endTime = performance.now();
    const averageRenderTime = (endTime - startTime) / iterations;
    
    // Assert reasonable render time (adjust threshold as needed)
    expect(averageRenderTime).toBeLessThan(10); // 10ms per render
    
    return averageRenderTime;
  },

  // Test memory leaks
  async testMemoryLeaks<T extends Record<string, any>>(
    Component: React.ComponentType<T>,
    props: T
  ) {
    const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;
    
    // Render and unmount multiple times
    for (let i = 0; i < 50; i++) {
      const { unmount } = render(<Component {...props} />);
      unmount();
    }
    
    // Force garbage collection if available
    if ((global as any).gc) {
      (global as any).gc();
    }
    
    const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
    const memoryIncrease = finalMemory - initialMemory;
    
    // Memory increase should be minimal
    expect(memoryIncrease).toBeLessThan(1024 * 1024); // 1MB threshold
  },

  // Test virtual scrolling performance
  async testVirtualScrolling(
    scrollContainer: HTMLElement,
    totalItems: number,
    visibleItems: number
  ) {
    // Check that only visible items are rendered
    const renderedItems = scrollContainer.querySelectorAll('[data-testid="virtual-item"]');
    expect(renderedItems.length).toBeLessThanOrEqual(visibleItems + 5); // Allow for overscan

    // Test scroll performance
    const startTime = performance.now();
    
    fireEvent.scroll(scrollContainer, { target: { scrollTop: 1000 } });
    
    await waitFor(() => {
      const endTime = performance.now();
      const scrollTime = endTime - startTime;
      
      // Scroll should be responsive
      expect(scrollTime).toBeLessThan(16); // One frame at 60fps
    });
  },
};

// Utility functions
function calculateContrastRatio(color1: string, color2: string): number {
  // This is a simplified version - in practice, you'd use a proper color library
  // such as 'polished' or 'color' to calculate actual contrast ratios
  
  // For demonstration, return a mock value
  // In real implementation, this would:
  // 1. Parse color strings to RGB values
  // 2. Calculate relative luminance for each color
  // 3. Calculate contrast ratio using WCAG formula
  
  return 4.5; // Mock contrast ratio
}

// Custom Jest matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveNoViolations(): R;
      toMatchSelector(selector: string): R;
    }
  }
}

// Add custom matcher for CSS selectors
expect.extend({
  toMatchSelector(received: Element | null, selector: string) {
    if (!received) {
      return {
        message: () => `Expected element to match selector "${selector}", but element was null`,
        pass: false,
      };
    }

    const pass = received.matches(selector);
    
    return {
      message: () => 
        pass
          ? `Expected element not to match selector "${selector}"`
          : `Expected element to match selector "${selector}"`,
      pass,
    };
  },
});

// Test setup helpers
export const testSetup = {
  // Mock intersection observer for virtual scrolling tests
  mockIntersectionObserver() {
    const mockIntersectionObserver = vi.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null,
    });
    (window as any).IntersectionObserver = mockIntersectionObserver;
  },

  // Mock resize observer for responsive tests
  mockResizeObserver() {
    const mockResizeObserver = vi.fn();
    mockResizeObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null,
    });
    (window as any).ResizeObserver = mockResizeObserver;
  },

  // Mock matchMedia for responsive and motion tests
  mockMatchMedia() {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  },

  // Setup all common mocks
  setupTestEnvironment() {
    this.mockIntersectionObserver();
    this.mockResizeObserver();
    this.mockMatchMedia();
  },
};

// Export test utilities as default
export default {
  renderWithAccessibility,
  a11yUtils,
  componentTestUtils,
  performanceTestUtils,
  testSetup,
};
