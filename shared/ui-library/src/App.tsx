import React, { useState } from 'react'
import { Button } from './components/Button'
import './App.css'

// Component showcase/playground
const App: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState('Button')

  const components = {
    Button: () => (
      <div className="component-showcase">
        <h2>Button Component</h2>
        <div className="component-variants">
          <div className="variant">
            <h3>Primary Button</h3>
            <Button label="Primary Button" primary />
          </div>
          <div className="variant">
            <h3>Secondary Button</h3>
            <Button label="Secondary Button" />
          </div>
          <div className="variant">
            <h3>Disabled Button</h3>
            <Button label="Disabled Button" disabled />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Smart Planner UI Library</h1>
        <p>Component Development Playground</p>
      </header>

      <div className="app-content">
        <nav className="component-nav">
          <h3>Components</h3>
          {Object.keys(components).map((name) => (
            <button
              key={name}
              className={`nav-item ${activeComponent === name ? 'active' : ''}`}
              onClick={() => setActiveComponent(name)}
            >
              {name}
            </button>
          ))}
        </nav>

        <main className="component-display">
          {components[activeComponent as keyof typeof components]()}
        </main>
      </div>
    </div>
  )
}

export default App
