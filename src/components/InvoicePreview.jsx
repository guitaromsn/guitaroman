import React from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Download, Print } from 'lucide-react';

const InvoicePreview = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-bold">Invoice Preview</h1>
          </div>
          <div className="flex space-x-3">
            <button className="btn-secondary flex items-center space-x-2">
              <Print className="h-4 w-4" />
              <span>Print</span>
            </button>
            <button className="btn-primary flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-sm border">
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Invoice Preview</h2>
          <p className="text-gray-600">This feature is coming soon</p>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;
