import React from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart3, TrendingUp, PieChart, Activity } from 'lucide-react';

const Analytics = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('analytics.title')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Business analytics and reporting dashboard
            </p>
          </div>
        </div>
      </div>

      {/* Coming Soon */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12">
        <div className="text-center">
          <div className="flex justify-center space-x-4 mb-6">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <TrendingUp className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <PieChart className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Activity className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Advanced Analytics Coming Soon
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            We're working on comprehensive analytics features including sales reports, 
            customer insights, inventory analysis, and financial dashboards.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
