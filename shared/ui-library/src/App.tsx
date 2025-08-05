import React, { useState } from 'react'
import { ThemeProvider, useTheme, AppTheme } from './themes/ThemeProvider'
import { 
  Button, 
  Heading, 
  Text, 
  Input, 
  Select, 
  Badge, 
  Avatar,
  Footer
} from './components/atoms'
import './App.css'
import './styles/ai-modern.css'

// Component showcase sections with AI styling
const ComponentSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  return (
    <section className="ai-card" style={{ marginBottom: '2rem' }}>
      <Heading level="h3" size="lg" className="ai-heading" style={{ marginBottom: '1rem' }}>
        {title}
      </Heading>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
        {children}
      </div>
    </section>
  );
};

const ComponentShowcase: React.FC = () => {
  const { theme, setAppTheme, toggleColorMode } = useTheme();
  const [inputValue, setInputValue] = useState('');
  const [selectValue, setSelectValue] = useState('');

  const selectOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
    { value: 'disabled', label: 'Disabled Option', disabled: true },
  ];

  return (
    <div className="neural-network-bg particle-field" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
      {/* AI Neural Network Overlay */}
      <div className="neural-overlay">
        <svg className="neural-network-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Neural Network Connections */}
          <g className="neural-connections">
            <line x1="100" y1="100" x2="300" y2="200" stroke="rgba(102, 126, 234, 0.3)" strokeWidth="2" className="neural-pulse" filter="url(#glow)" />
            <line x1="300" y1="200" x2="500" y2="150" stroke="rgba(118, 75, 162, 0.3)" strokeWidth="2" className="neural-pulse" filter="url(#glow)" />
            <line x1="500" y1="150" x2="700" y2="250" stroke="rgba(67, 233, 123, 0.3)" strokeWidth="2" className="neural-pulse" filter="url(#glow)" />
            <line x1="700" y1="250" x2="900" y2="180" stroke="rgba(56, 249, 215, 0.3)" strokeWidth="2" className="neural-pulse" filter="url(#glow)" />
          </g>
          
          {/* Neural Nodes */}
          <g className="neural-nodes">
            <circle cx="100" cy="100" r="8" fill="rgba(102, 126, 234, 0.6)" className="floating" filter="url(#glow)" />
            <circle cx="300" cy="200" r="6" fill="rgba(118, 75, 162, 0.6)" className="floating" filter="url(#glow)" />
            <circle cx="500" cy="150" r="10" fill="rgba(67, 233, 123, 0.6)" className="floating" filter="url(#glow)" />
            <circle cx="700" cy="250" r="7" fill="rgba(56, 249, 215, 0.6)" className="floating" filter="url(#glow)" />
            <circle cx="900" cy="180" r="9" fill="rgba(102, 126, 234, 0.6)" className="floating" filter="url(#glow)" />
          </g>
        </svg>
      </div>
      
      {/* Floating AI Particles */}
      <div className="ai-particles">
        <div className="particle particle-1 neural-glow"></div>
        <div className="particle particle-2 cyber-glow"></div>
        <div className="particle particle-3 matrix-glow"></div>
        <div className="particle particle-4 neural-glow"></div>
        <div className="particle particle-5 cyber-glow"></div>
      </div>

      {/* Header */}
      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <Heading level="h1" size="4xl" className="ai-heading neural-glow">
          SmartPlanner AI UI Library
        </Heading>
        <Text size="lg" style={{ marginTop: '0.5rem', marginBottom: '2rem', color: 'rgba(255, 255, 255, 0.8)' }}>
          Next-Generation Component Development Playground
        </Text>
        
        {/* AI Theme Controls */}
        <div className="glassmorphism theme-controller" style={{ padding: '2rem', borderRadius: '16px', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
          <Text size="lg" className="ai-text-gradient" style={{ textAlign: 'center', marginBottom: '1.5rem', fontWeight: '600' }}>
            🤖 AI Theme Controller
          </Text>
          
          {/* Mode Toggle - Make this more prominent */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <Button 
              className={`ai-button theme-toggle-button ${theme.colorMode === 'dark' ? 'neural-gradient neural-glow' : 'cyber-gradient cyber-glow'}`}
              onClick={toggleColorMode}
            >
              {theme.colorMode === 'light' ? '🌙' : '☀️'} 
              {theme.colorMode === 'light' ? 'Switch to Dark' : 'Switch to Light'}
            </Button>
          </div>
          
          {/* Current Mode Display */}
          <div className="theme-mode-display" style={{ textAlign: 'center', marginBottom: '1.5rem', padding: '1rem' }}>
            <Text size="sm" style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '0.5rem' }}>
              Current Theme Mode
            </Text>
            <Text size="lg" className="ai-text-gradient" style={{ fontWeight: '700', fontSize: '1.2rem' }}>
              {theme.colorMode === 'light' ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </Text>
          </div>
          
          {/* Theme Style Selection */}
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <Text size="sm" style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '1rem' }}>
              Choose AI Theme Style
            </Text>
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {(['default', 'travel', 'finance', 'health', 'day'] as AppTheme[]).map((themeType) => (
              <Button
                key={themeType}
                className={`ai-button theme-style-button ${theme.appTheme === themeType ? 'matrix-gradient matrix-glow active' : 'glassmorphism'}`}
                variant={theme.appTheme === themeType ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setAppTheme(themeType)}
              >
                {themeType.charAt(0).toUpperCase() + themeType.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </header>

      {/* Typography Section */}
      <ComponentSection title="AI Typography">
        <div style={{ width: '100%' }}>
          <Heading level="h1" size="4xl" className="ai-heading">Heading 1 - 4xl</Heading>
          <Heading level="h2" size="3xl" className="ai-heading">Heading 2 - 3xl</Heading>
          <Heading level="h3" size="2xl" className="ai-heading">Heading 3 - 2xl</Heading>
          <Heading level="h4" size="xl" className="ai-heading">Heading 4 - xl</Heading>
          <Heading level="h5" size="lg" className="ai-heading">Heading 5 - lg</Heading>
          <Heading level="h6" size="md" className="ai-heading">Heading 6 - md</Heading>
          <Text size="lg" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>Large text paragraph with normal weight.</Text>
          <Text size="base" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Base text paragraph with normal weight.</Text>
          <Text size="sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Small text paragraph with normal weight.</Text>
        </div>
      </ComponentSection>

      {/* Button Section */}
      <ComponentSection title="Buttons">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem', width: '100%' }}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="primary" disabled>Disabled</Button>
          <Button variant="primary" loading>Loading</Button>
          <Button variant="primary" size="xs">Extra Small</Button>
          <Button variant="primary" size="sm">Small</Button>
          <Button variant="primary" size="md">Medium</Button>
          <Button variant="primary" size="lg">Large</Button>
          <Button variant="primary" size="xl">Extra Large</Button>
        </div>
      </ComponentSection>

      {/* Input Section */}
      <ComponentSection title="Inputs">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', width: '100%' }}>
          <Input 
            placeholder="Default input" 
            value={inputValue} 
            onChange={(e) => setInputValue(e.target.value)} 
          />
          <Input 
            placeholder="Small input" 
            size="sm"
            value={inputValue} 
            onChange={(e) => setInputValue(e.target.value)} 
          />
          <Input 
            placeholder="Large input" 
            size="lg"
            value={inputValue} 
            onChange={(e) => setInputValue(e.target.value)} 
          />
          <Input 
            placeholder="Filled variant" 
            variant="filled"
            value={inputValue} 
            onChange={(e) => setInputValue(e.target.value)} 
          />
          <Input 
            placeholder="Flushed variant" 
            variant="flushed"
            value={inputValue} 
            onChange={(e) => setInputValue(e.target.value)} 
          />
          <Input 
            placeholder="Error state" 
            error
            value={inputValue} 
            onChange={(e) => setInputValue(e.target.value)} 
          />
          <Input 
            placeholder="Disabled input" 
            disabled
          />
        </div>
      </ComponentSection>

      {/* Select Section */}
      <ComponentSection title="Select">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', width: '100%' }}>
          <Select 
            options={selectOptions} 
            placeholder="Choose an option"
            value={selectValue}
            onChange={(e) => setSelectValue(e.target.value)}
          />
          <Select 
            options={selectOptions} 
            placeholder="Small select"
            size="sm"
            value={selectValue}
            onChange={(e) => setSelectValue(e.target.value)}
          />
          <Select 
            options={selectOptions} 
            placeholder="Large select"
            size="lg"
            value={selectValue}
            onChange={(e) => setSelectValue(e.target.value)}
          />
          <Select 
            options={selectOptions} 
            placeholder="Error state"
            error
            value={selectValue}
            onChange={(e) => setSelectValue(e.target.value)}
          />
          <Select 
            options={selectOptions} 
            placeholder="Disabled select"
            disabled
          />
        </div>
      </ComponentSection>

      {/* Badge Section */}
      <ComponentSection title="Badges">
        <Badge variant="primary">Primary</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="warning">Warning</Badge>
        <Badge variant="error">Error</Badge>
        <Badge variant="neutral">Neutral</Badge>
        <Badge variant="primary" size="sm">Small</Badge>
        <Badge variant="primary" size="md">Medium</Badge>
        <Badge variant="primary" size="lg">Large</Badge>
      </ComponentSection>

      {/* Avatar Section */}
      <ComponentSection title="Avatars">
        <Avatar name="John Doe" size="xs" />
        <Avatar name="Jane Smith" size="sm" />
        <Avatar name="Bob Johnson" size="md" />
        <Avatar name="Alice Brown" size="lg" />
        <Avatar name="Charlie Wilson" size="xl" />
        <Avatar name="Diana Prince" size="2xl" />
        <Avatar src="https://via.placeholder.com/80x80/0ea5e9/ffffff?text=AI" alt="AI Avatar" size="lg" />
        <Avatar name="Smart Planner" size="lg" />
      </ComponentSection>

      {/* AI Theme Information */}
      <ComponentSection title="AI Theme System">
        <div className="glassmorphism" style={{ width: '100%', padding: '1.5rem', borderRadius: '12px' }}>
          <Text style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            <strong className="ai-text-gradient">App Theme:</strong> {theme.appTheme}
          </Text>
          <Text style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            <strong className="ai-text-gradient">Color Mode:</strong> {theme.colorMode}
          </Text>
          <Text style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            <strong className="ai-text-gradient">Primary Color:</strong> {
            theme.appTheme !== 'default' 
              ? (theme.colors[theme.appTheme as keyof typeof theme.colors] as { primary: string }).primary
              : theme.colors.primary[600]
          }</Text>
        </div>
      </ComponentSection>

      {/* Footer */}
      <Footer />
    </div>
  );
};

// Main App Component
const App: React.FC = () => {
  return (
    <ThemeProvider initialAppTheme="default" initialColorMode="light">
      <ComponentShowcase />
    </ThemeProvider>
  );
};

export default App;
