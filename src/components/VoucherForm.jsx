import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Save, Receipt } from 'lucide-react';

const VoucherForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    voucherNumber: 'VOU-2024-001',
    voucherDate: new Date().toISOString().split('T')[0],
    voucherType: 'receipt',
    amount: 0,
    paymentMethod: 'cash',
    description: ''
  });

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Receipt className="h-6 w-6 text-green-600" />
            <h1 className="text-2xl font-bold">{t('voucher.newVoucher')}</h1>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Voucher Number</label>
            <input type="text" value={formData.voucherNumber} className="input" readOnly />
          </div>
          <div>
            <label className="label">Date</label>
            <input 
              type="date" 
              value={formData.voucherDate}
              onChange={(e) => setFormData(prev => ({ ...prev, voucherDate: e.target.value }))}
              className="input" 
            />
          </div>
          <div>
            <label className="label">Type</label>
            <select 
              value={formData.voucherType}
              onChange={(e) => setFormData(prev => ({ ...prev, voucherType: e.target.value }))}
              className="select"
            >
              <option value="receipt">Receipt Voucher</option>
              <option value="payment">Payment Voucher</option>
            </select>
          </div>
          <div>
            <label className="label">Amount (SAR)</label>
            <input 
              type="number" 
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) }))}
              className="input" 
              step="0.01"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoucherForm;
