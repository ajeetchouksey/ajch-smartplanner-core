import React, { 
  createContext, 
  useContext, 
  useEffect, 
  useState, 
  useCallback, 
  useMemo,
  useRef
} from 'react';

// Animation types and interfaces
export type EasingFunction = 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear' | 'cubic-bezier';

export interface AnimationConfig {
  duration?: number;
  delay?: number;
  easing?: EasingFunction;
  iterations?: number | 'infinite';
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
  respectReducedMotion?: boolean;
}

export interface TransitionConfig extends AnimationConfig {
  property?: string;
}

export interface KeyframeAnimation {
  name: string;
  keyframes: Record<string, any>[];
  config?: AnimationConfig;
}

// Motion preferences context
interface MotionContextValue {
  prefersReducedMotion: boolean;
  animationsEnabled: boolean;
  setAnimationsEnabled: (enabled: boolean) => void;
}

const MotionContext = createContext<MotionContextValue>({
  prefersReducedMotion: false,
  animationsEnabled: true,
  setAnimationsEnabled: () => {},
});

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const contextValue = useMemo(() => ({
    prefersReducedMotion,
    animationsEnabled,
    setAnimationsEnabled,
  }), [prefersReducedMotion, animationsEnabled]);

  return (
    <MotionContext.Provider value={contextValue}>
      {children}
    </MotionContext.Provider>
  );
}

export function useMotion() {
  return useContext(MotionContext);
}

