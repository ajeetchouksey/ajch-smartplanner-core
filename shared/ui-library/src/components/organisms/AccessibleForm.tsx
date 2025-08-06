import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useTheme } from '../../themes/ThemeProvider';
import { useKeyboardNavigation, useAriaLabeling, useLiveRegion } from '../../hooks/accessibility';
import { useDebounce } from '../../hooks/performance/useVirtualScroll';

export interface FormFieldConfig {
  name: string;
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'file' | 'date' | 'time';
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  validation?: {
    pattern?: RegExp;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    custom?: (value: any) => string | null;
  };
  options?: Array<{ value: string; label: string; disabled?: boolean }>;
  multiple?: boolean;
  accept?: string; // For file inputs
  autocomplete?: string;
  'aria-describedby'?: string;
}

export interface FormData {
  [key: string]: any;
}

export interface FormErrors {
  [key: string]: string[];
}

export interface AccessibleFormProps {
  fields: FormFieldConfig[];
  initialData?: FormData;
  onSubmit: (data: FormData) => Promise<void> | void;
  onFieldChange?: (name: string, value: any) => void;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  submitButtonText?: string;
  resetButtonText?: string;
  loadingText?: string;
  successMessage?: string;
  errorMessage?: string;
  className?: string;
  'aria-label'?: string;
}

