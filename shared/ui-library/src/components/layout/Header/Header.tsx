import React from 'react';
import './Header.css';

export interface HeaderProps {
  className?: string;
  user?: {
    name: string;
    email?: string;
    avatar?: string;
  };
  currentPage?: string;
  onNavigate?: (page: string) => void;
  showSearch?: boolean;
  showNotifications?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  className, 
  user, 
  currentPage, 
  onNavigate, 
  showSearch = true, 
  showNotifications = true 
}) => {
  const handleNavClick = (page: string) => {
    onNavigate?.(page);
  };

  return (
    <header className={`header ${className || ''}`}>
      <div className="header-container">
        {/* Brand Section */}
        <div className="header-brand">
          <div className="brand-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor">
              <path d="M16 2C9.384 2 4 7.384 4 14c0 8 12 16 12 16s12-8 12-16c0-6.616-5.384-12-12-12zm0 16c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4z"/>
            </svg>
          </div>
          <div className="brand-text">
            <h3 className="brand-title">SmartPlanner</h3>
            <p className="brand-subtitle">AI-Powered Planning</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="header-nav">
          <button 
            className={`nav-item ${currentPage === 'home' ? 'active' : ''}`}
            onClick={() => handleNavClick('home')}
          >
            Home
          </button>
          <button 
            className={`nav-item ${currentPage === 'plans' ? 'active' : ''}`}
            onClick={() => handleNavClick('plans')}
          >
            Plans
          </button>
          <button 
            className={`nav-item ${currentPage === 'analytics' ? 'active' : ''}`}
            onClick={() => handleNavClick('analytics')}
          >
            Analytics
          </button>
          <button 
            className={`nav-item ${currentPage === 'resources' ? 'active' : ''}`}
            onClick={() => handleNavClick('resources')}
          >
            Resources
          </button>
          <button 
            className={`nav-item ${currentPage === 'support' ? 'active' : ''}`}
            onClick={() => handleNavClick('support')}
          >
            Support
          </button>
        </nav>

        {/* Search */}
        {showSearch && (
          <div className="header-search">
            <div className="search-input-container">
              <svg className="search-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
              </svg>
              <input 
                type="text" 
                placeholder="Search plans, analytics..." 
                className="search-input"
                aria-label="Search"
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="header-actions">
          {showNotifications && (
            <button className="action-btn notification-btn">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
              </svg>
              <span className="notification-badge">3</span>
            </button>
          )}
          
          <button className="cta-btn">Create Plan</button>
          
          {user && (
            <div className="user-avatar" title={user.name}>
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  width="32"
                  height="32"
                />
              ) : (
                <span className="user-initials">
                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
