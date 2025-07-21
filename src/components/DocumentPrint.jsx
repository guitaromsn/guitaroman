import React from 'react';
import { Printer } from 'lucide-react';

const DocumentPrint = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="text-center py-12">
          <Printer className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Document Print</h2>
          <p className="text-gray-600 dark:text-gray-400">Print functionality is coming soon</p>
        </div>
      </div>
    </div>
  );
};

export default DocumentPrint;
