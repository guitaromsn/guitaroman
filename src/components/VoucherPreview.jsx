import React from 'react';
import { Receipt } from 'lucide-react';

const VoucherPreview = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="text-center py-12">
          <Receipt className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Voucher Preview</h2>
          <p className="text-gray-600 dark:text-gray-400">This feature is coming soon</p>
        </div>
      </div>
    </div>
  );
};

export default VoucherPreview;
