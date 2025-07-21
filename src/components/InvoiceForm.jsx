import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  Save, 
  FileText, 
  Plus, 
  Trash2, 
  Calculator,
  User,
  Package
} from 'lucide-react';

const InvoiceForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    invoiceNumber: 'INV-2024-001',
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    customerId: '',
    customerName: '',
    items: [{
      description: '',
      quantity: 1,
      unitPrice: 0,
      vatRate: 15,
      lineTotal: 0
    }],
    subtotal: 0,
    vatAmount: 0,
    totalAmount: 0,
    notes: ''
  });

  const handleSave = () => {
    console.log('Saving invoice:', formData);
    // Save logic here
    navigate('/dashboard');
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, {
        description: '',
        quantity: 1,
        unitPrice: 0,
        vatRate: 15,
        lineTotal: 0
      }]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('invoice.newInvoice')}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Create a ZATCA-compliant invoice
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-secondary"
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={handleSave}
              className="btn-primary flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{t('common.save')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="label">{t('invoice.invoiceNumber')}</label>
            <input
              type="text"
              value={formData.invoiceNumber}
              className="input"
              readOnly
            />
          </div>
          <div>
            <label className="label">{t('invoice.invoiceDate')}</label>
            <input
              type="date"
              value={formData.invoiceDate}
              onChange={(e) => setFormData(prev => ({ ...prev, invoiceDate: e.target.value }))}
              className="input"
            />
          </div>
          <div>
            <label className="label">{t('invoice.dueDate')}</label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
              className="input"
            />
          </div>
        </div>

        {/* Customer */}
        <div className="mb-6">
          <label className="label">{t('invoice.customer')}</label>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder={t('invoice.selectCustomer')}
              value={formData.customerName}
              onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
              className="input flex-1"
            />
            <button className="btn-secondary flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Select</span>
            </button>
          </div>
        </div>

        {/* Items */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('invoice.items')}
            </h3>
            <button
              onClick={addItem}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>{t('invoice.addItem')}</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('invoice.description')}
                  </th>
                  <th className="text-left py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('invoice.quantity')}
                  </th>
                  <th className="text-left py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('invoice.unitPrice')}
                  </th>
                  <th className="text-left py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('invoice.vatRate')} %
                  </th>
                  <th className="text-left py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('invoice.lineTotal')}
                  </th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                {formData.items.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-2">
                      <input
                        type="text"
                        placeholder="Item description"
                        value={item.description}
                        className="input w-full"
                      />
                    </td>
                    <td className="py-2">
                      <input
                        type="number"
                        value={item.quantity}
                        className="input w-20"
                      />
                    </td>
                    <td className="py-2">
                      <input
                        type="number"
                        value={item.unitPrice}
                        step="0.01"
                        className="input w-24"
                      />
                    </td>
                    <td className="py-2">
                      <input
                        type="number"
                        value={item.vatRate}
                        className="input w-16"
                      />
                    </td>
                    <td className="py-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {(item.quantity * item.unitPrice).toFixed(2)} SAR
                      </span>
                    </td>
                    <td className="py-2">
                      <button className="text-red-500 hover:text-red-700 p-1">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-80 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">{t('invoice.subtotal')}:</span>
              <span className="font-medium">{formData.subtotal.toFixed(2)} SAR</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">{t('invoice.vatAmount')}:</span>
              <span className="font-medium">{formData.vatAmount.toFixed(2)} SAR</span>
            </div>
            <div className="flex justify-between text-lg font-semibold border-t border-gray-200 dark:border-gray-700 pt-2">
              <span className="text-gray-900 dark:text-white">{t('invoice.totalAmount')}:</span>
              <span className="text-gray-900 dark:text-white">{formData.totalAmount.toFixed(2)} SAR</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="mt-6">
          <label className="label">{t('invoice.notes')}</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            className="textarea"
            rows={3}
            placeholder="Additional notes or terms..."
          />
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm;