export function AccessibleForm({
  fields,
  initialData = {},
  onSubmit,
  onFieldChange,
  validateOnChange = false,
  validateOnBlur = true,
  submitButtonText = 'Submit',
  resetButtonText = 'Reset',
  loadingText = 'Submitting...',
  successMessage,
  errorMessage,
  className = '',
  'aria-label': ariaLabel,
}: AccessibleFormProps) {
  const { theme } = useTheme();
  const { announce } = useLiveRegion();
  const formRef = useRef<HTMLFormElement>(null);
  
  // Form state
  const [formData, setFormData] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Debounced validation for real-time feedback
  const debouncedFormData = useDebounce(formData, 300);

  // Validation logic
  const validateField = useCallback((field: FormFieldConfig, value: any): string[] => {
    const fieldErrors: string[] = [];

    // Required validation
    if (field.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      fieldErrors.push(`${field.label} is required`);
      return fieldErrors; // Skip other validations if required field is empty
    }

    // Skip other validations if field is empty and not required
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return fieldErrors;
    }

    const validation = field.validation;
    if (!validation) return fieldErrors;

    // Pattern validation
    if (validation.pattern && typeof value === 'string' && !validation.pattern.test(value)) {
      fieldErrors.push(`${field.label} format is invalid`);
    }

    // Length validations
    if (validation.minLength && typeof value === 'string' && value.length < validation.minLength) {
      fieldErrors.push(`${field.label} must be at least ${validation.minLength} characters`);
    }

    if (validation.maxLength && typeof value === 'string' && value.length > validation.maxLength) {
      fieldErrors.push(`${field.label} must be no more than ${validation.maxLength} characters`);
    }

    // Numeric validations
    if (validation.min !== undefined && typeof value === 'number' && value < validation.min) {
      fieldErrors.push(`${field.label} must be at least ${validation.min}`);
    }

    if (validation.max !== undefined && typeof value === 'number' && value > validation.max) {
      fieldErrors.push(`${field.label} must be no more than ${validation.max}`);
    }

    // Custom validation
    if (validation.custom) {
      const customError = validation.custom(value);
      if (customError) {
        fieldErrors.push(customError);
      }
    }

    return fieldErrors;
  }, []);

  // Validate all fields
  const validateForm = useCallback((): FormErrors => {
    const newErrors: FormErrors = {};

    fields.forEach(field => {
      const fieldErrors = validateField(field, formData[field.name]);
      if (fieldErrors.length > 0) {
        newErrors[field.name] = fieldErrors;
      }
    });

    return newErrors;
  }, [fields, formData, validateField]);

  // Real-time validation on data change
  useEffect(() => {
    if (validateOnChange) {
      const newErrors = validateForm();
      setErrors(newErrors);
    }
  }, [debouncedFormData, validateOnChange, validateForm]);

  // Handle field changes
  const handleFieldChange = useCallback((field: FormFieldConfig, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field.name]: value,
    }));

    onFieldChange?.(field.name, value);

    // Validate on blur if the field has been touched
    if (validateOnBlur && touched[field.name]) {
      const fieldErrors = validateField(field, value);
      setErrors(prev => ({
        ...prev,
        [field.name]: fieldErrors,
      }));
    }
  }, [onFieldChange, validateOnBlur, touched, validateField]);

  // Handle field blur
  const handleFieldBlur = useCallback((field: FormFieldConfig) => {
    setTouched(prev => ({
      ...prev,
      [field.name]: true,
    }));

    if (validateOnBlur) {
      const fieldErrors = validateField(field, formData[field.name]);
      setErrors(prev => ({
        ...prev,
        [field.name]: fieldErrors,
      }));

      // Announce errors to screen readers
      if (fieldErrors.length > 0) {
        announce(`${field.label} has ${fieldErrors.length} error${fieldErrors.length > 1 ? 's' : ''}: ${fieldErrors.join(', ')}`, 'assertive');
      }
    }
  }, [validateOnBlur, formData, validateField, announce]);

  // Handle form submission
  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (isSubmitting) return;

    const formErrors = validateForm();
    setErrors(formErrors);

    const hasErrors = Object.keys(formErrors).length > 0;
    if (hasErrors) {
      const errorCount = Object.values(formErrors).flat().length;
      announce(`Form submission failed. ${errorCount} error${errorCount > 1 ? 's' : ''} found.`, 'assertive');
      
      // Focus first field with error
      const firstErrorField = Object.keys(formErrors)[0];
      const firstErrorElement = formRef.current?.querySelector(`[name="${firstErrorField}"]`) as HTMLElement;
      firstErrorElement?.focus();
      
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitStatus('idle');
      
      await onSubmit(formData);
      
      setSubmitStatus('success');
      announce(successMessage || 'Form submitted successfully', 'polite');
    } catch (error) {
      setSubmitStatus('error');
      announce(errorMessage || 'Form submission failed. Please try again.', 'assertive');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, isSubmitting, validateForm, onSubmit, announce, successMessage, errorMessage]);

  // Handle form reset
  const handleReset = useCallback(() => {
    setFormData(initialData);
    setErrors({});
    setTouched({});
    setSubmitStatus('idle');
    announce('Form has been reset', 'polite');
  }, [initialData, announce]);

  // Generate ARIA attributes
  const getFieldAriaAttributes = useCallback((field: FormFieldConfig) => {
    const fieldErrors = errors[field.name] || [];
    const hasErrors = fieldErrors.length > 0;
    
    return {
      'aria-invalid': hasErrors,
      'aria-describedby': [
        field['aria-describedby'],
        hasErrors ? `${field.name}-error` : undefined,
        `${field.name}-help`,
      ].filter(Boolean).join(' ') || undefined,
      'aria-required': field.required,
    };
  }, [errors]);

  // Render field based on type
  const renderField = useCallback((field: FormFieldConfig) => {
    const value = formData[field.name] || '';
    const fieldErrors = errors[field.name] || [];
    const hasErrors = fieldErrors.length > 0;
    const ariaAttributes = getFieldAriaAttributes(field);

    const baseStyles: React.CSSProperties = {
      padding: theme.spacing[3],
      border: `2px solid ${hasErrors ? theme.colors.error[500] : theme.colors.neutral[300]}`,
      borderRadius: theme.borderRadius.md,
      fontSize: theme.typography.sizes.base,
      backgroundColor: field.disabled ? theme.colors.neutral[100] : 'transparent',
      color: field.disabled ? theme.colors.neutral[500] : 'inherit',
      outline: 'none',
      transition: 'border-color 0.2s ease',
      width: '100%',
    };

    const focusStyles: React.CSSProperties = {
      borderColor: hasErrors ? theme.colors.error[500] : theme.colors.primary[500],
      boxShadow: `0 0 0 2px ${hasErrors ? theme.colors.error[200] : theme.colors.primary[200]}`,
    };

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            name={field.name}
            value={value}
            placeholder={field.placeholder}
            required={field.required}
            disabled={field.disabled}
            readOnly={field.readonly}
            autoComplete={field.autocomplete}
            style={baseStyles}
            rows={4}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            onFocus={(e) => {
              Object.assign(e.target.style, focusStyles);
            }}
            onBlur={(e) => {
              Object.assign(e.target.style, { borderColor: hasErrors ? theme.colors.error[500] : theme.colors.neutral[300], boxShadow: 'none' });
              handleFieldBlur(field);
            }}
            {...ariaAttributes}
          />
        );

      case 'select':
        return (
          <select
            name={field.name}
            value={value}
            required={field.required}
            disabled={field.disabled}
            multiple={field.multiple}
            style={baseStyles}
            onChange={(e) => {
              const selectedValue = field.multiple 
                ? Array.from(e.target.selectedOptions, option => option.value)
                : e.target.value;
              handleFieldChange(field, selectedValue);
            }}
            onBlur={() => handleFieldBlur(field)}
            {...ariaAttributes}
          >
            {!field.required && !field.multiple && (
              <option value="">Select an option</option>
            )}
            {field.options?.map(option => (
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

      case 'checkbox':
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[2] }}>
            <input
              type="checkbox"
              name={field.name}
              checked={!!value}
              required={field.required}
              disabled={field.disabled}
              readOnly={field.readonly}
              style={{
                width: '18px',
                height: '18px',
                accentColor: theme.colors.primary[500],
              }}
              onChange={(e) => handleFieldChange(field, e.target.checked)}
              onBlur={() => handleFieldBlur(field)}
              {...ariaAttributes}
            />
            <span style={{ fontSize: theme.typography.sizes.sm }}>
              {field.label}
            </span>
          </div>
        );

      case 'radio':
        return (
          <fieldset
            style={{
              border: 'none',
              padding: 0,
              margin: 0,
            }}
          >
            <legend style={{
              fontSize: theme.typography.sizes.sm,
              fontWeight: theme.typography.weights.medium,
              marginBottom: theme.spacing[2],
            }}>
              {field.label}
            </legend>
            {field.options?.map(option => (
              <div
                key={option.value}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing[2],
                  marginBottom: theme.spacing[1],
                }}
              >
                <input
                  type="radio"
                  name={field.name}
                  value={option.value}
                  checked={value === option.value}
                  required={field.required}
                  disabled={field.disabled || option.disabled}
                  readOnly={field.readonly}
                  style={{
                    width: '18px',
                    height: '18px',
                    accentColor: theme.colors.primary[500],
                  }}
                  onChange={(e) => handleFieldChange(field, e.target.value)}
                  onBlur={() => handleFieldBlur(field)}
                  {...ariaAttributes}
                />
                <label style={{ fontSize: theme.typography.sizes.sm }}>
                  {option.label}
                </label>
              </div>
            ))}
          </fieldset>
        );

      case 'file':
        return (
          <input
            type="file"
            name={field.name}
            required={field.required}
            disabled={field.disabled}
            readOnly={field.readonly}
            accept={field.accept}
            multiple={field.multiple}
            style={baseStyles}
            onChange={(e) => {
              const files = field.multiple ? Array.from(e.target.files || []) : e.target.files?.[0];
              handleFieldChange(field, files);
            }}
            onBlur={() => handleFieldBlur(field)}
            {...ariaAttributes}
          />
        );

      default:
        return (
          <input
            type={field.type}
            name={field.name}
            value={value}
            placeholder={field.placeholder}
            required={field.required}
            disabled={field.disabled}
            readOnly={field.readonly}
            min={field.validation?.min}
            max={field.validation?.max}
            minLength={field.validation?.minLength}
            maxLength={field.validation?.maxLength}
            autoComplete={field.autocomplete}
            style={baseStyles}
            onChange={(e) => {
              const inputValue = field.type === 'number' ? Number(e.target.value) : e.target.value;
              handleFieldChange(field, inputValue);
            }}
            onFocus={(e) => {
              Object.assign(e.target.style, focusStyles);
            }}
            onBlur={(e) => {
              Object.assign(e.target.style, { borderColor: hasErrors ? theme.colors.error[500] : theme.colors.neutral[300], boxShadow: 'none' });
              handleFieldBlur(field);
            }}
            {...ariaAttributes}
          />
        );
    }
  }, [formData, errors, getFieldAriaAttributes, theme, handleFieldChange, handleFieldBlur]);

  const formStyles: React.CSSProperties = {
    maxWidth: '600px',
    margin: '0 auto',
    padding: theme.spacing[4],
    backgroundColor: theme.colorMode === 'light' ? 'white' : theme.colors.neutral[800],
    borderRadius: theme.borderRadius.lg,
    boxShadow: theme.shadows.md,
  };

  const fieldGroupStyles: React.CSSProperties = {
    marginBottom: theme.spacing[4],
  };

  const labelStyles: React.CSSProperties = {
    display: 'block',
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    marginBottom: theme.spacing[1],
    color: theme.colors.neutral[700],
  };

  const errorStyles: React.CSSProperties = {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.error[600],
    marginTop: theme.spacing[1],
  };

  const buttonGroupStyles: React.CSSProperties = {
    display: 'flex',
    gap: theme.spacing[3],
    justifyContent: 'flex-end',
    marginTop: theme.spacing[6],
  };

  const buttonStyles: React.CSSProperties = {
    padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
    border: 'none',
    borderRadius: theme.borderRadius.md,
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.medium,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };

  const primaryButtonStyles: React.CSSProperties = {
    ...buttonStyles,
    backgroundColor: theme.colors.primary[500],
    color: 'white',
  };

  const secondaryButtonStyles: React.CSSProperties = {
    ...buttonStyles,
    backgroundColor: 'transparent',
    color: theme.colors.neutral[600],
    border: `1px solid ${theme.colors.neutral[300]}`,
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      style={formStyles}
      className={className}
      aria-label={ariaLabel || 'Form'}
      noValidate
    >
      {fields.map(field => (
        <div key={field.name} style={fieldGroupStyles}>
          {field.type !== 'checkbox' && field.type !== 'radio' && (
            <label htmlFor={field.name} style={labelStyles}>
              {field.label}
              {field.required && (
                <span style={{ color: theme.colors.error[500], marginLeft: '4px' }}>
                  *
                </span>
              )}
            </label>
          )}
          
          {renderField(field)}
          
          {/* Field help text */}
          <div id={`${field.name}-help`} className="sr-only">
            {field.validation?.minLength && `Minimum ${field.validation.minLength} characters. `}
            {field.validation?.maxLength && `Maximum ${field.validation.maxLength} characters. `}
            {field.validation?.min !== undefined && `Minimum value ${field.validation.min}. `}
            {field.validation?.max !== undefined && `Maximum value ${field.validation.max}. `}
          </div>
          
          {/* Field errors */}
          {errors[field.name] && errors[field.name].length > 0 && (
            <div
              id={`${field.name}-error`}
              style={errorStyles}
              role="alert"
              aria-live="polite"
            >
              {errors[field.name].map((error, index) => (
                <div key={index}>{error}</div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Submit status message */}
      {submitStatus !== 'idle' && (
        <div
          style={{
            padding: theme.spacing[3],
            borderRadius: theme.borderRadius.md,
            marginBottom: theme.spacing[4],
            backgroundColor: submitStatus === 'success' 
              ? theme.colors.success[50] 
              : theme.colors.error[50],
            color: submitStatus === 'success' 
              ? theme.colors.success[700] 
              : theme.colors.error[700],
            border: `1px solid ${submitStatus === 'success' 
              ? theme.colors.success[200] 
              : theme.colors.error[200]}`,
          }}
          role="alert"
          aria-live="polite"
        >
          {submitStatus === 'success' 
            ? (successMessage || 'Form submitted successfully!')
            : (errorMessage || 'Form submission failed. Please try again.')
          }
        </div>
      )}

      <div style={buttonGroupStyles}>
        <button
          type="button"
          onClick={handleReset}
          style={secondaryButtonStyles}
          disabled={isSubmitting}
        >
          {resetButtonText}
        </button>
        
        <button
          type="submit"
          style={primaryButtonStyles}
          disabled={isSubmitting}
          aria-describedby="submit-status"
        >
          {isSubmitting ? loadingText : submitButtonText}
        </button>
      </div>

      {/* Submit status for screen readers */}
      <div id="submit-status" className="sr-only" aria-live="polite">
        {isSubmitting ? 'Form is being submitted...' : ''}
      </div>
    </form>
  );
}
