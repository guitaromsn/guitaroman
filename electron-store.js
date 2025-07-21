const Store = require('electron-store');

// Define the store schema for type safety and validation
const schema = {
  companyInfo: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      arabicName: { type: 'string' },
      vatNumber: { type: 'string' },
      crNumber: { type: 'string' },
      address: { type: 'string' },
      phone: { type: 'string' },
      email: { type: 'string' },
      logo: { type: 'string' }
    },
    default: {
      name: 'Scrap Metal Trading Co.',
      arabicName: 'شركة تجارة المعادن الخردة',
      vatNumber: '300000000000003',
      crNumber: '1234567890',
      address: 'Riyadh, Saudi Arabia',
      phone: '+966 11 123 4567',
      email: 'info@scrapmetal.sa',
      logo: ''
    }
  },
  appSettings: {
    type: 'object',
    properties: {
      language: { type: 'string', enum: ['en', 'ar', 'bn'] },
      theme: { type: 'string', enum: ['light', 'dark'] },
      currency: { type: 'string' },
      dateFormat: { type: 'string' },
      autoSave: { type: 'boolean' },
      printSettings: {
        type: 'object',
        properties: {
          paperSize: { type: 'string' },
          margins: { type: 'string' },
          includeLogo: { type: 'boolean' }
        }
      }
    },
    default: {
      language: 'en',
      theme: 'light',
      currency: 'SAR',
      dateFormat: 'DD/MM/YYYY',
      autoSave: true,
      printSettings: {
        paperSize: 'A4',
        margins: 'normal',
        includeLogo: true
      }
    }
  },
  database: {
    type: 'object',
    properties: {
      lastSync: { type: 'string' },
      connectionStatus: { type: 'string' }
    },
    default: {
      lastSync: '',
      connectionStatus: 'disconnected'
    }
  },
  recentDocuments: {
    type: 'array',
    default: []
  }
};

// Create store instance with schema
const store = new Store({ schema });

// Helper functions for common operations
const storeHelpers = {
  // Company Information
  getCompanyInfo: () => store.get('companyInfo'),
  setCompanyInfo: (info) => store.set('companyInfo', { ...store.get('companyInfo'), ...info }),
  
  // App Settings
  getAppSettings: () => store.get('appSettings'),
  setAppSettings: (settings) => store.set('appSettings', { ...store.get('appSettings'), ...settings }),
  
  // Language
  getLanguage: () => store.get('appSettings.language'),
  setLanguage: (lang) => store.set('appSettings.language', lang),
  
  // Theme
  getTheme: () => store.get('appSettings.theme'),
  setTheme: (theme) => store.set('appSettings.theme', theme),
  
  // Recent Documents
  getRecentDocuments: () => store.get('recentDocuments'),
  addRecentDocument: (doc) => {
    const recent = store.get('recentDocuments');
    const filtered = recent.filter(item => item.id !== doc.id);
    const updated = [doc, ...filtered].slice(0, 10); // Keep only last 10
    store.set('recentDocuments', updated);
  },
  
  // Database
  getDatabaseInfo: () => store.get('database'),
  setDatabaseInfo: (info) => store.set('database', { ...store.get('database'), ...info }),
  
  // Clear all data (for reset)
  clearAll: () => store.clear(),
  
  // Get all store data
  getAllData: () => store.store,
  
  // Backup/Restore
  exportSettings: () => JSON.stringify(store.store, null, 2),
  importSettings: (jsonData) => {
    try {
      const data = JSON.parse(jsonData);
      Object.keys(data).forEach(key => {
        store.set(key, data[key]);
      });
      return true;
    } catch (error) {
      console.error('Failed to import settings:', error);
      return false;
    }
  }
};

module.exports = {
  store,
  storeHelpers
};
