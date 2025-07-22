import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { AppContext } from '../App';

const Sidebar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { dbConnected } = useContext(AppContext);

  const menuItems = [
    {
      key: 'dashboard',
      icon: 'fas fa-border-all',
      label: 'Dashboard',
      path: '/dashboard'
    },
    {
      key: 'invoices',
      icon: 'fas fa-file-invoice',
      label: 'Invoices',
      path: '/invoice/new'
    },
    {
      key: 'receipts',
      icon: 'fas fa-receipt',
      label: 'Sales Receipts',
      path: '/receipts'
    },
    {
      key: 'quotes',
      icon: 'fas fa-file-alt',
      label: 'Quotes',
      path: '/quotation/new'
    },
    {
      key: 'credit-notes',
      icon: 'fas fa-undo',
      label: 'Credit Notes',
      path: '/credit-notes'
    }
  ];

  const operationsItems = [
    {
      key: 'inventory',
      icon: 'fas fa-boxes-stacked',
      label: 'Inventory',
      path: '/inventory'
    },
    {
      key: 'projects',
      icon: 'fas fa-briefcase',
      label: 'Projects',
      path: '/projects'
    },
    {
      key: 'expenses',
      icon: 'fas fa-truck',
      label: 'Expense Tracker',
      path: '/expenses'
    }
  ];

  const managementItems = [
    {
      key: 'customers',
      icon: 'fas fa-users',
      label: 'Customers',
      path: '/customers'
    },
    {
      key: 'employees',
      icon: 'fas fa-user-tie',
      label: 'Employees',
      path: '/employees'
    },
    {
      key: 'loans',
      icon: 'fas fa-hand-holding-usd',
      label: 'Loan Management',
      path: '/loans'
    }
  ];

  const complianceItems = [
    {
      key: 'reports',
      icon: 'fas fa-chart-bar',
      label: 'Reports',
      path: '/analytics'
    },
    {
      key: 'vat',
      icon: 'fas fa-percent',
      label: 'VAT Management',
      path: '/vat'
    }
  ];

  const settingsItems = [
    {
      key: 'settings',
      icon: 'fas fa-cog',
      label: 'Settings',
      path: '/settings'
    }
  ];

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const NavItem = ({ item }) => {
    const active = isActive(item.path);
    
    return (
      <button
        onClick={() => handleNavigation(item.path)}
        className={`nav-item ${active ? 'active' : ''}`}
      >
        <i className={item.icon}></i>
        <span>{item.label}</span>
      </button>
    );
  };

  const NavSection = ({ title, items }) => (
    <>
      <div className="nav-section-title">{title}</div>
      {items.map((item) => (
        <NavItem key={item.key} item={item} />
      ))}
    </>
  );

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <i className="fas fa-recycle"></i>
        </div>
        <span className="brand-title">Amanat Al-Kalima</span>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavItem key={item.key} item={item} />
        ))}
        
        <NavSection title="Operations" items={operationsItems} />
        <NavSection title="Management" items={managementItems} />
        <NavSection title="Compliance" items={complianceItems} />
      </nav>
      
      <div className="sidebar-footer">
        {settingsItems.map((item) => (
          <NavItem key={item.key} item={item} />
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
