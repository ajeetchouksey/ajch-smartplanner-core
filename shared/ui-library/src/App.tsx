import React, { useState } from 'react';
import './App.css';
import './styles/ai-modern.css';
import './styles/light-theme-fixes.css';
import { ThemeProvider, useTheme, AppTheme } from './themes/ThemeProvider'
import {
  Button,
  Heading,
  Text,
  Input,
  Select,
  Badge,
  Avatar,
  Footer,
  Header,
  ChatbotWidget,
  NotificationToasts,
  AvatarCard,
  AISearchBar,
  AIModal,
  AIProgressBar,
  AILoader,
  AITimeline,
  AIDataTable,
  LoginCard,
  ToastType,
  Toast
} from './components/atoms'

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
  const [themeValue, setThemeValue] = useState(theme.appTheme);
  const [currentPage, setCurrentPage] = useState('dashboard');
  
  const selectOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
    { value: 'disabled', label: 'Disabled Option', disabled: true },
  ];

  const themeOptions = [
    { value: 'default', label: '🤖 Default' },
    { value: 'travel', label: '✈️ Travel' },
    { value: 'finance', label: '💰 Finance' },
    { value: 'health', label: '🏥 Health' },
    { value: 'day', label: '📅 Day' },
  ];

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTheme = e.target.value as AppTheme;
    setThemeValue(newTheme);
    setAppTheme(newTheme);
  };

  // --- AI Demo Section State ---
  const [modalOpen, setModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [progress, setProgress] = useState(65);
  const [loaderActive, setLoaderActive] = useState(true);
  // Use ToastType enum for type property
  const [toastList, setToastList] = useState<Toast[]>([
    { id: 1, type: ToastType.Success, message: 'AI Model Training Complete!' },
    { id: 2, type: ToastType.Info, message: 'New neural theme applied.' },
    { id: 3, type: ToastType.Error, message: 'Connection lost. Reconnecting...' }
  ]);
  const timelineEvents = [
    { id: 1, title: 'User Registered', timestamp: '2024-06-01', icon: 'user' },
    { id: 2, title: 'AI Model Deployed', timestamp: '2024-06-02', icon: 'robot' },
    { id: 3, title: 'First Plan Created', timestamp: '2024-06-03', icon: 'plan' }
  ];
  const tableData = [
    { name: 'Aarya', role: 'AI Planner', status: 'Active' },
    { name: 'John Doe', role: 'User', status: 'Trial' },
    { name: 'Jane Smith', role: 'User', status: 'Active' }
  ];
  const tableColumns = [
    { key: 'name', label: 'Name' },
    { key: 'role', label: 'Role' },
    { key: 'status', label: 'Status' }
  ];

  return (
    <div className="neural-network-bg particle-field" style={{ padding: '2rem', paddingTop: '6rem', maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
      {/* --- Header Component Demo --- */}
      <ComponentSection title="Navigation Header">
        <div style={{ width: '100%', marginBottom: '2rem' }}>
          <Text size="sm" style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '1rem' }}>
            Modern navigation header with glassmorphism effects, responsive design, and AI-powered search
          </Text>
          <div style={{ 
            position: 'relative', 
            height: '100px', 
            borderRadius: '12px', 
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <Header
              user={{
                name: 'Aarya AI',
                email: 'aarya@smartplanner.ai',
                avatar: 'https://via.placeholder.com/40x40/0ea5e9/ffffff?text=AI'
              }}
              currentPage={currentPage}
              onNavigate={setCurrentPage}
              showSearch={true}
              showNotifications={true}
            />
          </div>
          <Text size="xs" style={{ color: 'rgba(255, 255, 255, 0.6)', marginTop: '0.5rem' }}>
            Current Page: <strong>{currentPage}</strong> • Click navigation items to see active states
          </Text>
        </div>
      </ComponentSection>

      {/* --- Login Experience Card --- */}
      <div style={{ display: 'grid', placeItems: 'center', minHeight: '60vh', width: '100%' }}>
        <div style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
          <LoginCard />
        </div>
      </div>
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
        
        {/* AI Theme Controls - Compact Design */}
        <div className="glassmorphism theme-controller" style={{ 
          padding: '1.5rem', 
          borderRadius: '16px', 
          marginBottom: '2rem', 
          maxWidth: '500px', 
          margin: '0 auto 2rem auto' 
        }}>
          <Text size="lg" className="ai-text-gradient" style={{ 
            textAlign: 'center', 
            marginBottom: '1.5rem', 
            fontWeight: '600' 
          }}>
            🤖 AI Theme Controller
          </Text>

          {/* Compact Layout: Toggle and Dropdown Side by Side */}
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: '1rem' 
          }}>
            {/* Dark/Light Mode Toggle */}
            <Button
              className={`ai-button theme-toggle-button ${theme.colorMode === 'dark' ? 'neural-gradient neural-glow' : 'cyber-gradient cyber-glow'}`}
              onClick={toggleColorMode}
              size="sm"
              style={{ flex: '0 0 auto' }}
            >
              {theme.colorMode === 'light' ? '🌙 Dark' : '☀️ Light'}
            </Button>

            {/* Theme Selection Dropdown */}
            <div style={{ flex: '1', minWidth: '200px' }}>
              <Select
                options={themeOptions}
                value={themeValue}
                onChange={handleThemeChange}
                size="sm"
                placeholder="Choose theme..."
              />
            </div>
          </div>

          {/* Current Status Display */}
          <div style={{ 
            textAlign: 'center', 
            padding: '0.75rem', 
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '8px' 
          }}>        
            <Text size="sm" className="ai-text-gradient" style={{ fontWeight: '600' }}>
              {theme.colorMode === 'light' ? '☀️' : '🌙'} {theme.colorMode.charAt(0).toUpperCase() + theme.colorMode.slice(1)} • {themeOptions.find(opt => opt.value === theme.appTheme)?.label || '🤖 Default'}
            </Text>
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

      {/* --- AI Components Demo Section --- */}
      <ComponentSection title="AI Components Demo">
        {/* Notification Toasts */}
        <NotificationToasts 
          toasts={toastList}
          removeToast={(id) => setToastList((prev) => prev.filter((t) => t.id !== id))}
        />

  {/* Avatar Card */}
  <AvatarCard name="Aarya" avatarUrl="https://via.placeholder.com/80x80/0ea5e9/ffffff?text=AI" status="online" />

  {/* AI Search Bar */}
  <AISearchBar onSearch={(query) => setSearchValue(query)} />

        {/* AI Modal */}
        <Button onClick={() => setModalOpen(true)} variant="primary">Open AI Modal</Button>
        <AIModal open={modalOpen} onClose={() => setModalOpen(false)} title="AI Modal Demo">
          <Text>This is a demo of the AI-powered modal component.</Text>
        </AIModal>

        {/* AI Progress Bar */}
        <AIProgressBar value={progress} max={100} />

        {/* AI Loader */}
        <AILoader />

        {/* AI Timeline */}
        <AITimeline steps={[
          { id: 1, title: 'User Registered', timestamp: '2024-06-01', icon: 'user' },
          { id: 2, title: 'AI Model Deployed', timestamp: '2024-06-02', icon: 'robot' },
          { id: 3, title: 'First Plan Created', timestamp: '2024-06-03', icon: 'plan' }
        ] as any} />

        {/* AI Data Table */}
        <AIDataTable columns={tableColumns} data={tableData} />

        {/* Floating Chatbot Widget */}
        <div style={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1000 }}>
          <ChatbotWidget />
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
