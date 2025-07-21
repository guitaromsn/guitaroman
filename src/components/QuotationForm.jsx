import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Save, FileBarChart } from 'lucide-react';

const QuotationForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    quotationNumber: 'QUO-2024-001',
    quotationDate: new Date().toISOString().split('T')[0],
    validUntil: '',
    customerName: '',
    totalAmount: 0
  });

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileBarChart className="h-6 w-6 text-purple-600" />
            <h1 className="text-2xl font-bold">{t('quotation.newQuotation')}</h1>
          </div>
          <div className="flex space-x-3">
            <button onClick={() => navigate('/dashboard')} className="btn-secondary">
              Cancel
            </button>
            <button className="btn-primary flex items-center space-x-2">
              <Save className="h-4 w-4" />
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label">Quotation Number</label>
            <input type="text" value={formData.quotationNumber} className="input" readOnly />
          </div>
          <div>
            <label className="label">Date</label>
            <input 
              type="date" 
              value={formData.quotationDate}
              onChange={(e) => setFormData(prev => ({ ...prev, quotationDate: e.target.value }))}
              className="input" 
            />
          </div>
          <div>
            <label className="label">Valid Until</label>
            <input 
              type="date" 
              value={formData.validUntil}
              onChange={(e) => setFormData(prev => ({ ...prev, validUntil: e.target.value }))}
              className="input" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotationForm;
