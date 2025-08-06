import React, { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useKeyboardNavigation, useFocusManagement, useLiveRegion } from '../../hooks/accessibility';
import { generateAccessibleId, getFocusableElements } from '../../utils/accessibility/wcagUtils';
import { Button } from '../atoms/Button';

export interface AccessibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  initialFocusRef?: React.RefObject<HTMLElement>;
  finalFocusRef?: React.RefObject<HTMLElement>;
  className?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

export const AccessibleModal: React.FC<AccessibleModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  initialFocusRef,
  finalFocusRef,
  className = '',
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousActiveElement = useRef<Element | null>(null);
  
  const { announce } = useLiveRegion();
  const { ref: focusRef, isActive, setIsActive, focusFirst } = useFocusManagement<HTMLDivElement>(true);

  // Generate IDs for accessibility
  const modalId = generateAccessibleId('modal');
  const titleId = generateAccessibleId('modal-title');
  const descriptionId = description ? generateAccessibleId('modal-description') : undefined;

  // Handle keyboard navigation
  useKeyboardNavigation({
    onEscape: closeOnEscape ? onClose : undefined,
  });

  // Focus management
  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element
      previousActiveElement.current = document.activeElement;
      
      // Set modal as active for focus trapping
      setIsActive(true);
      
      // Focus initial element after a small delay to ensure DOM is ready
      setTimeout(() => {
        if (initialFocusRef?.current) {
          initialFocusRef.current.focus();
        } else if (closeButtonRef.current) {
          closeButtonRef.current.focus();
        } else {
          focusFirst();
        }
      }, 100);

      // Announce modal opening
      announce(`${title} dialog opened`, 'polite');

      // Prevent body scroll
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = '';
      };
    } else {
      setIsActive(false);
      
      // Restore focus to the element that was focused before the modal opened
      if (finalFocusRef?.current) {
        finalFocusRef.current.focus();
      } else if (previousActiveElement.current instanceof HTMLElement) {
        previousActiveElement.current.focus();
      }
    }
  }, [isOpen, initialFocusRef, finalFocusRef, setIsActive, focusFirst, announce, title]);

  // Handle overlay click
  const handleOverlayClick = useCallback((event: React.MouseEvent) => {
    if (closeOnOverlayClick && event.target === overlayRef.current) {
      onClose();
    }
  }, [closeOnOverlayClick, onClose]);

  // Handle focus trapping
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!modalRef.current || !isOpen) return;

    if (event.key === 'Tab') {
      const focusableElements = getFocusableElements(modalRef.current);
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
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { width: '90vw', maxWidth: '400px' };
      case 'md':
        return { width: '90vw', maxWidth: '500px' };
      case 'lg':
        return { width: '90vw', maxWidth: '700px' };
      case 'xl':
        return { width: '90vw', maxWidth: '900px' };
      case 'full':
        return { width: '95vw', height: '95vh' };
      default:
        return { width: '90vw', maxWidth: '500px' };
    }
  };

  const overlayStyles: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
  };

  const modalStyles: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    position: 'relative',
    maxHeight: '90vh',
    overflow: 'auto',
    ...getSizeStyles(),
  };

  const headerStyles: React.CSSProperties = {
    padding: '1.5rem 1.5rem 1rem',
    borderBottom: '1px solid #e5e7eb',
  };

  const titleStyles: React.CSSProperties = {
    margin: 0,
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#111827',
  };

  const descriptionStyles: React.CSSProperties = {
    margin: '0.5rem 0 0',
    fontSize: '0.875rem',
    color: '#6b7280',
  };

  const closeButtonStyles: React.CSSProperties = {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    padding: '0.5rem',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    color: '#6b7280',
  };

  const contentStyles: React.CSSProperties = {
    padding: '1rem 1.5rem 1.5rem',
  };

  const modalContent = (
    <div
      ref={overlayRef}
      style={overlayStyles}
      onClick={handleOverlayClick}
      aria-hidden="true"
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaLabel ? undefined : titleId}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy || descriptionId}
        style={modalStyles}
        className={className}
      >
        {/* Header */}
        <div style={headerStyles}>
          <h2 id={titleId} style={titleStyles}>
            {title}
          </h2>
          {description && (
            <p id={descriptionId} style={descriptionStyles}>
              {description}
            </p>
          )}
          
          {showCloseButton && (
            <button
              ref={closeButtonRef}
              onClick={onClose}
              style={closeButtonStyles}
              aria-label="Close dialog"
              type="button"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Content */}
        <div style={contentStyles}>
          {children}
        </div>
      </div>
    </div>
  );

  // Render modal in portal to avoid z-index issues
  return createPortal(modalContent, document.body);
};
