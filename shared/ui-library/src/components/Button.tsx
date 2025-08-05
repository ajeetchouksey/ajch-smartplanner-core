import React from 'react';

interface ButtonProps {
  label: string;
  primary?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({ 
  label, 
  primary = false, 
  disabled = false,
  onClick 
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: disabled ? '#ccc' : primary ? '#007bff' : '#eee',
        color: disabled ? '#666' : primary ? '#fff' : '#333',
        padding: '8px 16px',
        border: 'none',
        borderRadius: '4px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
      }}
    >
      {label}
    </button>
  );
};
