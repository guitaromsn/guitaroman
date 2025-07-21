import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Components
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './components/Dashboard';
import InvoiceForm from './components/InvoiceForm';
import InvoicePreview from './components/InvoicePreview';
import VoucherForm from './components/VoucherForm';
import VoucherPreview from './components/VoucherPreview';
import QuotationForm from './components/QuotationForm';
import QuotationPreview from './components/QuotationPreview';
import Settings from './components/Settings';
import Analytics from './components/Analytics';

// Database
import { dbManager } from './db';

// Context for app state
export const AppContext = React.createContext();

function App() {
  const { i18n } = useTranslation();
  
  // App state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [dbConnected, setDbConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [appSettings, setAppSettings] = useState({
    language: 'en',
    theme: 'light',
    currency: 'SAR',
    companyInfo: {
      name: 'Scrap Metal Trading Co.',
      arabicName: 'شركة تجارة المعادن الخردة',
      vatNumber: '300000000000003',
      crNumber: '1234567890',
      address: 'Riyadh, Saudi Arabia',
      phone: '+966 11 123 4567',
      email: 'info@scrapmetal.sa'
    }
  });
  
  // Document data
  const [invoices, setInvoices] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [quotations, setQuotations] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [scrapItems, setScrapItems] = useState([]);

  // Initialize app
  useEffect(() => {
    initializeApp();
  }, []);

  // Handle language changes
  useEffect(() => {
    i18n.changeLanguage(appSettings.language);
    document.documentElement.dir = appSettings.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.className = appSettings.language === 'ar' ? 'rtl' : 'ltr';
  }, [appSettings.language, i18n]);

  // Handle menu actions from electron
  useEffect(() => {
    const handleMenuAction = (event, action) => {
      switch (action) {
        case 'new-invoice':
          setCurrentView('invoice-form');
          break;
        case 'new-voucher':
          setCurrentView('voucher-form');
          break;
        case 'new-quotation':
          setCurrentView('quotation-form');
          break;
        case 'settings':
          setCurrentView('settings');
          break;
        case 'dashboard':
          setCurrentView('dashboard');
          break;
        case 'view-invoices':
          setCurrentView('invoices-list');
          break;
        case 'view-vouchers':
          setCurrentView('vouchers-list');
          break;
        case 'view-quotations':
          setCurrentView('quotations-list');
          break;
        default:
          break;
      }
    };

    if (window.electron?.ipcRenderer) {
      window.electron.ipcRenderer.on('menu-action', handleMenuAction);
      return () => {
        window.electron.ipcRenderer.removeListener('menu-action', handleMenuAction);
      };
    }
  }, []);

  const initializeApp = async () => {
    try {
      setLoading(true);
      
      // Load settings from electron store if available
      if (window.electron?.ipcRenderer) {
        const savedSettings = await window.electron.ipcRenderer.invoke('get-store-value', 'appSettings');
        const companyInfo = await window.electron.ipcRenderer.invoke('get-store-value', 'companyInfo');
        
        if (savedSettings) {
          setAppSettings(prev => ({ ...prev, ...savedSettings }));
        }
        if (companyInfo) {
          setAppSettings(prev => ({ ...prev, companyInfo }));
        }
      }

      // Connect to database
      try {
        await dbManager.connect();
        setDbConnected(true);
        
        // Load initial data
        await loadInitialData();
        
        console.log('Database connected and initial data loaded');
      } catch (error) {
        console.error('Database connection failed:', error);
        setDbConnected(false);
        
        // Load sample data for demo
        loadSampleData();
      }
      
    } catch (error) {
      console.error('App initialization failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadInitialData = async () => {
    try {
      // Load from database
      const [itemsData, customersData] = await Promise.all([
        dbManager.getScrapItems(),
        dbManager.getCustomers()
      ]);

      setScrapItems(itemsData || []);
      setCustomers(customersData || []);
      
    } catch (error) {
      console.error('Failed to load initial data:', error);
      loadSampleData();
    }
  };

  const loadSampleData = () => {
    // Sample customers
    setCustomers([
      {
        id: '1',
        name: 'Al Rajhi Steel Trading',
        arabicName: 'تجارة الراجحي للحديد',
        vatNumber: '300000000000001',
        address: 'Industrial City, Riyadh',
        phone: '+966 11 234 5678',
        email: 'info@alrajhisteel.sa'
      },
      {
        id: '2',
        name: 'Sabic Recycling Solutions',
        arabicName: 'حلول إعادة التدوير سابك',
        vatNumber: '300000000000002',
        address: 'Jubail Industrial City',
        phone: '+966 13 345 6789',
        email: 'recycling@sabic.com'
      }
    ]);

    // Sample invoices
    setInvoices([
      {
        id: '1',
        invoiceNumber: 'INV-2024-001',
        customerName: 'Al Rajhi Steel Trading',
        date: '2024-01-15',
        total: 12500.00,
        status: 'paid'
      }
    ]);
  };

  const updateAppSettings = async (newSettings) => {
    const updated = { ...appSettings, ...newSettings };
    setAppSettings(updated);

    // Save to electron store
    if (window.electron?.ipcRenderer) {
      await window.electron.ipcRenderer.invoke('set-store-value', 'appSettings', updated);
    }
  };

  const contextValue = {
    // App state
    sidebarCollapsed,
    setSidebarCollapsed,
    currentView,
    setCurrentView,
    dbConnected,
    setDbConnected,
    appSettings,
    updateAppSettings,
    
    // Data
    invoices,
    setInvoices,
    vouchers,
    setVouchers,
    quotations,
    setQuotations,
    customers,
    setCustomers,
    scrapItems,
    setScrapItems,
    
    // Methods
    loadInitialData,
    initializeApp
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold mb-2">ZATCA Scrap Business App</h2>
          <p className="text-blue-100">Initializing your business management system...</p>
        </div>
      </div>
    );
  }

  return (
    <AppContext.Provider value={contextValue}>
      <Router>
        <div className={`app-container ${appSettings.theme} ${appSettings.language === 'ar' ? 'rtl' : 'ltr'}`}>
          <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            <Sidebar />
            
            <div className={`flex-1 flex flex-col transition-all duration-300 ${
              sidebarCollapsed ? 'ml-16' : 'ml-64'
            }`}>
              <Topbar />
              
              <main className="flex-1 p-6 overflow-y-auto">
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/invoice/new" element={<InvoiceForm />} />
                  <Route path="/invoice/edit/:id" element={<InvoiceForm />} />
                  <Route path="/invoice/preview/:id" element={<InvoicePreview />} />
                  <Route path="/voucher/new" element={<VoucherForm />} />
                  <Route path="/voucher/edit/:id" element={<VoucherForm />} />
                  <Route path="/voucher/preview/:id" element={<VoucherPreview />} />
                  <Route path="/quotation/new" element={<QuotationForm />} />
                  <Route path="/quotation/edit/:id" element={<QuotationForm />} />
                  <Route path="/quotation/preview/:id" element={<QuotationPreview />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </main>
            </div>
          </div>
          
          {/* Connection Status Indicator */}
          <div className={`fixed bottom-4 right-4 px-3 py-2 rounded-lg text-sm font-medium ${
            dbConnected 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                dbConnected ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <span>
                {dbConnected ? 'Database Connected' : 'Offline Mode'}
              </span>
            </div>
          </div>
        </div>
      </Router>
    </AppContext.Provider>
  );
}

export default App;
