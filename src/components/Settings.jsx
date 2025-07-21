import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Save,
  Building2,
  Globe,
  Palette,
  Database,
  FileText,
  Upload,
  Download,
  TestTube,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

import { AppContext } from '../App';
import { dbManager } from '../db';

const Settings = () => {
  const { t } = useTranslation();
  const { appSettings, updateAppSettings, dbConnected, setDbConnected } = useContext(AppContext);
  
  const [activeTab, setActiveTab] = useState('company');
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    companyInfo: {
      name: appSettings.companyInfo?.name || '',
      arabicName: appSettings.companyInfo?.arabicName || '',
      vatNumber: appSettings.companyInfo?.vatNumber || '',
      crNumber: appSettings.companyInfo?.crNumber || '',
      address: appSettings.companyInfo?.address || '',
      phone: appSettings.companyInfo?.phone || '',
      email: appSettings.companyInfo?.email || '',
      logo: appSettings.companyInfo?.logo || ''
    },
    appSettings: {
      language: appSettings.language || 'en',
      theme: appSettings.theme || 'light',
      currency: appSettings.currency || 'SAR',
      dateFormat: appSettings.dateFormat || 'DD/MM/YYYY'
    }
  });

  const tabs = [
    { id: 'company', label: t('settings.companyInfo'), icon: Building2 },
    { id: 'app', label: t('settings.appSettings'), icon: Globe },
    { id: 'theme', label: 'Theme & Display', icon: Palette },
    { id: 'database', label: t('settings.databaseSettings'), icon: Database },
    { id: 'backup', label: t('settings.backupRestore'), icon: FileText }
  ];

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedSettings = {
        companyInfo: formData.companyInfo,
        ...formData.appSettings
      };

      await updateAppSettings(updatedSettings);

      // Show success message
      setConnectionStatus({ type: 'success', message: 'Settings saved successfully!' });
      setTimeout(() => setConnectionStatus(null), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setConnectionStatus({ type: 'error', message: 'Failed to save settings' });
      setTimeout(() => setConnectionStatus(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const testDatabaseConnection = async () => {
    setIsTestingConnection(true);
    try {
      const isConnected = await dbManager.testConnection();
      if (isConnected) {
        setConnectionStatus({ type: 'success', message: 'Database connection successful!' });
        setDbConnected(true);
      } else {
        throw new Error('Connection test failed');
      }
    } catch (error) {
      console.error('Database connection test failed:', error);
      setConnectionStatus({ type: 'error', message: 'Database connection failed' });
      setDbConnected(false);
    } finally {
      setIsTestingConnection(false);
      setTimeout(() => setConnectionStatus(null), 5000);
    }
  };

  const exportSettings = () => {
    try {
      const settings = {
        companyInfo: formData.companyInfo,
        appSettings: formData.appSettings,
        exportDate: new Date().toISOString()
      };

      const dataStr = JSON.stringify(settings, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `zatca-settings-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();

      setConnectionStatus({ type: 'success', message: 'Settings exported successfully!' });
      setTimeout(() => setConnectionStatus(null), 3000);
    } catch (error) {
      console.error('Export failed:', error);
      setConnectionStatus({ type: 'error', message: 'Export failed' });
      setTimeout(() => setConnectionStatus(null), 3000);
    }
  };

  const importSettings = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        
        if (imported.companyInfo) {
          setFormData(prev => ({
            ...prev,
            companyInfo: { ...prev.companyInfo, ...imported.companyInfo }
          }));
        }
        
        if (imported.appSettings) {
          setFormData(prev => ({
            ...prev,
            appSettings: { ...prev.appSettings, ...imported.appSettings }
          }));
        }

        setConnectionStatus({ type: 'success', message: 'Settings imported successfully!' });
        setTimeout(() => setConnectionStatus(null), 3000);
      } catch (error) {
        console.error('Import failed:', error);
        setConnectionStatus({ type: 'error', message: 'Import failed - invalid file format' });
        setTimeout(() => setConnectionStatus(null), 3000);
      }
    };
    reader.readAsText(file);
  };

  const renderCompanySettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('settings.companyName')}
          </label>
          <input
            type="text"
            value={formData.companyInfo.name}
            onChange={(e) => handleInputChange('companyInfo', 'name', e.target.value)}
            className="input"
            placeholder="Enter company name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('settings.companyArabicName')}
          </label>
          <input
            type="text"
            value={formData.companyInfo.arabicName}
            onChange={(e) => handleInputChange('companyInfo', 'arabicName', e.target.value)}
            className="input"
            placeholder="اسم الشركة بالعربية"
            dir="rtl"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('settings.vatNumber')}
          </label>
          <input
            type="text"
            value={formData.companyInfo.vatNumber}
            onChange={(e) => handleInputChange('companyInfo', 'vatNumber', e.target.value)}
            className="input"
            placeholder="300000000000003"
            maxLength={15}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('settings.crNumber')}
          </label>
          <input
            type="text"
            value={formData.companyInfo.crNumber}
            onChange={(e) => handleInputChange('companyInfo', 'crNumber', e.target.value)}
            className="input"
            placeholder="1234567890"
            maxLength={10}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('settings.companyPhone')}
          </label>
          <input
            type="text"
            value={formData.companyInfo.phone}
            onChange={(e) => handleInputChange('companyInfo', 'phone', e.target.value)}
            className="input"
            placeholder="+966 11 123 4567"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('settings.companyEmail')}
          </label>
          <input
            type="email"
            value={formData.companyInfo.email}
            onChange={(e) => handleInputChange('companyInfo', 'email', e.target.value)}
            className="input"
            placeholder="info@company.sa"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('settings.companyAddress')}
        </label>
        <textarea
          value={formData.companyInfo.address}
          onChange={(e) => handleInputChange('companyInfo', 'address', e.target.value)}
          className="textarea"
          rows={3}
          placeholder="Enter complete company address"
        />
      </div>
    </div>
  );

  const renderAppSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('settings.language')}
          </label>
          <select
            value={formData.appSettings.language}
            onChange={(e) => handleInputChange('appSettings', 'language', e.target.value)}
            className="select"
          >
            <option value="en">English</option>
            <option value="ar">العربية</option>
            <option value="bn">বাংলা</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('settings.currency')}
          </label>
          <select
            value={formData.appSettings.currency}
            onChange={(e) => handleInputChange('appSettings', 'currency', e.target.value)}
            className="select"
          >
            <option value="SAR">Saudi Riyal (SAR)</option>
            <option value="USD">US Dollar (USD)</option>
            <option value="EUR">Euro (EUR)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('settings.dateFormat')}
          </label>
          <select
            value={formData.appSettings.dateFormat}
            onChange={(e) => handleInputChange('appSettings', 'dateFormat', e.target.value)}
            className="select"
          >
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('settings.theme')}
          </label>
          <select
            value={formData.appSettings.theme}
            onChange={(e) => handleInputChange('appSettings', 'theme', e.target.value)}
            className="select"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderDatabaseSettings = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
              {t('settings.connectionStatus')}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Azure SQL Database Connection
            </p>
          </div>
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
            dbConnected 
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
          }`}>
            {dbConnected ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
            <span>{dbConnected ? t('settings.connected') : t('settings.disconnected')}</span>
          </div>
        </div>

        <button
          onClick={testDatabaseConnection}
          disabled={isTestingConnection}
          className="btn-secondary flex items-center space-x-2"
        >
          <TestTube className="h-4 w-4" />
          <span>{isTestingConnection ? 'Testing...' : t('settings.testConnection')}</span>
        </button>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200">
              Database Information
            </h4>
            <div className="mt-2 text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <p>Server: roman-zatca-server.database.windows.net</p>
              <p>Database: InvoiceMakerPro</p>
              <p>Connection is encrypted and secure</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBackupSettings = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Settings Backup & Restore
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={exportSettings}
            className="btn-secondary flex items-center justify-center space-x-2 p-4"
          >
            <Download className="h-5 w-5" />
            <span>{t('settings.exportSettings')}</span>
          </button>

          <label className="btn-secondary flex items-center justify-center space-x-2 p-4 cursor-pointer">
            <Upload className="h-5 w-5" />
            <span>{t('settings.importSettings')}</span>
            <input
              type="file"
              accept=".json"
              onChange={importSettings}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900/30 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-yellow-900 dark:text-yellow-200">
              Important Note
            </h4>
            <p className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
              Backup your settings regularly. The exported file contains company information and application preferences.
              Keep this file secure as it contains sensitive business information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('settings.title')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Configure your application settings and preferences
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="btn-primary flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>{isSaving ? 'Saving...' : t('common.save')}</span>
          </button>
        </div>

        {/* Status Messages */}
        {connectionStatus && (
          <div className={`mt-4 p-3 rounded-lg flex items-center space-x-2 ${
            connectionStatus.type === 'success' 
              ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : connectionStatus.type === 'error'
              ? 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              : 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
          }`}>
            {connectionStatus.type === 'success' && <CheckCircle className="h-4 w-4" />}
            {connectionStatus.type === 'error' && <XCircle className="h-4 w-4" />}
            {connectionStatus.type === 'info' && <AlertCircle className="h-4 w-4" />}
            <span className="text-sm font-medium">{connectionStatus.message}</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'company' && renderCompanySettings()}
          {activeTab === 'app' && renderAppSettings()}
          {activeTab === 'theme' && renderAppSettings()}
          {activeTab === 'database' && renderDatabaseSettings()}
          {activeTab === 'backup' && renderBackupSettings()}
        </div>
      </div>
    </div>
  );
};

export default Settings;
