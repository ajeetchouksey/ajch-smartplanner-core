import React from 'react';
import { useAuth } from './OAuthContext';

// Basic Button component
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  loading?: boolean;
  style?: React.CSSProperties;
  variant?: 'primary' | 'outline';
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  loading = false, 
  style = {}, 
  variant = 'primary' 
}) => {
  const baseStyles: React.CSSProperties = {
    padding: '14px 20px',
    border: variant === 'outline' ? '2px solid' : 'none',
    borderRadius: '12px',
    cursor: loading ? 'not-allowed' : 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    opacity: loading ? 0.7 : 1,
    backgroundColor: variant === 'outline' ? 'rgba(255, 255, 255, 0.05)' : '#0078d4',
    color: variant === 'outline' ? 'inherit' : 'white',
    backdropFilter: 'blur(10px)',
    position: 'relative',
    overflow: 'hidden',
  };

  return (
    <button
      style={{ ...baseStyles, ...style }}
      onClick={loading ? undefined : onClick}
      disabled={loading}
      onMouseEnter={(e) => {
        if (!loading && variant === 'outline') {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
        }
      }}
      onMouseLeave={(e) => {
        if (!loading && variant === 'outline') {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }
      }}
    >
      {loading ? (
        <div style={{
          width: '20px',
          height: '20px',
          border: '2px solid #f3f3f3',
          borderTop: '2px solid currentColor',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
      ) : children}
    </button>
  );
};

// Basic Text component
interface TextProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  style?: React.CSSProperties;
}

const Text: React.FC<TextProps> = ({ children, size = 'md', style = {} }) => {
  const sizeStyles = {
    sm: { fontSize: '14px' },
    md: { fontSize: '16px' },
    lg: { fontSize: '18px' },
  };

  return (
    <p style={{ ...sizeStyles[size], margin: 0, ...style }}>
      {children}
    </p>
  );
};

// Basic Heading component
interface HeadingProps {
  children: React.ReactNode;
  level: 'h1' | 'h2' | 'h3';
  size?: 'lg' | 'xl' | '2xl';
  style?: React.CSSProperties;
  className?: string;
}

const Heading: React.FC<HeadingProps> = ({ 
  children, 
  level, 
  size = 'lg', 
  style = {}, 
  className = '' 
}) => {
  const Component = level;
  const sizeStyles = {
    lg: { fontSize: '24px' },
    xl: { fontSize: '32px' },
    '2xl': { fontSize: '40px' },
  };

  return (
    <Component 
      className={className}
      style={{ 
        ...sizeStyles[size], 
        margin: 0, 
        fontWeight: '700',
        ...style 
      }}
    >
      {children}
    </Component>
  );
};

// OAuth Login Props
interface OAuthLoginProps {
  onLoginSuccess?: () => void;
  onLoginError?: (error: string) => void;
  className?: string;
}

// Social providers with proper brand icons
const socialProviders = [
  { 
    name: 'Google', 
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
    ), 
    color: '#4285f4',
    hoverColor: '#3367d6'
  },
  { 
    name: 'Microsoft', 
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z" fill="#00BCF2"/>
      </svg>
    ), 
    color: '#0078d4',
    hoverColor: '#106ebe'
  },
  { 
    name: 'Facebook', 
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
      </svg>
    ), 
    color: '#1877f2',
    hoverColor: '#166fe5'
  },
];

