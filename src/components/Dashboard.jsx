import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Plus,
  FileText,
  Receipt,
  FileBarChart,
  TrendingUp,
  DollarSign,
  Clock,
  Users,
  Package,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Edit,
  MoreHorizontal
} from 'lucide-react';

import { AppContext } from '../App';
import ZATCAFormatUtils from '../zatca/formatUtils';

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    appSettings,
    invoices,
    vouchers,
    quotations,
    customers,
    scrapItems,
    dbConnected
  } = useContext(AppContext);

  const [dashboardData, setDashboardData] = useState({
    totalInvoices: 0,
    totalRevenue: 0,
    pendingPayments: 0,
    monthlyGrowth: 0,
    recentInvoices: [],
    topCustomers: [],
    salesTrend: []
  });

  const formatUtils = new ZATCAFormatUtils();

  useEffect(() => {
    calculateDashboardStats();
  }, [invoices, vouchers, quotations, customers]);

  const calculateDashboardStats = () => {
    // Calculate basic statistics
    const totalInvoices = invoices.length;
    const totalRevenue = invoices.reduce((sum, invoice) => sum + (invoice.totalAmount || invoice.total || 0), 0);
    
    // Calculate pending payments (unpaid invoices)
    const pendingPayments = invoices
      .filter(invoice => invoice.status !== 'paid')
      .reduce((sum, invoice) => sum + (invoice.totalAmount || invoice.total || 0), 0);

    // Calculate monthly growth (simplified)
    const currentMonth = new Date().getMonth();
    const currentMonthInvoices = invoices.filter(invoice => 
      new Date(invoice.invoiceDate || invoice.date).getMonth() === currentMonth
    );
    const currentMonthRevenue = currentMonthInvoices.reduce((sum, invoice) => 
      sum + (invoice.totalAmount || invoice.total || 0), 0
    );

    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthInvoices = invoices.filter(invoice => 
      new Date(invoice.invoiceDate || invoice.date).getMonth() === lastMonth
    );
    const lastMonthRevenue = lastMonthInvoices.reduce((sum, invoice) => 
      sum + (invoice.totalAmount || invoice.total || 0), 0
    );

    const monthlyGrowth = lastMonthRevenue > 0 
      ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
      : 0;

    // Get recent invoices (last 5)
    const recentInvoices = [...invoices]
      .sort((a, b) => new Date(b.invoiceDate || b.date) - new Date(a.invoiceDate || a.date))
      .slice(0, 5);

    // Calculate top customers
    const customerRevenue = {};
    invoices.forEach(invoice => {
      const customerId = invoice.customerId || invoice.customerName;
      if (customerId) {
        customerRevenue[customerId] = (customerRevenue[customerId] || 0) + (invoice.totalAmount || invoice.total || 0);
      }
    });

    const topCustomers = Object.entries(customerRevenue)
      .map(([customerId, revenue]) => ({
        id: customerId,
        name: customerId, // In real app, this would be resolved from customers array
        revenue
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    setDashboardData({
      totalInvoices,
      totalRevenue,
      pendingPayments,
      monthlyGrowth,
      recentInvoices,
      topCustomers,
      salesTrend: [] // Would be calculated from historical data
    });
  };

  const quickActions = [
    {
      title: t('dashboard.newInvoice'),
      description: 'Create a ZATCA-compliant invoice',
      icon: FileText,
      color: 'bg-blue-500',
      action: () => navigate('/invoice/new')
    },
    {
      title: t('dashboard.newVoucher'),
      description: 'Create receipt or payment voucher',
      icon: Receipt,
      color: 'bg-green-500',
      action: () => navigate('/voucher/new')
    },
    {
      title: t('dashboard.newQuotation'),
      description: 'Create price quotation',
      icon: FileBarChart,
      color: 'bg-purple-500',
      action: () => navigate('/quotation/new')
    },
    {
      title: t('dashboard.manageCustomers'),
      description: 'Add and manage customers',
      icon: Users,
      color: 'bg-orange-500',
      action: () => navigate('/customers')
    }
  ];

  const statsCards = [
    {
      title: t('dashboard.totalInvoices'),
      value: dashboardData.totalInvoices.toString(),
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/30',
      change: null
    },
    {
      title: t('dashboard.totalRevenue'),
      value: formatUtils.formatCurrency(dashboardData.totalRevenue, 'SAR', appSettings.language),
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/30',
      change: null
    },
    {
      title: t('dashboard.pendingPayments'),
      value: formatUtils.formatCurrency(dashboardData.pendingPayments, 'SAR', appSettings.language),
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/30',
      change: null
    },
    {
      title: t('dashboard.monthlyGrowth'),
      value: formatUtils.formatPercentage(dashboardData.monthlyGrowth, 1, appSettings.language),
      icon: TrendingUp,
      color: dashboardData.monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: dashboardData.monthlyGrowth >= 0 ? 'bg-green-50 dark:bg-green-900/30' : 'bg-red-50 dark:bg-red-900/30',
      change: dashboardData.monthlyGrowth >= 0 ? 'up' : 'down'
    }
  ];

  const getStatusBadge = (status) => {
    const badges = {
      draft: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      sent: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      paid: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      overdue: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    };
    
    return badges[status] || badges.draft;
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">{t('dashboard.welcome')}</h1>
        <p className="text-blue-100">
          Manage your scrap metal business with ZATCA-compliant invoicing
        </p>
        {!dbConnected && (
          <div className="mt-3 p-3 bg-yellow-500/20 rounded-lg border border-yellow-400/30">
            <p className="text-sm">
              📄 Running in offline mode. Database connection not available.
            </p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={action.action}
              className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow text-left group"
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${action.color} text-white group-hover:scale-110 transition-transform`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 dark:text-white truncate">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {action.description}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center text-blue-600 dark:text-blue-400">
                <Plus className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">Create Now</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
              {stat.change && (
                <div className="mt-4 flex items-center">
                  {stat.change === 'up' ? (
                    <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${stat.change === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change === 'up' ? 'Increased' : 'Decreased'} this month
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Invoices */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('dashboard.recentInvoices')}
              </h3>
              <button
                onClick={() => navigate('/invoices')}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                {t('dashboard.viewAll')}
              </button>
            </div>
          </div>
          
          <div className="p-6">
            {dashboardData.recentInvoices.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No invoices yet</p>
                <button
                  onClick={() => navigate('/invoice/new')}
                  className="mt-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 text-sm font-medium"
                >
                  Create your first invoice
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {dashboardData.recentInvoices.map((invoice, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {invoice.invoiceNumber || invoice.number || `INV-${index + 1}`}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {invoice.customerName || 'Customer'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(invoice.status || 'draft')}`}>
                        {invoice.status || 'draft'}
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatUtils.formatCurrency(invoice.totalAmount || invoice.total || 0, 'SAR', appSettings.language)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats & Activity */}
        <div className="space-y-6">
          {/* Top Customers */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('dashboard.topCustomers')}
              </h3>
            </div>
            <div className="p-6">
              {dashboardData.topCustomers.length === 0 ? (
                <div className="text-center py-4">
                  <Users className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">No customers yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {dashboardData.topCustomers.map((customer, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-white">
                            {customer.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {customer.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Customer
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatUtils.formatCurrency(customer.revenue, 'SAR', appSettings.language)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* System Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                System Status
              </h3>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Database</span>
                <span className={`text-sm font-medium ${dbConnected ? 'text-green-600' : 'text-red-600'}`}>
                  {dbConnected ? 'Connected' : 'Offline'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">ZATCA Compliance</span>
                <span className="text-sm font-medium text-green-600">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Items</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {scrapItems.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Customers</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {customers.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
