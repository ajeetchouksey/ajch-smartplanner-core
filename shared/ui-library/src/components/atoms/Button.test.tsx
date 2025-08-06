/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { Button } from '../Button';

// Mock theme provider
const MockThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return <div data-testid="theme-provider">{children}</div>;
};

jest.mock('../../themes/ThemeProvider', () => ({
  useTheme: () => ({
    theme: {
      colors: {
        primary: { 500: '#3b82f6', 600: '#2563eb' },
        neutral: { 300: '#d1d5db', 500: '#6b7280' },
        error: { 500: '#ef4444' },
        success: { 500: '#10b981' },
        warning: { 500: '#f59e0b' },
      },
      spacing: { 2: '8px', 3: '12px', 4: '16px' },
      borderRadius: { md: '6px' },
      typography: {
        sizes: { base: '16px' },
        weights: { medium: 500 },
      },
      shadows: { sm: '0 1px 2px rgba(0, 0, 0, 0.05)' },
    },
  }),
}));

// Mock accessibility hooks
jest.mock('../../hooks/accessibility', () => ({
  useKeyboardNavigation: () => ({}),
  useLiveRegion: () => ({
    announce: jest.fn(),
  }),
}));

describe('Button Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Accessibility', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <Button>Test Button</Button>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      
      render(<Button onClick={handleClick}>Test Button</Button>);
      
      const button = screen.getByRole('button', { name: 'Test Button' });
      
      // Tab to button
      await user.tab();
      expect(button).toHaveFocus();
      
      // Activate with Enter
      await user.keyboard('{Enter}');
      expect(handleClick).toHaveBeenCalledTimes(1);
      
      // Activate with Space
      await user.keyboard(' ');
      expect(handleClick).toHaveBeenCalledTimes(2);
    });

    it('should have proper ARIA attributes', () => {
      render(
        <Button 
          disabled 
          aria-label="Custom label"
          aria-describedby="help-text"
        >
          Test Button
        </Button>
      );
      
      const button = screen.getByRole('button');
      
      expect(button).toHaveAttribute('aria-label', 'Custom label');
      expect(button).toHaveAttribute('aria-describedby', 'help-text');
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('should announce loading state to screen readers', () => {
      const { rerender } = render(<Button>Submit</Button>);
      
      rerender(<Button loading>Submit</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-busy', 'true');
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  describe('Functionality', () => {
    it('should call onClick when clicked', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      
      render(<Button onClick={handleClick}>Click me</Button>);
      
      const button = screen.getByRole('button', { name: 'Click me' });
      await user.click(button);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      
      render(
        <Button onClick={handleClick} disabled>
          Disabled Button
        </Button>
      );
      
      const button = screen.getByRole('button', { name: 'Disabled Button' });
      await user.click(button);
      
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should not call onClick when loading', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      
      render(
        <Button onClick={handleClick} loading>
          Loading Button
        </Button>
      );
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Visual States', () => {
    it('should render different variants correctly', () => {
      const variants = ['primary', 'secondary', 'outline', 'ghost'] as const;
      
      variants.forEach(variant => {
        const { container } = render(
          <Button variant={variant}>Test Button</Button>
        );
        
        expect(container.firstChild).toMatchSnapshot(`button-${variant}`);
      });
    });

    it('should render different sizes correctly', () => {
      const sizes = ['sm', 'md', 'lg'] as const;
      
      sizes.forEach(size => {
        const { container } = render(
          <Button size={size}>Test Button</Button>
        );
        
        expect(container.firstChild).toMatchSnapshot(`button-${size}`);
      });
    });

    it('should show loading spinner when loading', () => {
      render(<Button loading>Loading Button</Button>);
      
      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getByText('Loading Button')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should render quickly', () => {
      const startTime = performance.now();
      
      for (let i = 0; i < 100; i++) {
        const { unmount } = render(<Button>Performance Test</Button>);
        unmount();
      }
      
      const endTime = performance.now();
      const averageTime = (endTime - startTime) / 100;
      
      expect(averageTime).toBeLessThan(5); // Should render in less than 5ms on average
    });

    it('should not cause memory leaks', () => {
      const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;
      
      // Render and unmount many times
      for (let i = 0; i < 100; i++) {
        const { unmount } = render(<Button>Memory Test</Button>);
        unmount();
      }
      
      // Force garbage collection if available
      if ((global as any).gc) {
        (global as any).gc();
      }
      
      const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
      const memoryIncrease = finalMemory - initialMemory;
      
      // Memory increase should be minimal (less than 1MB)
      expect(memoryIncrease).toBeLessThan(1024 * 1024);
    });
  });

  describe('Edge Cases', () => {
    it('should handle extremely long text', () => {
      const longText = 'A'.repeat(1000);
      
      render(<Button>{longText}</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button.textContent).toBe(longText);
    });

    it('should handle rapid clicks', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      
      render(<Button onClick={handleClick}>Rapid Click Test</Button>);
      
      const button = screen.getByRole('button');
      
      // Simulate rapid clicking
      for (let i = 0; i < 10; i++) {
        await user.click(button);
      }
      
      expect(handleClick).toHaveBeenCalledTimes(10);
    });

    it('should work with React.forwardRef', () => {
      const ref = React.createRef<HTMLButtonElement>();
      
      render(<Button ref={ref}>Ref Test</Button>);
      
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
      expect(ref.current?.textContent).toBe('Ref Test');
    });
  });
});