// Main OAuth Login Component
export const OAuthLogin: React.FC<OAuthLoginProps> = ({
  onLoginSuccess,
  onLoginError,
  className = ''
}) => {
  const { state, loginWithOAuth, logout } = useAuth();

  const handleProviderLogin = async (provider: 'microsoft' | 'google' | 'facebook') => {
    try {
      await loginWithOAuth(provider);
      onLoginSuccess?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      onLoginError?.(errorMessage);
    }
  };

  // Loading state
  if (state.isLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        flexDirection: 'column',
        gap: '30px'
      }}>
        <div style={{
          maxWidth: '420px',
          padding: '3rem 2rem',
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 2rem',
            position: 'relative'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              border: '4px solid rgba(255, 255, 255, 0.1)',
              borderTop: '4px solid #667eea',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              position: 'absolute'
            }}></div>
            <div style={{
              width: '60px',
              height: '60px',
              border: '3px solid rgba(255, 255, 255, 0.1)',
              borderBottom: '3px solid #764ba2',
              borderRadius: '50%',
              animation: 'spin 1.5s linear infinite reverse',
              position: 'absolute',
              top: '10px',
              left: '10px'
            }}></div>
          </div>
          
          <Heading level="h2" size="lg" style={{ 
            marginBottom: '1rem', 
            color: 'white',
            fontWeight: '600'
          }}>
            Authenticating...
          </Heading>
          
          <Text style={{ 
            color: 'rgba(255, 255, 255, 0.7)',
            lineHeight: '1.5'
          }}>
            Please wait while we securely sign you in
          </Text>
          
          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <Text size="sm" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              🔒 Your connection is secure and encrypted
            </Text>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated state
  if (state.isAuthenticated && state.user) {
    return (
      <div className={`login-card ${className}`} style={{
        maxWidth: '420px',
        padding: '3rem 2rem',
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        textAlign: 'center'
      }}>
        <div style={{
          width: '100px',
          height: '100px',
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          borderRadius: '50%',
          margin: '0 auto 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '3rem',
          boxShadow: '0 15px 35px rgba(16, 185, 129, 0.3)',
        }}>
          ✓
        </div>
        
        <Heading level="h2" size="xl" style={{ 
          marginBottom: '1rem', 
          color: 'white',
          fontWeight: '700'
        }}>
          Welcome back!
        </Heading>
        
        <div style={{ marginBottom: '2.5rem' }}>
          {state.user.avatar && (
            <img 
              src={state.user.avatar} 
              alt={state.user.name}
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                marginBottom: '1rem',
                border: '3px solid rgba(255, 255, 255, 0.2)'
              }}
            />
          )}
          <Text style={{ 
            color: 'rgba(255,255,255,0.9)', 
            fontWeight: '600',
            fontSize: '18px',
            marginBottom: '0.5rem'
          }}>
            {state.user.name}
          </Text>
          <Text size="sm" style={{ 
            color: 'rgba(255,255,255,0.7)',
            marginBottom: '0.5rem'
          }}>
            {state.user.email}
          </Text>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            background: `linear-gradient(135deg, ${
              state.user.provider === 'google' ? '#4285f4' :
              state.user.provider === 'microsoft' ? '#0078d4' : '#1877f2'
            }20 0%, ${
              state.user.provider === 'google' ? '#4285f4' :
              state.user.provider === 'microsoft' ? '#0078d4' : '#1877f2'
            }10 100%)`,
            borderRadius: '20px',
            border: `1px solid ${
              state.user.provider === 'google' ? '#4285f4' :
              state.user.provider === 'microsoft' ? '#0078d4' : '#1877f2'
            }30`,
          }}>
            <Text size="sm" style={{ 
              color: 'rgba(255,255,255,0.8)',
              textTransform: 'capitalize'
            }}>
              Signed in with {state.user.provider}
            </Text>
          </div>
        </div>
        
        <Button 
          onClick={logout}
          variant="outline"
          style={{
            width: '100%',
            borderColor: '#ef4444',
            color: '#ef4444',
            background: 'rgba(239, 68, 68, 0.1)',
            fontSize: '16px',
            fontWeight: '500'
          }}
        >
          Sign Out
        </Button>
      </div>
    );
  }

  // Login form
  return (
    <div className={`login-card ${className}`} style={{
      maxWidth: '420px',
      padding: '3rem 2rem',
      background: 'rgba(255, 255, 255, 0.08)',
      backdropFilter: 'blur(20px)',
      borderRadius: '24px',
      border: '1px solid rgba(255, 255, 255, 0.12)',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '20px',
          margin: '0 auto 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
          position: 'relative',
          overflow: 'visible'
        }}>
          <svg width="48" height="48" viewBox="0 0 32 32" fill="none">
            {/* Calendar main body with AI-enhanced design */}
            <rect x="4" y="6" width="24" height="22" rx="3" ry="3" fill="white" stroke="rgba(102, 126, 234, 0.2)" strokeWidth="0.5"/>
            
            {/* Modern header with gradient */}
            <defs>
              <linearGradient id="headerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(102, 126, 234, 0.1)"/>
                <stop offset="100%" stopColor="rgba(118, 75, 162, 0.1)"/>
              </linearGradient>
              <linearGradient id="aiAccent" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00f5ff"/>
                <stop offset="100%" stopColor="#ff00f5"/>
              </linearGradient>
            </defs>
            <rect x="4" y="6" width="24" height="6" rx="3" ry="3" fill="url(#headerGradient)"/>
            
            {/* Binding rings with metallic effect */}
            <rect x="8" y="3" width="2" height="6" rx="1" fill="rgba(255,255,255,0.9)" stroke="rgba(102, 126, 234, 0.3)" strokeWidth="0.3"/>
            <rect x="22" y="3" width="2" height="6" rx="1" fill="rgba(255,255,255,0.9)" stroke="rgba(102, 126, 234, 0.3)" strokeWidth="0.3"/>
            
            {/* Smart grid with AI indicators */}
            <line x1="8" y1="15" x2="24" y2="15" stroke="rgba(102, 126, 234, 0.2)" strokeWidth="0.8"/>
            <line x1="8" y1="18" x2="24" y2="18" stroke="rgba(102, 126, 234, 0.2)" strokeWidth="0.8"/>
            <line x1="8" y1="21" x2="24" y2="21" stroke="rgba(102, 126, 234, 0.2)" strokeWidth="0.8"/>
            <line x1="8" y1="24" x2="24" y2="24" stroke="rgba(102, 126, 234, 0.2)" strokeWidth="0.8"/>
            
            <line x1="12" y1="12" x2="12" y2="26" stroke="rgba(102, 126, 234, 0.2)" strokeWidth="0.8"/>
            <line x1="16" y1="12" x2="16" y2="26" stroke="rgba(102, 126, 234, 0.2)" strokeWidth="0.8"/>
            <line x1="20" y1="12" x2="20" y2="26" stroke="rgba(102, 126, 234, 0.2)" strokeWidth="0.8"/>
            
            {/* AI-suggested events with smart highlighting */}
            <rect x="12.5" y="18.5" width="7" height="2" rx="1" fill="url(#aiAccent)" opacity="0.8"/>
            <rect x="9" y="21.5" width="5" height="1.5" rx="0.75" fill="rgba(102, 126, 234, 0.6)"/>
            <rect x="17" y="15.5" width="6" height="1.5" rx="0.75" fill="rgba(118, 75, 162, 0.6)"/>
            
            {/* AI brain network overlay - sophisticated neural connections */}
            <g opacity="0.8">
              {/* Primary neural pathway */}
              <path d="M6 9 Q10 7 14 9 Q18 11 22 9 Q26 7 28 10" stroke="url(#aiAccent)" strokeWidth="1.2" fill="none" opacity="0.7"/>
              <path d="M8 24 Q12 22 16 24 Q20 26 24 24" stroke="rgba(118, 75, 162, 0.8)" strokeWidth="1" fill="none"/>
              
              {/* Neural nodes with pulsing effect */}
              <circle cx="6" cy="9" r="1.5" fill="url(#aiAccent)" opacity="0.9">
                <animate attributeName="r" values="1.5;2;1.5" dur="2s" repeatCount="indefinite"/>
              </circle>
              <circle cx="14" cy="9" r="1.2" fill="rgba(0, 245, 255, 0.8)"/>
              <circle cx="22" cy="9" r="1.0" fill="rgba(255, 0, 245, 0.7)"/>
              <circle cx="28" cy="10" r="0.8" fill="rgba(102, 126, 234, 0.9)"/>
              
              <circle cx="8" cy="24" r="1.2" fill="rgba(118, 75, 162, 0.8)"/>
              <circle cx="16" cy="24" r="1.0" fill="rgba(0, 245, 255, 0.7)">
                <animate attributeName="opacity" values="0.7;1;0.7" dur="1.5s" repeatCount="indefinite"/>
              </circle>
              <circle cx="24" cy="24" r="0.9" fill="rgba(255, 0, 245, 0.8)"/>
            </g>
            
            {/* Smart scheduling indicators */}
            <circle cx="10" cy="16.5" r="0.8" fill="rgba(0, 245, 255, 0.8)">
              <animate attributeName="fill" values="rgba(0, 245, 255, 0.8);rgba(255, 0, 245, 0.8);rgba(0, 245, 255, 0.8)" dur="3s" repeatCount="indefinite"/>
            </circle>
            <circle cx="18" cy="19.5" r="0.7" fill="rgba(255, 0, 245, 0.9)"/>
            <circle cx="22" cy="16.5" r="0.6" fill="rgba(102, 126, 234, 0.8)"/>
            <circle cx="14" cy="22.5" r="0.5" fill="rgba(118, 75, 162, 0.7)"/>
            
            {/* AI intelligence indicator in corner */}
            <g transform="translate(25, 7)">
              <circle r="2" fill="rgba(0, 245, 255, 0.2)" stroke="url(#aiAccent)" strokeWidth="0.5"/>
              <text x="0" y="1" textAnchor="middle" fontSize="2.5" fill="url(#aiAccent)" fontFamily="Arial, sans-serif">AI</text>
            </g>
          </svg>
          
          {/* Enhanced AI glow effect with multiple layers */}
          <div style={{
            position: 'absolute',
            top: '15px',
            right: '10px',
            width: '12px',
            height: '12px',
            background: 'linear-gradient(45deg, #00f5ff 0%, #ff00f5 100%)',
            borderRadius: '50%',
            boxShadow: '0 0 15px rgba(0, 245, 255, 0.6), 0 0 30px rgba(255, 0, 245, 0.3)',
            animation: 'aiGlow 3s ease-in-out infinite'
          }}></div>
          
          {/* Subtle rotating AI ring */}
          <div style={{
            position: 'absolute',
            top: '-5px',
            left: '-5px',
            right: '-5px',
            bottom: '-5px',
            border: '1px solid rgba(0, 245, 255, 0.2)',
            borderRadius: '25px',
            borderTopColor: 'rgba(255, 0, 245, 0.4)',
            borderRightColor: 'rgba(0, 245, 255, 0.4)',
            animation: 'spin 8s linear infinite',
            pointerEvents: 'none'
          }}></div>
        </div>
        
        <Heading level="h2" size="xl" style={{ 
          marginBottom: '0.5rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Welcome to SmartPlanner
        </Heading>
        
        <Text size="md" style={{ 
          color: 'rgba(255,255,255,0.7)',
          lineHeight: '1.5'
        }}>
          Choose your preferred sign-in method
        </Text>
      </div>
      
      {state.error && (
        <div style={{ 
          backgroundColor: 'rgba(239, 68, 68, 0.1)', 
          border: '1px solid rgba(239, 68, 68, 0.3)', 
          borderRadius: '12px', 
          padding: '16px', 
          marginBottom: '1.5rem',
          backdropFilter: 'blur(10px)'
        }}>
          <Text size="sm" style={{ color: '#ef4444', textAlign: 'center' }}>{state.error}</Text>
        </div>
      )}
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
        {socialProviders.map(provider => (
          <Button
            key={provider.name}
            variant="outline"
            onClick={() => handleProviderLogin(provider.name.toLowerCase() as 'microsoft' | 'google' | 'facebook')}
            loading={state.isLoading}
            style={{
              width: '100%',
              padding: '16px 20px',
              borderColor: provider.color,
              color: 'white',
              justifyContent: 'flex-start',
              gap: '1rem',
              fontSize: '16px',
              fontWeight: '500',
              background: `linear-gradient(135deg, ${provider.color}15 0%, ${provider.color}05 100%)`,
              borderWidth: '1px',
              borderStyle: 'solid',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center' }}>{provider.icon}</span>
            <span>Continue with {provider.name}</span>
          </Button>
        ))}
      </div>
      
      <div style={{ 
        textAlign: 'center', 
        marginTop: '2rem',
        padding: '1rem 0',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <Text size="sm" style={{ 
          color: 'rgba(255,255,255,0.6)',
          lineHeight: '1.6'
        }}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </div>
    </div>
  );
};
