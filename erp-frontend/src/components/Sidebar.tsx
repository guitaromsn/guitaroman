import React from 'react';
import { getText, businessTexts } from '../utils/currency';
import './Sidebar.css';

type Page = 'dashboard' | 'inventory' | 'invoices' | 'projects' | 'reports';

interface SidebarProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
  locale: string;
  isOpen: boolean;
}

interface MenuItem {
  id: Page;
  icon: string;
  label: { en: string; ar: string };
  badge?: number;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange, locale, isOpen }) => {
  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      icon: 'fas fa-tachometer-alt',
      label: businessTexts.dashboard,
    },
    {
      id: 'inventory',
      icon: 'fas fa-boxes',
      label: businessTexts.inventory,
      badge: 5,
    },
    {
      id: 'invoices',
      icon: 'fas fa-file-invoice-dollar',
      label: businessTexts.invoices,
      badge: 12,
    },
    {
      id: 'projects',
      icon: 'fas fa-project-diagram',
      label: businessTexts.projects,
    },
    {
      id: 'reports',
      icon: 'fas fa-chart-line',
      label: businessTexts.reports,
    },
  ];

  const quickActions = [
    {
      label: { en: 'New Invoice', ar: 'فاتورة جديدة' },
      icon: 'fas fa-plus',
      action: () => onPageChange('invoices'),
    },
    {
      label: { en: 'Add Product', ar: 'إضافة منتج' },
      icon: 'fas fa-plus-circle',
      action: () => onPageChange('inventory'),
    },
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-content">
        <nav className="sidebar-nav">
          <ul className="nav-list">
            {menuItems.map((item) => (
              <li key={item.id} className="nav-item">
                <button
                  className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
                  onClick={() => onPageChange(item.id)}
                  title={getText(item.label, locale)}
                >
                  <i className={item.icon}></i>
                  <span className="nav-text">{getText(item.label, locale)}</span>
                  {item.badge && (
                    <span className="nav-badge">{item.badge}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-section">
          <h3 className="section-title">
            {locale === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}
          </h3>
          <div className="quick-actions">
            {quickActions.map((action, index) => (
              <button
                key={index}
                className="quick-action-btn"
                onClick={action.action}
                title={getText(action.label, locale)}
              >
                <i className={action.icon}></i>
                <span>{getText(action.label, locale)}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="system-info">
            <div className="info-item">
              <i className="fas fa-server"></i>
              <span>{locale === 'ar' ? 'النظام متصل' : 'System Online'}</span>
            </div>
            <div className="info-item">
              <i className="fas fa-shield-alt"></i>
              <span>{locale === 'ar' ? 'آمن' : 'Secure'}</span>
            </div>
            <div className="info-item currency-info">
              <i className="fas fa-coins"></i>
              <span>SAR (ر.س)</span>
            </div>
          </div>
          
          <div className="zatca-badge">
            <i className="fas fa-certificate"></i>
            <span>{locale === 'ar' ? 'متوافق مع زاتكا' : 'ZATCA Compliant'}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;