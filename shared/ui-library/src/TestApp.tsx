import React from 'react';
import { Button } from './components/atoms/Button';
import { ThemeProvider } from './themes/ThemeProvider';
import { MotionProvider } from './components/animation/AnimationSystem';

function TestApp() {
  const handleClick = () => {
    console.log('Button clicked!');
  };

  return (
    <ThemeProvider>
      <MotionProvider>
        <div style={{ padding: '20px' }}>
          <h1>SmartPlanner UI Library Test</h1>
          
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '20px' }}>
            <Button variant="primary" onClick={handleClick}>
              Primary Button
            </Button>
            
            <Button variant="secondary" onClick={handleClick}>
              Secondary Button
            </Button>
            
            <Button variant="outline" onClick={handleClick}>
              Outline Button
            </Button>
            
            <Button variant="ghost" onClick={handleClick}>
              Ghost Button
            </Button>
          </div>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '20px' }}>
            <Button size="sm" onClick={handleClick}>
              Small Button
            </Button>
            
            <Button size="md" onClick={handleClick}>
              Medium Button
            </Button>
            
            <Button size="lg" onClick={handleClick}>
              Large Button
            </Button>
          </div>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '20px' }}>
            <Button loading onClick={handleClick}>
              Loading Button
            </Button>
            
            <Button disabled onClick={handleClick}>
              Disabled Button
            </Button>
          </div>

          <div style={{ marginTop: '40px' }}>
            <h2>Accessibility Features</h2>
            <p>Try testing these features:</p>
            <ul>
              <li>Tab navigation between buttons</li>
              <li>Enter/Space key activation</li>
              <li>Screen reader announcements</li>
              <li>Focus management</li>
            </ul>
          </div>
        </div>
      </MotionProvider>
    </ThemeProvider>
  );
}

export default TestApp;
