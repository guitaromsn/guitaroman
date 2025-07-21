import React from 'react';
import { getText, businessTexts } from '../utils/currency';
import './Header.css';

interface HeaderProps {
  locale: string;
  onLocaleChange: (locale: string) => void;
  onMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ locale, onLocaleChange, onMenuToggle }) => {
  const currentTime = new Date().toLocaleString(locale === 'ar' ? 'ar-SA' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const currentDate = new Date().toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-toggle" onClick={onMenuToggle}>
          <i className="fas fa-bars"></i>
        </button>
        
        <div className="logo-section">
          <img src="/logo.svg" alt="Amanat Al-Kalima" className="logo" />
          <div className="company-info">
            <h1 className="company-name">
              {getText(businessTexts.companyName, locale)}
            </h1>
            <span className="subtitle">ERP System</span>
          </div>
        </div>
      </div>

      <div className="header-center">
        <div className="datetime-info">
          <div className="time">{currentTime}</div>
          <div className="date">{currentDate}</div>
        </div>
      </div>

      <div className="header-right">
        <div className="language-switcher">
          <button 
            className={`lang-btn ${locale === 'en' ? 'active' : ''}`}
            onClick={() => onLocaleChange('en')}
          >
            EN
          </button>
          <button 
            className={`lang-btn ${locale === 'ar' ? 'active' : ''}`}
            onClick={() => onLocaleChange('ar')}
          >
            ع
          </button>
        </div>

        <div className="user-menu">
          <div className="user-info">
            <span className="user-name">Admin User</span>
            <span className="user-role">Administrator</span>
          </div>
          <div className="user-avatar">
            <i className="fas fa-user-circle"></i>
          </div>
        </div>

        <div className="header-actions">
          <button className="action-btn" title="Notifications">
            <i className="fas fa-bell"></i>
            <span className="notification-badge">3</span>
          </button>
          
          <button className="action-btn" title="Settings">
            <i className="fas fa-cog"></i>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;