import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard,
  FileText,
  Receipt,
  FileBarChart,
  Users,
  Package,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Building2,
  Zap
} from 'lucide-react';

import { AppContext } from '../App';

const Sidebar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarCollapsed, setSidebarCollapsed, dbConnected } = useContext(AppContext);

  const menuItems = [
    {
      key: 'dashboard',
      icon: LayoutDashboard,
      label: t('navigation.dashboard'),
      path: '/dashboard',
      badge: null
    },
    {
      key: 'divider1',
      type: 'divider',
      label: 'Documents'
    },
    {
      key: 'invoices',
      icon: FileText,
      label: t('navigation.invoices'),
      path: '/invoices',
      subItems: [
        { key: 'new-invoice', label: 'New Invoice', path: '/invoice/new' },
        { key: 'all-invoices', label: 'All Invoices', path: '/invoices' }
      ]
    },
    {
      key: 'vouchers',
      icon: Receipt,
      label: t('navigation.vouchers'),
      path: '/vouchers',
      subItems: [
        { key: 'new-voucher', label: 'New Voucher', path: '/voucher/new' },
        { key: 'all-vouchers', label: 'All Vouchers', path: '/vouchers' }
      ]
    },
    {
      key: 'quotations',
      icon: FileBarChart,
      label: t('navigation.quotations'),
      path: '/quotations',
      subItems: [
        { key: 'new-quotation', label: 'New Quotation', path: '/quotation/new' },
        { key: 'all-quotations', label: 'All Quotations', path: '/quotations' }
      ]
    },
    {
      key: 'divider2',
      type: 'divider',
      label: 'Management'
    },
    {
      key: 'customers',
      icon: Users,
      label: t('navigation.customers'),
      path: '/customers'
    },
    {
      key: 'items',
      icon: Package,
      label: t('navigation.items'),
      path: '/items'
    },
    {
      key: 'divider3',
      type: 'divider',
      label: 'Reports'
    },
    {
      key: 'analytics',
      icon: BarChart3,
      label: t('navigation.analytics'),
      path: '/analytics'
    },
    {
      key: 'divider4',
      type: 'divider',
      label: 'System'
    },
    {
      key: 'settings',
      icon: Settings,
      label: t('navigation.settings'),
      path: '/settings'
    }
  ];

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const MenuItem = ({ item, level = 0 }) => {
    if (item.type === 'divider') {
      if (sidebarCollapsed) return null;
      
      return (
        <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-700">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            {item.label}
          </span>
        </div>
      );
    }

    const Icon = item.icon;
    const active = isActive(item.path);

    return (
      <div className="relative">
        <button
          onClick={() => handleNavigation(item.path)}
          className={`
            w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-150
            ${active 
              ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700 dark:bg-blue-900/50 dark:text-blue-200' 
              : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
            }
            ${sidebarCollapsed ? 'justify-center' : 'justify-start'}
            ${level > 0 ? 'ml-4' : ''}
          `}
          title={sidebarCollapsed ? item.label : undefined}
        >
          <Icon className={`${sidebarCollapsed ? 'h-5 w-5' : 'h-4 w-4'} ${!sidebarCollapsed && 'mr-3'} flex-shrink-0`} />
          
          {!sidebarCollapsed && (
            <span className="truncate">{item.label}</span>
          )}
          
          {!sidebarCollapsed && item.badge && (
            <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200">
              {item.badge}
            </span>
          )}
        </button>

        {/* Sub-items */}
        {!sidebarCollapsed && item.subItems && active && (
          <div className="mt-1 space-y-1">
            {item.subItems.map((subItem) => (
              <button
                key={subItem.key}
                onClick={() => handleNavigation(subItem.path)}
                className={`
                  w-full flex items-center px-6 py-2 text-xs font-medium rounded-lg transition-colors duration-150 ml-4
                  ${isActive(subItem.path)
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200'
                    : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700'
                  }
                `}
              >
                {subItem.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className={`
      fixed left-0 top-0 z-40 h-screen bg-white border-r border-gray-200 shadow-sm transition-all duration-300 ease-in-out
      dark:bg-gray-800 dark:border-gray-700
      ${sidebarCollapsed ? 'w-16' : 'w-64'}
    `}>
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
        {!sidebarCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-900 dark:text-white">ZATCA</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Scrap Business</p>
            </div>
          </div>
        )}
        
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-gray-500" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <MenuItem key={item.key} item={item} />
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        {/* Connection Status */}
        <div className={`
          flex items-center justify-center space-x-2 px-2 py-2 rounded-lg text-xs font-medium
          ${dbConnected 
            ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
            : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
          }
        `}>
          <div className={`
            w-2 h-2 rounded-full
            ${dbConnected ? 'bg-green-500' : 'bg-red-500'}
          `}></div>
          {!sidebarCollapsed && (
            <span>
              {dbConnected ? 'Connected' : 'Offline'}
            </span>
          )}
        </div>

        {/* ZATCA Compliance Badge */}
        {!sidebarCollapsed && (
          <div className="mt-2 flex items-center justify-center px-2 py-2 bg-green-50 rounded-lg dark:bg-green-900/30">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="text-xs font-medium text-green-700 dark:text-green-400">
                ZATCA Compliant
              </span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