// Animation hook for element animations
export function useAnimation(config: AnimationConfig = {}) {
  const { prefersReducedMotion, animationsEnabled } = useMotion();
  const elementRef = useRef<HTMLDivElement>(null);

  const shouldAnimate = useMemo(() => {
    if (!animationsEnabled) return false;
    if (config.respectReducedMotion !== false && prefersReducedMotion) return false;
    return true;
  }, [animationsEnabled, prefersReducedMotion, config.respectReducedMotion]);

  const animate = useCallback((
    keyframes: Keyframe[] | PropertyIndexedKeyframes,
    options?: KeyframeAnimationOptions
  ) => {
    if (!elementRef.current || !shouldAnimate) {
      return Promise.resolve();
    }

    const animationOptions: KeyframeAnimationOptions = {
      duration: config.duration || 300,
      delay: config.delay || 0,
      easing: config.easing || 'ease',
      iterations: typeof config.iterations === 'string' ? Infinity : (config.iterations || 1),
      direction: config.direction || 'normal',
      fill: config.fillMode || 'forwards',
      ...options,
    };

    return elementRef.current.animate(keyframes, animationOptions).finished;
  }, [shouldAnimate, config]);

  const fadeIn = useCallback((options?: Partial<AnimationConfig>) => {
    return animate(
      [
        { opacity: 0, transform: 'translateY(20px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ],
      {
        duration: options?.duration || config.duration || 300,
        easing: options?.easing || config.easing || 'ease-out',
      }
    );
  }, [animate, config]);

  const fadeOut = useCallback((options?: Partial<AnimationConfig>) => {
    return animate(
      [
        { opacity: 1, transform: 'translateY(0)' },
        { opacity: 0, transform: 'translateY(-20px)' }
      ],
      {
        duration: options?.duration || config.duration || 300,
        easing: options?.easing || config.easing || 'ease-in',
      }
    );
  }, [animate, config]);

  const slideIn = useCallback((direction: 'left' | 'right' | 'up' | 'down' = 'right', options?: Partial<AnimationConfig>) => {
    const transforms = {
      left: ['translateX(-100%)', 'translateX(0)'],
      right: ['translateX(100%)', 'translateX(0)'],
      up: ['translateY(-100%)', 'translateY(0)'],
      down: ['translateY(100%)', 'translateY(0)'],
    };

    return animate(
      [
        { transform: transforms[direction][0], opacity: 0 },
        { transform: transforms[direction][1], opacity: 1 }
      ],
      {
        duration: options?.duration || config.duration || 400,
        easing: options?.easing || config.easing || 'ease-out',
      }
    );
  }, [animate, config]);

  const scale = useCallback((scale: number = 1.1, options?: Partial<AnimationConfig>) => {
    return animate(
      [
        { transform: 'scale(1)' },
        { transform: `scale(${scale})` },
        { transform: 'scale(1)' }
      ],
      {
        duration: options?.duration || config.duration || 200,
        easing: options?.easing || config.easing || 'ease-in-out',
      }
    );
  }, [animate, config]);

  const shake = useCallback((intensity: number = 10, options?: Partial<AnimationConfig>) => {
    return animate(
      [
        { transform: 'translateX(0)' },
        { transform: `translateX(-${intensity}px)` },
        { transform: `translateX(${intensity}px)` },
        { transform: `translateX(-${intensity}px)` },
        { transform: 'translateX(0)' }
      ],
      {
        duration: options?.duration || config.duration || 400,
        easing: options?.easing || config.easing || 'ease-in-out',
      }
    );
  }, [animate, config]);

  const pulse = useCallback((options?: Partial<AnimationConfig>) => {
    return animate(
      [
        { transform: 'scale(1)', opacity: 1 },
        { transform: 'scale(1.05)', opacity: 0.8 },
        { transform: 'scale(1)', opacity: 1 }
      ],
      {
        duration: options?.duration || config.duration || 1000,
        easing: options?.easing || config.easing || 'ease-in-out',
        iterations: typeof options?.iterations === 'string' ? Infinity : (options?.iterations || Infinity),
      }
    );
  }, [animate, config]);

  return {
    ref: elementRef,
    animate,
    fadeIn,
    fadeOut,
    slideIn,
    scale,
    shake,
    pulse,
    shouldAnimate,
  };
}

// Transition hook for CSS transitions
export function useTransition(config: TransitionConfig = {}) {
  const { prefersReducedMotion, animationsEnabled } = useMotion();
  const elementRef = useRef<HTMLElement>(null);

  const shouldAnimate = useMemo(() => {
    if (!animationsEnabled) return false;
    if (config.respectReducedMotion !== false && prefersReducedMotion) return false;
    return true;
  }, [animationsEnabled, prefersReducedMotion, config.respectReducedMotion]);

  const transitionStyles = useMemo(() => {
    if (!shouldAnimate) return {};

    const duration = config.duration || 300;
    const easing = config.easing || 'ease';
    const delay = config.delay || 0;
    const property = config.property || 'all';

    return {
      transition: `${property} ${duration}ms ${easing} ${delay}ms`,
    };
  }, [shouldAnimate, config]);

  return {
    ref: elementRef,
    transitionStyles,
    shouldAnimate,
  };
}

// Spring animation hook
export function useSpring(to: Record<string, number>, config: AnimationConfig = {}) {
  const { prefersReducedMotion, animationsEnabled } = useMotion();
  const [values, setValues] = useState(to);
  const [isAnimating, setIsAnimating] = useState(false);

  const shouldAnimate = useMemo(() => {
    if (!animationsEnabled) return false;
    if (config.respectReducedMotion !== false && prefersReducedMotion) return false;
    return true;
  }, [animationsEnabled, prefersReducedMotion, config.respectReducedMotion]);

  const animate = useCallback(() => {
    if (!shouldAnimate) {
      setValues(to);
      return Promise.resolve();
    }

    setIsAnimating(true);
    
    return new Promise<void>((resolve) => {
      const duration = config.duration || 500;
      const startTime = performance.now();
      const startValues = { ...values };

      const animateFrame = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (ease-out)
        const easedProgress = 1 - Math.pow(1 - progress, 3);

        const newValues: Record<string, number> = {};
        Object.keys(to).forEach(key => {
          const start = startValues[key] || 0;
          const end = to[key];
          newValues[key] = start + (end - start) * easedProgress;
        });

        setValues(newValues);

        if (progress < 1) {
          requestAnimationFrame(animateFrame);
        } else {
          setIsAnimating(false);
          resolve();
        }
      };

      requestAnimationFrame(animateFrame);
    });
  }, [to, values, shouldAnimate, config.duration]);

  useEffect(() => {
    animate();
  }, [animate]);

  return { values, isAnimating };
}

// Stagger animation hook for lists
export function useStagger(itemCount: number, config: AnimationConfig = {}) {
  const { prefersReducedMotion, animationsEnabled } = useMotion();
  const itemRefs = useRef<(HTMLElement | null)[]>([]);

  const shouldAnimate = useMemo(() => {
    if (!animationsEnabled) return false;
    if (config.respectReducedMotion !== false && prefersReducedMotion) return false;
    return true;
  }, [animationsEnabled, prefersReducedMotion, config.respectReducedMotion]);

  const setItemRef = useCallback((index: number) => (el: HTMLElement | null) => {
    itemRefs.current[index] = el;
  }, []);

  const animateItems = useCallback(async (
    keyframes: Keyframe[] | PropertyIndexedKeyframes,
    options: KeyframeAnimationOptions = {}
  ) => {
    if (!shouldAnimate) return Promise.resolve();

    const staggerDelay = 100; // ms between each item
    const promises: Promise<Animation>[] = [];

    itemRefs.current.forEach((element, index) => {
      if (element) {
        const animationOptions: KeyframeAnimationOptions = {
          duration: config.duration || 300,
          delay: (config.delay || 0) + (index * staggerDelay),
          easing: config.easing || 'ease-out',
          fill: config.fillMode || 'forwards',
          ...options,
        };

        promises.push(element.animate(keyframes, animationOptions).finished);
      }
    });

    return Promise.all(promises);
  }, [shouldAnimate, config]);

  const fadeInStagger = useCallback(() => {
    return animateItems([
      { opacity: 0, transform: 'translateY(20px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ]);
  }, [animateItems]);

  const slideInStagger = useCallback((direction: 'left' | 'right' | 'up' | 'down' = 'up') => {
    const transforms = {
      left: ['translateX(-50px)', 'translateX(0)'],
      right: ['translateX(50px)', 'translateX(0)'],
      up: ['translateY(-50px)', 'translateY(0)'],
      down: ['translateY(50px)', 'translateY(0)'],
    };

    return animateItems([
      { opacity: 0, transform: transforms[direction][0] },
      { opacity: 1, transform: transforms[direction][1] }
    ]);
  }, [animateItems]);

  return {
    setItemRef,
    animateItems,
    fadeInStagger,
    slideInStagger,
    shouldAnimate,
  };
}

// Animation components
interface AnimatedProps {
  children: React.ReactNode;
  animation?: 'fadeIn' | 'slideIn' | 'scale' | 'pulse';
  direction?: 'left' | 'right' | 'up' | 'down';
  duration?: number;
  delay?: number;
  easing?: EasingFunction;
  trigger?: 'mount' | 'hover' | 'focus' | 'manual';
  respectReducedMotion?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onAnimationStart?: () => void;
  onAnimationEnd?: () => void;
}

export function Animated({
  children,
  animation = 'fadeIn',
  direction = 'up',
  duration = 300,
  delay = 0,
  easing = 'ease-out',
  trigger = 'mount',
  respectReducedMotion = true,
  className = '',
  style = {},
  onAnimationStart,
  onAnimationEnd,
}: AnimatedProps) {
  const { ref, fadeIn, slideIn, scale, pulse } = useAnimation({
    duration,
    delay,
    easing,
    respectReducedMotion,
  });
  const [hasAnimated, setHasAnimated] = useState(false);

  const runAnimation = useCallback(async () => {
    if (hasAnimated && trigger === 'mount') return;

    onAnimationStart?.();
    setHasAnimated(true);

    try {
      switch (animation) {
        case 'fadeIn':
          await fadeIn();
          break;
        case 'slideIn':
          await slideIn(direction);
          break;
        case 'scale':
          await scale();
          break;
        case 'pulse':
          await pulse();
          break;
      }
    } finally {
      onAnimationEnd?.();
    }
  }, [animation, direction, fadeIn, slideIn, scale, pulse, hasAnimated, trigger, onAnimationStart, onAnimationEnd]);

  useEffect(() => {
    if (trigger === 'mount') {
      runAnimation();
    }
  }, [trigger, runAnimation]);

  const handleMouseEnter = trigger === 'hover' ? runAnimation : undefined;
  const handleFocus = trigger === 'focus' ? runAnimation : undefined;

  return (
    <div
      ref={ref}
      className={className}
      style={style}
      onMouseEnter={handleMouseEnter}
      onFocus={handleFocus}
    >
      {children}
    </div>
  );
}

// Transition group for enter/exit animations
interface TransitionGroupProps {
  children: React.ReactNode;
  appear?: boolean;
  enter?: boolean;
  exit?: boolean;
  className?: string;
}

export function TransitionGroup({
  children,
  appear = true,
  enter = true,
  exit = true,
  className = '',
}: TransitionGroupProps) {
  const [items, setItems] = useState<React.ReactElement[]>([]);
  const { animationsEnabled } = useMotion();

  useEffect(() => {
    const childArray = React.Children.toArray(children) as React.ReactElement[];
    
    if (!animationsEnabled) {
      setItems(childArray);
      return;
    }

    // Handle enter animations
    if (enter) {
      const newItems = childArray.filter(child => 
        !items.find(item => item.key === child.key)
      );

      newItems.forEach(item => {
        // Trigger enter animation
        setTimeout(() => {
          // Animation logic would go here
        }, 0);
      });
    }

    // Handle exit animations
    if (exit) {
      const exitingItems = items.filter(item => 
        !childArray.find(child => child.key === item.key)
      );

      if (exitingItems.length > 0) {
        // Trigger exit animations, then remove items
        setTimeout(() => {
          setItems(childArray);
        }, 300); // Animation duration
        return;
      }
    }

    setItems(childArray);
  }, [children, items, animationsEnabled, enter, exit]);

  return (
    <div className={className}>
      {items}
    </div>
  );
}

// CSS keyframes generator
export function generateKeyframes(name: string, keyframes: Record<string, any>[]) {
  const keyframeRules = keyframes.map((keyframe, index) => {
    const percentage = index === 0 ? 0 : index === keyframes.length - 1 ? 100 : (index / (keyframes.length - 1)) * 100;
    const rules = Object.entries(keyframe)
      .map(([property, value]) => `${property}: ${value}`)
      .join('; ');
    return `${percentage}% { ${rules} }`;
  }).join('\n  ');

  return `
@keyframes ${name} {
  ${keyframeRules}
}
  `.trim();
}

// Performance-optimized animation utilities
export const animationUtils = {
  // Preload animations to prevent layout thrashing
  preloadAnimation: (element: HTMLElement) => {
    element.style.willChange = 'transform, opacity';
  },

  // Clean up after animation
  cleanupAnimation: (element: HTMLElement) => {
    element.style.willChange = 'auto';
  },

  // Check if element is in viewport for performance
  isInViewport: (element: HTMLElement, threshold = 0.1) => {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;

    return (
      rect.top < windowHeight * (1 + threshold) &&
      rect.bottom > -windowHeight * threshold &&
      rect.left < windowWidth * (1 + threshold) &&
      rect.right > -windowWidth * threshold
    );
  },

  // Throttled scroll handler for performance
  createScrollHandler: (callback: () => void, delay = 16) => {
    let timeoutId: NodeJS.Timeout | null = null;
    
    return () => {
      if (timeoutId) return;
      
      timeoutId = setTimeout(() => {
        callback();
        timeoutId = null;
      }, delay);
    };
  },
};
