import React, { useState } from 'react';
import { Button, Heading, Text } from './atoms';
import './LoginCard.css';

const socialProviders = [
  { name: 'Google', icon: '🔵', color: '#4285f4' },
  { name: 'Facebook', icon: '🔷', color: '#1877f2' },
  { name: 'Microsoft', icon: '🟦', color: '#0078d4' },
];

export const LoginCard: React.FC = () => {
  const [loading, setLoading] = useState('');

  const handleSocialLogin = (provider: string) => {
    setLoading(provider);
    // TODO: Replace with real OAuth implementation
    setTimeout(() => {
      setLoading('');
      alert(`${provider} login successful!`);
    }, 1200);
  };

  return (
    <div className="login-card glassmorphism" style={{ maxWidth: '380px', padding: '2rem 1.5rem' }}>
      <Heading level="h2" size="xl" className="ai-heading" style={{ marginBottom: '0.5rem', textAlign: 'center' }}>
        Welcome to SmartPlanner
      </Heading>
      <Text size="sm" style={{ marginBottom: '2rem', color: 'rgba(255,255,255,0.7)', textAlign: 'center' }}>
        Sign in with your student account
      </Text>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
        {socialProviders.map(provider => (
          <Button
            key={provider.name}
            variant="outline"
            onClick={() => handleSocialLogin(provider.name)}
            loading={loading === provider.name}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderColor: provider.color,
              color: provider.color,
              justifyContent: 'flex-start',
              gap: '0.75rem',
            }}
          >
            <span style={{ fontSize: '1.1rem' }}>{provider.icon}</span>
            <span>Continue with {provider.name}</span>
          </Button>
        ))}
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        <a href="#" style={{ color: '#38bdf8', textDecoration: 'underline', fontSize: '0.875rem', marginRight: '1rem' }}>
          Forgot password?
        </a>        
        <a href="#" style={{ color: '#a78bfa', textDecoration: 'underline', fontSize: '0.875rem' }}>
          Sign up
        </a>
      </div>
    </div>
  );
};export default LoginCard;
