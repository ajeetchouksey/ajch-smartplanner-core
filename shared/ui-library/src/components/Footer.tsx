import React from 'react';
import { Heading, Text } from './atoms';

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`ai-footer glassmorphism ${className}`}>
      {/* Neural Network Background Pattern */}
      <div className="footer-neural-pattern">
        <svg className="footer-neural-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 200">
          <defs>
            <filter id="footerGlow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Minimal Neural Connections for Footer */}
          <g className="footer-neural-connections">
            <line x1="50" y1="100" x2="150" y2="80" stroke="rgba(102, 126, 234, 0.2)" strokeWidth="1" className="neural-pulse" filter="url(#footerGlow)" />
            <line x1="150" y1="80" x2="250" y2="120" stroke="rgba(118, 75, 162, 0.2)" strokeWidth="1" className="neural-pulse" filter="url(#footerGlow)" />
            <line x1="250" y1="120" x2="350" y2="90" stroke="rgba(67, 233, 123, 0.2)" strokeWidth="1" className="neural-pulse" filter="url(#footerGlow)" />
            <line x1="550" y1="110" x2="650" y2="85" stroke="rgba(102, 126, 234, 0.2)" strokeWidth="1" className="neural-pulse" filter="url(#footerGlow)" />
            <line x1="650" y1="85" x2="750" y2="115" stroke="rgba(118, 75, 162, 0.2)" strokeWidth="1" className="neural-pulse" filter="url(#footerGlow)" />
          </g>
          
          {/* Neural Nodes */}
          <g className="footer-neural-nodes">
            <circle cx="50" cy="100" r="3" fill="rgba(102, 126, 234, 0.4)" className="floating" filter="url(#footerGlow)" />
            <circle cx="150" cy="80" r="2" fill="rgba(118, 75, 162, 0.4)" className="floating" filter="url(#footerGlow)" />
            <circle cx="250" cy="120" r="4" fill="rgba(67, 233, 123, 0.4)" className="floating" filter="url(#footerGlow)" />
            <circle cx="350" cy="90" r="2" fill="rgba(56, 249, 215, 0.4)" className="floating" filter="url(#footerGlow)" />
            <circle cx="550" cy="110" r="3" fill="rgba(102, 126, 234, 0.4)" className="floating" filter="url(#footerGlow)" />
            <circle cx="650" cy="85" r="2" fill="rgba(118, 75, 162, 0.4)" className="floating" filter="url(#footerGlow)" />
            <circle cx="750" cy="115" r="3" fill="rgba(67, 233, 123, 0.4)" className="floating" filter="url(#footerGlow)" />
          </g>
        </svg>
      </div>

      <div className="footer-content">
        {/* Main Footer Content */}
        <div className="footer-main">
          <div className="footer-brand">
            <Heading level="h3" size="lg" className="ai-heading neural-glow">
              🤖 SmartPlanner AI
            </Heading>
            <Text size="sm" style={{ color: 'rgba(255, 255, 255, 0.7)', marginTop: '0.5rem', maxWidth: '300px' }}>
              Next-generation UI components powered by artificial intelligence and modern design principles.
            </Text>
          </div>

          <div className="footer-links">
            <div className="footer-section">
              <Heading level="h4" size="sm" className="ai-text-gradient" style={{ marginBottom: '1rem' }}>
                Components
              </Heading>
              <ul className="footer-link-list">
                <li><a href="#atoms" className="footer-link">Atoms</a></li>
                <li><a href="#molecules" className="footer-link">Molecules</a></li>
                <li><a href="#organisms" className="footer-link">Organisms</a></li>
                <li><a href="#templates" className="footer-link">Templates</a></li>
              </ul>
            </div>

            <div className="footer-section">
              <Heading level="h4" size="sm" className="ai-text-gradient" style={{ marginBottom: '1rem' }}>
                AI Features
              </Heading>
              <ul className="footer-link-list">
                <li><a href="#themes" className="footer-link">AI Themes</a></li>
                <li><a href="#animations" className="footer-link">Neural Animations</a></li>
                <li><a href="#effects" className="footer-link">Glassmorphism</a></li>
                <li><a href="#patterns" className="footer-link">AI Patterns</a></li>
              </ul>
            </div>

            <div className="footer-section">
              <Heading level="h4" size="sm" className="ai-text-gradient" style={{ marginBottom: '1rem' }}>
                Resources
              </Heading>
              <ul className="footer-link-list">
                <li><a href="#docs" className="footer-link">Documentation</a></li>
                <li><a href="#playground" className="footer-link">Playground</a></li>
                <li><a href="#examples" className="footer-link">Examples</a></li>
                <li><a href="#github" className="footer-link">GitHub</a></li>
              </ul>
            </div>

            <div className="footer-section">
              <Heading level="h4" size="sm" className="ai-text-gradient" style={{ marginBottom: '1rem' }}>
                Connect
              </Heading>
              <div className="footer-social-links">
                <a href="#twitter" className="footer-social-link neural-glow" title="Twitter">
                  🐦
                </a>
                <a href="#github" className="footer-social-link cyber-glow" title="GitHub">
                  💻
                </a>
                <a href="#discord" className="footer-social-link matrix-glow" title="Discord">
                  💬
                </a>
                <a href="#linkedin" className="footer-social-link neural-glow" title="LinkedIn">
                  💼
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-divider"></div>
          <div className="footer-bottom-content">
            <Text size="xs" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              © {currentYear} SmartPlanner AI. Crafted with 🤖 AI and ❤️ passion for modern design.
            </Text>
            <div className="footer-bottom-links">
              <a href="#privacy" className="footer-bottom-link">Privacy Policy</a>
              <a href="#terms" className="footer-bottom-link">Terms of Service</a>
              <a href="#cookies" className="footer-bottom-link">Cookie Policy</a>
            </div>
          </div>
        </div>

        {/* AI Powered Badge */}
        <div className="footer-ai-badge">
          <div className="ai-badge-content neural-gradient">
            <span className="ai-badge-icon">🧠</span>
            <Text size="xs" style={{ color: 'white', fontWeight: '600' }}>
              AI Powered
            </Text>
          </div>
        </div>
      </div>

      {/* AI Disclaimer Footer */}
      <footer style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(24,28,47,0.95)",
        color: "#fff",
        textAlign: "center",
        padding: "10px 0",
        fontSize: "0.95rem",
        zIndex: 100,
        boxShadow: "0 -2px 8px rgba(0,0,0,0.08)"
      }}>
        <span style={{ opacity: 0.85 }}>
          AI Disclaimer: This application uses AI to assist with planning and recommendations. Please verify all important information independently. We are committed to responsible AI and ethical use.
        </span>
      </footer>
    </footer>
  );
};
